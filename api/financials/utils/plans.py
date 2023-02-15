from django.db import transaction

from financials.models import PaystackPlan


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
    id: <bill_uuid>" or "Plan for unregistered participant with id:

    <participant_uuid> on the bill with id: <bill_uuid>".

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

    # Create dictionary indexes that can be used to find specific objects
    # inside for loop below, without making (n+1) queries.
    # Participant objects should have been prefetched earlier.
    participants_index = {
        str(
            getattr(action, "participant_uuid", action.unregistered_participant_uuid)
        ): (action.participant or action.unregistered_participant)
        for action in bill_actions
    }
    actions_index = {
        str(
            getattr(action, "participant_uuid", action.unregistered_participant_uuid)
        ): action
        for action in bill_actions
    }

    paystack_plan_objects = []

    for index, plan_response in enumerate(paystack_plan_responses):
        # Get the participant UUID from the Paystack plan name.
        name = plan_response["data"]["name"]
        participant_uuid = get_uuid_for_participant_from_plan(name)

        # Get the remaining data from the Paystack plan response and the indexes.
        interval = plan_response["data"]["interval"]
        plan_code = plan_response["data"]["plan_code"]
        amount = plan_response["data"]["amount"]
        action = actions_index.get(participant_uuid)
        user = participants_index.get(participant_uuid)

        paystack_plan_object = PaystackPlan(
            name=name,
            interval=interval,
            plan_code=plan_code,
            amount=amount,
            action=action,
            user=user,
            complete_paystack_payload=paystack_plan_payloads[index],
            complete_paystack_response=plan_response,
        )
        paystack_plan_objects.append(paystack_plan_object)

    PaystackPlan.objects.bulk_create(paystack_plan_objects)
