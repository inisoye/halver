from decimal import Decimal
from uuid import UUID

from django.db import transaction

from bills.utils.fees import calculate_all_transaction_fees
from core.utils.users import get_user_by_id_drf, get_users_by_ids_drf


def create_bill(bill_model, validated_data):
    """Create a bill instance and and add actions to it.

    Args:
        bill_model (Model): The bill model.
        validated_data (dict): The validated data to use for creating the bill.

    Returns:
        bill (Model): The created bill instance.
    """

    # Editable fields represent values from serializer that are not immediately
    # stored but would be modified before they are actually used
    editable_fields = (
        "participant_contribution_index",
        "creditor_id",
        "participants_ids",
    )

    validated_data_without_editable_fields = {
        key: value
        for key, value in validated_data.items()
        if key not in editable_fields
    }

    creditor_id = validated_data["creditor_id"]
    creditor = get_user_by_id_drf(creditor_id)

    participants_ids = validated_data["participants_ids"]
    participants = get_users_by_ids_drf(participants_ids)

    new_bill = bill_model.objects.create(
        creditor=creditor,
        participants=participants,
        **validated_data_without_editable_fields,
    )

    participant_contribution_index = validated_data["participant_contribution_index"]
    new_bill.update_contributions_and_fees_for_actions(participant_contribution_index)

    return new_bill


@transaction.atomic
def create_actions_for_bill(bill) -> None:
    """Creates action objects for each partipant/unregistered participant.

    Used in the bill model's save method.
    """

    from bills.models import BillAction

    actions = [
        BillAction(bill=bill, participant=participant)
        for participant in bill.participants.all()
    ]

    actions_for_unregistered_participants = [
        BillAction(
            bill=bill,
            unregistered_participant=unregistered_participant,
            status=BillAction.StatusChoices.UNREGISTERED,
        )
        for unregistered_participant in bill.unregistered_participants.all()
    ]

    BillAction.objects.bulk_create(actions + actions_for_unregistered_participants)


def format_participant_contribution_index(
    participant_contribution_index,
) -> dict[UUID, Decimal]:
    """Cleans up participant contribution index by ensuring all keys are UUIDs
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
def add_participant_contributions_and_fees_to_actions(
    bill, participant_contribution_index
):
    """Update the contributions of the participants/unregistered participants
    and their associated actions based on the given contribution index.

    The participant contribution index is only used for authenticated users. Detailed
    for unregistered participants are obtained from a dedicated joined model.

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

    from bills.models import BillAction

    formatted_participant_contribution_index: dict[
        UUID, Decimal
    ] = format_participant_contribution_index(participant_contribution_index)

    # Get all actions for the bill
    actions = bill.actions.all()

    # Load the participant/unregistered_participant objects of the actions to prevent
    # multiple (N+1) queries in loop below
    actions = actions.select_related("participant", "unregistered_participant")

    actions_to_update = []
    for action in actions:
        if action.participant:
            contribution = formatted_participant_contribution_index[
                action.participant.uuid
            ]
        else:
            contribution = action.unregistered_participant.contribution

        all_transaction_fees = calculate_all_transaction_fees(contribution)

        total_fee = all_transaction_fees.total_fee

        total_payment_due = contribution + total_fee

        actions_to_update.append(
            BillAction(
                id=action.id,
                contribution=contribution,
                paystack_transaction_fee=all_transaction_fees.paystack_transaction_fee,
                paystack_transfer_fee=all_transaction_fees.paystack_transfer_fee,
                halver_fee=all_transaction_fees.halver_fee,
                total_fee=total_fee,
                total_payment_due=total_payment_due,
            )
        )

    # Perform bulk update outside loop for efficiency.
    BillAction.objects.bulk_update(
        actions_to_update,
        [
            "contribution",
            "paystack_transaction_fee",
            "paystack_transfer_fee",
            "halver_fee",
            "total_fee",
        ],
    )
