from decimal import Decimal
from uuid import UUID

from django.db import transaction


@transaction.atomic
def create_actions_for_bill(bill) -> None:
    """
    Automatically creates bill participant and action objects each time a new bill is
    created. Used in the bill model's save method.
    """

    from bills.models import Action

    # TODO
    # This function should create paystack one paystack plan for the bill if the
    # following condition passes: if bill.is_recurring:
    # The plan should be created by sending an API call to paystack in a background job
    # After the each remote creation in a celery bg task is complete, the plans should
    # also be created locally with 'PaystackPlan.objects.create'. Ensure to avoid n+1.
    # Actions should be created for participants as usual before the plans are created.

    actions = [
        Action(bill=bill, participant=participant)
        for participant in bill.participants.all()
    ]
    Action.objects.bulk_create(actions)


def format_participant_contribution_index(
    participant_contribution_index,
) -> dict[UUID, Decimal]:
    """
    Cleans up participant contribution index by ensuring all keys are UUIDs
    and values are Decimals.

    Args:
        participant_contribution_index:
            A dictionary mapping bill participant UUIDs (as string values) to their
            contributions (string, integer, or float values sent by the client).

    Returns:
        The contribution index with UUID keys and Decimal values.
    """

    formatted_participant_contribution_index = {}

    # Iterate over the original index dictionary to fix types
    for participant_uuid_str, contribution in participant_contribution_index.items():
        participant_uuid = UUID(participant_uuid_str)
        contribution = Decimal(str(contribution))

        formatted_participant_contribution_index[participant_uuid] = contribution

    return formatted_participant_contribution_index


@transaction.atomic
def add_contributions_and_fees_to_actions(bill, participant_contribution_index):
    """
    Update the contributions of the participants and their
    associated actions based on the given contribution index.

    Args:
        bill: The bill instance with actions to be updated.
        participant_contribution_index:
            A dictionary mapping bill participant UUIDs (as string values) to their
            contributions (string, integer, or float values sent by the client).
            e.g participant_contribution_index = {
                "73c9d9b7-fc01-4c01-b22c-cfa7d8f4a75a": "100.00",
                "2d3837c1-a7e5-4fdd-b181-a4f4e7d4c9d9": 200,
                "3c2db1bb-6e5f-4420-9c5b-79b524c9d9cd": 300.50,
            }
    """

    from bills.models import Action
    from bills.utils.fees import calculate_all_transaction_fees

    formatted_participant_contribution_index: dict[
        UUID, Decimal
    ] = format_participant_contribution_index(participant_contribution_index)

    # Filter out actions of the bill's participants
    actions = Action.objects.filter(participant__in=bill.participants.all())

    # Load the user object of the actions to prevent multiple (N+1) queries in loop below
    actions = actions.select_related("participant")

    actions_to_update = []
    for action in actions:
        contribution = formatted_participant_contribution_index[action.participant.uuid]
        all_transaction_fees = calculate_all_transaction_fees(contribution)

        actions_to_update.append(
            Action(
                id=action.id,
                contribution=contribution,
                paystack_transaction_fee=all_transaction_fees.paystack_transaction_fee,
                paystack_transfer_fee=all_transaction_fees.paystack_transfer_fee,
                halver_fee=all_transaction_fees.halver_fee,
                total_fee=all_transaction_fees.total_fee,
            )
        )

    # Perform bulk update outside loop for efficiency.
    Action.objects.bulk_update(
        actions_to_update,
        [
            "contribution",
            "paystack_transaction_fee",
            "paystack_transfer_fee",
            "halver_fee",
            "total_fee",
        ],
    )
