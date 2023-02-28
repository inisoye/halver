from celery.utils.log import get_task_logger
from django.db import transaction

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
        user_uuid = (
            f"participant with id: {action.participant.uuid}"
            if action.participant
            else (
                "unregistered participant with id:"
                f" {action.unregistered_participant.uuid}"
            )
        )
        name = f"Plan for {user_uuid} on the bill with id: {action.bill.uuid}."
        amount = int(float(action.total_payment_due)) * 100  # Convert to Kobo.
        interval = action.bill.interval
        description = (
            "Paystack plan for "
            f"{action.participant or action.unregistered_participant} "
            f"on the '{action.bill.name}' bill."
        )
        currency = action.bill.currency_code

        paystack_plan_payloads.append(
            {
                "name": name,
                "amount": amount,
                "interval": interval,
                "description": description,
                "currency": currency,
            }
        )

    return paystack_plan_payloads


def get_uuid_for_participant_from_plan(
    plan_name_string,
):
    """Extract the participant's UUID from a plan's name string in the format:
    "Plan for participant with id: <participant_uuid> on the bill with id:

    <bill_uuid>" or "Plan for unregistered participant with id:
    <participant_uuid> on the bill with id: <bill_uuid>".

    Args:
        plan_name_string (str): The plan's name string to extract the UUIDs from

    Returns:
        tuple: The participant UUID
    """

    participant_index = plan_name_string.index("participant with id: ") + len(
        "participant with id: "
    )

    participant_uuid = plan_name_string[
        participant_index : plan_name_string.index(" on the ")  # noqa E203
    ].strip()

    return participant_uuid


def get_uuids_for_participant_and_bill_from_plan(
    plan_name_string,
):
    """Extract the participant and bill UUIDs from a plan's name string in the
    format: "Plan for participant with id: <participant_uuid> on the bill with
    id: <bill_uuid>" or "Plan for unregistered participant with id: <participant_uuid>
    on the bill with id: <bill_uuid>".

    Args:
        plan_name_string (str): The plan's name string to extract the UUIDs from

    Returns:
        tuple: A tuple containing the participant UUID and bill UUID
    """

    participant_index = plan_name_string.index("participant with id: ") + len(
        "participant with id: "
    )
    bill_index = plan_name_string.index("bill with id: ") + len("bill with id: ")

    participant_uuid = plan_name_string[
        participant_index : plan_name_string.index(" on the ")  # noqa E203
    ].strip()
    bill_uuid = plan_name_string[bill_index:].strip()

    return participant_uuid, bill_uuid


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

            paystack_plan_object = PaystackPlan(
                name=name,
                interval=interval,
                plan_code=plan_code,
                amount=amount,
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
