from decimal import Decimal
from uuid import UUID

from ..models import Action, BillParticipant
from .fees import calculate_all_transaction_fees


def create_participants_and_actions_for_bill(bill) -> None:
    """
    Automatically creates bill participant and action objects each time a new bill.
    Used in the bill model's save method.
    """
    for participant in bill.participants.all():
        bill_participant, created = BillParticipant.objects.get_or_create(
            bill=bill, user=participant
        )

        Action.objects.create(
            bill=bill,
            user=participant,
            bill_participant=bill_participant,
            contribution=bill_participant.contribution,
        )


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


def add_contributions_and_fees_to_actions(bill, participant_contribution_index) -> None:
    """
    Update the contributions of the participants and their
    associated actions based on the given contribution index.

    Args:
        participant_contribution_index:
            A dictionary mapping bill participant UUIDs (as string values) to their
            contributions (string, integer, or float values sent by the client).
    """

    formatted_participant_contribution_index: dict[
        UUID, Decimal
    ] = clean_participant_contribution_index(participant_contribution_index)

    for participant in bill.participants.all():
        contribution = formatted_participant_contribution_index[participant.uuid]
        all_transaction_fees = calculate_all_transaction_fees(contribution)

        Action.objects.filter(user=participant).update(
            contribution=contribution,
            paystack_transaction_fee=all_transaction_fees.paystack_transaction_fee,
            paystack_transfer_fee=all_transaction_fees.paystack_transfer_fee,
            halver_fee=all_transaction_fees.halver_fee,
            total_fee=all_transaction_fees.total_fee,
        )
