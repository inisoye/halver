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

    actions = []
    for participant in bill.participants.all():
        actions.append(Action(bill=bill, user=participant))

    Action.objects.bulk_create(actions)


def clean_participant_contribution_index(
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
    """

    from bills.models import Action
    from bills.utils.fees import calculate_all_transaction_fees

    formatted_participant_contribution_index: dict[
        UUID, Decimal
    ] = clean_participant_contribution_index(participant_contribution_index)

    # Filter out actions of the bill's participants
    actions = Action.objects.filter(user__in=bill.participants.all())

    # Load the user object of the actions to prevent multiple (N+1) queries in loop below
    actions = actions.select_related("user")

    actions_to_update = []
    for action in actions:
        contribution = formatted_participant_contribution_index[action.user.uuid]
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
