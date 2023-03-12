from celery.utils.log import get_task_logger
from django.db import transaction

from core.utils.currency import convert_to_kobo_integer, convert_to_naira
from financials.models import PaystackPlan, PaystackPlanFailures

logger = get_task_logger(__name__)


def format_paystack_plan_payloads(bill_actions):
    """Formats multiple payloads to be sent to Paystack to create plans for bill
    actions.

    Args:
        bill_actions (List[BillAction]): A list of BillAction objects representing
        actions to be performed on a bill.

    Returns:
        List[Dict[str, Union[str, int]]]: A list of dictionaries representing Paystack
        plan payloads. Each dictionary contains the following keys: 'name', 'amount',
        'interval', 'description', and 'currency'.
    """

    paystack_plan_payloads = []

    for action in bill_actions:
        user_name = (
            action.participant.full_name
            if action.participant
            else action.unregistered_participant.name
        )

        user_uuid = (
            f"Participant id: {action.participant.uuid}"
            if action.participant
            else (
                f"Unregistered participant id: {action.unregistered_participant.uuid}"
            )
        )

        # ! Be careful not to change name without a good reason.
        # ! The subscription flow is heavily dependent on the uuids in it.
        # TODO move the bulk of this to description to clean up plan name.

        name = (
            "Plan for"
            f" {user_name} on"
            f" the '{action.bill.name}' bill. {user_uuid}. Action id: {action.uuid}"
        )
        amount_in_kobo = convert_to_kobo_integer(action.total_payment_due)
        interval = action.bill.interval
        description = (
            "Paystack plan for "
            f"{user_name} on the '{action.bill.name}' bill. Bill id: {action.bill.uuid}"
        )
        currency = action.bill.currency_code

        paystack_plan_payloads.append(
            {
                "name": name,
                "amount": amount_in_kobo,
                "interval": interval,
                "description": description,
                "currency": currency,
            }
        )

    return paystack_plan_payloads


def get_participant_and_action_uuids_from_plan(plan_name_string):
    """Extract the participant and action UUIDs from a plan's name string.

    The name string format is:
        "Plan for <participant_name> on the '<bill_name>' bill. Participant id:
        <participant_uuid>. Action id: <action_uuid>"
        or
        "Plan for <unregistered_participant_name> on the '<bill_name>' bill.
        Unregistered participant id: <unregistered participant_uuid>. Action id:
        <action_uuid>"

    Args:
        plan_name_string (str): The plan's name string to extract the UUIDs from

    Returns:
        tuple: The participant UUID, boolean indicating if participant is registered,
            and the action UUID
    """

    if "Participant id:" in plan_name_string:
        is_participant_registered = True
        participant_index = plan_name_string.index("Participant id:") + len(
            "Participant id:"
        )
    else:
        is_participant_registered = False
        participant_index = plan_name_string.index(
            "Unregistered participant id:"
        ) + len("Unregistered participant id:")

    participant_uuid = plan_name_string[
        participant_index : plan_name_string.index(". Action id")  # noqa E203
    ].strip()

    action_index = plan_name_string.index("Action id: ") + len("Action id: ")
    action_uuid = plan_name_string[action_index:].strip()

    return participant_uuid, is_participant_registered, action_uuid


def create_participants_and_actions_index(bill_actions):
    """Create dictionary indexes that can be used to find specific objects
    inside for loop below (over paystack responses), without making (n+1) queries.

    Participant objects should have been prefetched earlier.

    ! Currently replaced with an approach base on positional index.
    ! Come back to use this if the positional index based approach proves to be buggy.
    In such a case the actions index would be used like this:
        - action = actions_index.get(participant_uuid)
    and the participants index like this:
        - user = participants_index.get(participant_uuid)
    The uuid would be obtained from the plan name with:
        - participant_uuid = get_uuid_for_participant_from_plan(name)

    Args:
        bill_actions: The actions on the bill

    Raises:
        ValueError: In an unlikely case where any action has no partipant attached to it.
    """

    participants_index = {}
    actions_index = {}

    for action in bill_actions:
        user_uuid = getattr(
            action.participant,
            "uuid",
            getattr(action.unregistered_participant, "uuid", None),
        )
        if user_uuid is None:
            raise ValueError(
                "Neither participant UUID nor unregistered participant UUID found."
            )

        if action.participant:
            participants_index[str(user_uuid)] = action.participant
        else:
            participants_index[str(user_uuid)] = action.unregistered_participant

        actions_index[str(user_uuid)] = action

    return participants_index, actions_index


@transaction.atomic
def create_paystack_plan_objects(
    bill_actions, paystack_plan_responses, paystack_plan_payloads
):
    """Creates PaystackPlan database objects from the Paystack plan responses
    and bill actions associated with them.

    Args:
        bill_actions: A queryset of BillAction objects to be associated with the Paystack
        plans.
        paystack_plan_responses: A list of the Paystack plan API responses.
        paystack_plan_payloads: A list of the Paystack plan API payloads.

    Returns:
        A list of PaystackPlan objects created from the Paystack plan data.

    Raises:
        ValueError: If a Paystack plan response cannot be associated with a BillAction.
    """

    paystack_plan_objects = []
    paystack_plan_failures = []

    for index, plan_response in enumerate(paystack_plan_responses):
        # Test thoroughly to ensure positional indexes always match up between
        # plan responses and the actions used to create them. Revert to old approach
        # (create_participants_and_actions_index) and delete failures model if it proves
        # to be buggy.
        action = bill_actions[index]
        participant = action.participant
        unregistered_participant = action.unregistered_participant

        if not plan_response["status"]:
            failure = PaystackPlanFailures(
                action=action,
                failure_message=plan_response["message"],
                participant=participant,
                unregistered_participant=unregistered_participant,
            )
            paystack_plan_failures.append(failure)
        else:
            name = plan_response["data"]["name"]
            interval = plan_response["data"]["interval"]
            plan_code = plan_response["data"]["plan_code"]
            amount = plan_response["data"]["amount"]

            amount_in_naira = convert_to_naira(amount)

            paystack_plan_object = PaystackPlan(
                name=name,
                interval=interval,
                plan_code=plan_code,
                amount=amount,
                amount_in_naira=amount_in_naira,
                action=action,
                participant=participant,
                unregistered_participant=unregistered_participant,
                complete_paystack_payload=paystack_plan_payloads[index],
                complete_paystack_response=plan_response,
            )
            paystack_plan_objects.append(paystack_plan_object)

    if len(paystack_plan_failures) > 0:
        PaystackPlanFailures.objects.bulk_create(paystack_plan_failures)

    if len(paystack_plan_objects) > 0:
        PaystackPlan.objects.bulk_create(paystack_plan_objects)
