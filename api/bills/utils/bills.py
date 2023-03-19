from decimal import Decimal
from uuid import UUID

from django.core.exceptions import ValidationError
from django.db import transaction

from bills.utils.fees import calculate_all_transaction_fees
from core.utils.users import get_user_by_id_drf, get_users_by_ids_drf


@transaction.atomic
def create_bill(bill_model, validated_data, creator):
    """Create a bill instance and and add actions to it.

    Args:
        bill_model (Model): The bill model.
        validated_data (dict): The validated data to use for creating the bill.

    Returns:
        bill (Model): The created bill instance.
    """

    # Modified fields represent values from serializer that are not immediately
    # stored but would be modified before they are actually used.
    modified_fields = (
        "participants_contribution_index",
        "creditor_id",
        "unregistered_participants",
        "next_charge_date",
    )

    validated_data_without_modified_fields = validated_data.copy()
    for field in modified_fields:
        validated_data_without_modified_fields.pop(field, None)

    creditor_id = validated_data["creditor_id"]
    creditor = get_user_by_id_drf(creditor_id)

    if not creditor.has_default_transfer_recipient:
        raise ValidationError(
            "A bill's creditor must have a default transfer recipient on their account."
        )

    new_bill = bill_model.objects.create(
        creditor=creditor,
        creator=creator,
        **validated_data_without_modified_fields,
    )

    # Add participants to the bill

    participants_contribution_index = validated_data.get(
        "participants_contribution_index"
    )
    participants = (
        get_users_by_ids_drf(participants_contribution_index.keys())
        if participants_contribution_index
        else []
    )
    if participants:
        new_bill.participants.set(participants)

    unregistered_participants_data = validated_data.get("unregistered_participants")

    unregistered_participants_contribution_index = (
        create_unregistered_participants_for_bill(
            new_bill, unregistered_participants_data
        )
    )

    create_actions_for_bill(new_bill)
    add_participant_contributions_and_fees_to_bill_actions(
        new_bill,
        participants_contribution_index,
        unregistered_participants_contribution_index,
    )

    return new_bill


@transaction.atomic
def create_unregistered_participants_for_bill(bill, unregistered_participants_data):
    """Adds unregistered participants to the bill, creating new instances if
    necessary.

    Args:
        bill (Bill): The bill to which the unregistered participants should be added.
        unregistered_participants_data (list[dict]): A list of dictionaries containing
            unregistered participant data in the following format:
            {
                "name": str,
                "phone": str,
                "contribution": Decimal,
            }

    Returns:
        dict: A dictionary with unregistered participants' phone numbers as keys and
            their contributions as values.
    """

    from bills.models import BillUnregisteredParticipant

    if unregistered_participants_data:
        # Create a map that, mainly to update actions later on
        unregistered_participants_contribution_index = {
            unregistered_participant["phone"]: unregistered_participant["contribution"]
            for unregistered_participant in unregistered_participants_data
        }

        # Extract all phone numbers from unregistered_participants_data
        phone_numbers = unregistered_participants_contribution_index.keys()

        # Find any existing participants with the same phone numbers
        existing_unregistered_participants = BillUnregisteredParticipant.objects.filter(
            phone__in=phone_numbers
        )
        # Add existing unregistered participants to the bill
        bill.unregistered_participants.add(*existing_unregistered_participants)

        existing_phone_numbers = set(
            existing_unregistered_participants.values_list("phone", flat=True)
        )

        # Next, generate a list of new_unregistered_participants_data filtered out of
        # the original unregistered_participants_data
        new_unregistered_participants_data = [
            unregistered_participant
            for unregistered_participant in unregistered_participants_data
            if unregistered_participant["phone"] not in existing_phone_numbers
        ]

        # Create new unregistered participants objects
        new_unregistered_participants_objects = [
            BillUnregisteredParticipant(
                name=new_unregistered_participant["name"],
                phone=new_unregistered_participant["phone"],
            )
            for new_unregistered_participant in new_unregistered_participants_data
        ]
        # Add them to the db with one query.
        new_unregistered_participants = BillUnregisteredParticipant.objects.bulk_create(
            new_unregistered_participants_objects
        )
        bill.unregistered_participants.add(*new_unregistered_participants)

        return unregistered_participants_contribution_index

    return {}


@transaction.atomic
def create_actions_for_bill(bill) -> None:
    """Creates action objects for each partipant/unregistered participant.

    Used in the create_bill method.
    """

    from bills.models import Bill, BillAction

    bill = Bill.objects.prefetch_related(
        "participants", "unregistered_participants"
    ).get(pk=bill.pk)

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


def format_participants_contribution_index(
    participants_contribution_index,
) -> dict[UUID, Decimal]:
    """Cleans up participant contribution index by ensuring all keys are UUIDs
    and values are Decimals.

    Args:
        participants_contribution_index:
            A dictionary mapping bill participant UUIDs (as string values) to their
            contributions (string, integer, or float values sent by the client).

    Returns:
        The contribution index with UUID keys and Decimal values. If
        participants_contribution_index is empty, an empty dictionary is returned.

    Raises:
        ValidationError: If any of the contribution amounts are not positive numbers.
    """

    if participants_contribution_index:
        formatted_participants_contribution_index = {}

        # Iterate over the original index dictionary to fix types
        for (
            participant_uuid_str,
            contribution,
        ) in participants_contribution_index.items():
            if isinstance(contribution, str) and not contribution.isnumeric():
                raise ValidationError(
                    "All contribution amounts must be positive numbers"
                )
            elif isinstance(contribution, (int, float)) and contribution <= 0:
                raise ValidationError(
                    "All contribution amounts must be positive numbers"
                )

            participant_uuid = UUID(participant_uuid_str)
            contribution = Decimal(str(contribution))

            formatted_participants_contribution_index[participant_uuid] = contribution

        return formatted_participants_contribution_index

    return {}


@transaction.atomic
def add_participant_contributions_and_fees_to_bill_actions(
    bill, participants_contribution_index, unregistered_participants_contribution_index
):
    """Update the contributions of the participants/unregistered participants
    and their associated actions based on the given contribution index.

    The participant contribution index is only used for authenticated users. Detailed
    for unregistered participants are obtained from a dedicated joined model.

    Args:
        bill: The bill instance with actions to be updated.
        participants_contribution_index:
            A dictionary mapping bill participant UUIDs (as string values) to their
            contributions (string, integer, or float values sent by the client).
            e.g participants_contribution_index = {
                "73c9d9b7-fc01-4c01-b22c-cfa7d8f4a75a": "100.00",
                "2d3837c1-a7e5-4fdd-b181-a4f4e7d4c9d9": 200,
                "3c2db1bb-6e5f-4420-9c5b-79b524c9d9cd": 300.50,
            }
    """

    from bills.models import BillAction

    formatted_participants_contribution_index: dict[
        UUID, Decimal
    ] = format_participants_contribution_index(participants_contribution_index)

    # Get all actions for the bill
    actions = bill.actions.all()

    # Load the participant/unregistered_participant objects of the actions to prevent
    # multiple (N+1) queries in loop below
    actions = actions.select_related("participant", "unregistered_participant")

    actions_to_update = []
    for action in actions:
        if action.participant:
            contribution = formatted_participants_contribution_index[
                action.participant.uuid
            ]
        else:
            contribution = unregistered_participants_contribution_index[
                action.unregistered_participant.phone
            ]

        all_transaction_fees = calculate_all_transaction_fees(contribution)

        total_fee = all_transaction_fees["total_fee"]

        total_payment_due = contribution + total_fee

        actions_to_update.append(
            BillAction(
                id=action.id,
                contribution=contribution,
                paystack_transaction_fee=all_transaction_fees[
                    "paystack_transaction_fee"
                ],
                paystack_transfer_fee=all_transaction_fees["paystack_transfer_fee"],
                halver_fee=all_transaction_fees["halver_fee"],
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
            "total_payment_due",
        ],
    )


def generate_long_status_index(all_actions_are_one_type, most_common_status_count):
    """Generates a dictionary mapping the most common status code to its
    corresponding human-readable message.

    Args:
        all_actions_are_one_type (bool): Whether or not all bill actions have the same
            status.
        most_common_status_count (int): The number of bill actions with the most common
            status.

    Returns:
        A dictionary mapping the most common status code to its corresponding
        human-readable message.
    """

    from bills.models import BillAction

    bill_status_message_prefix = (
        "All" if all_actions_are_one_type else f"{most_common_status_count}"
    )

    # Check if the status count is plural
    status_count_is_plural: bool = most_common_status_count > 1
    plural_suffix = "s" if status_count_is_plural else ""

    # Map status codes to messages
    status_message_index = {
        BillAction.StatusChoices.PENDING_TRANSFER: (
            f"{bill_status_message_prefix} transfer{plural_suffix} pending"
        ),
        BillAction.StatusChoices.OVERDUE: (
            f"{bill_status_message_prefix} payment{plural_suffix} overdue"
        ),
        BillAction.StatusChoices.CANCELLED: "Bill cancelled"
        if all_actions_are_one_type
        else f"{bill_status_message_prefix} participant{plural_suffix} cancelled",
        BillAction.StatusChoices.COMPLETED: (
            f"{bill_status_message_prefix} payment{plural_suffix} completed"
        ),
        BillAction.StatusChoices.ONGOING: (
            f"{bill_status_message_prefix} subscription{plural_suffix} ongoing"
        ),
        BillAction.StatusChoices.OPTED_OUT: (
            f"{bill_status_message_prefix} participant{plural_suffix} opted out"
        ),
        BillAction.StatusChoices.PENDING: (
            f"{bill_status_message_prefix} participant{plural_suffix} yet to accept"
        ),
        BillAction.StatusChoices.UNREGISTERED: (
            f"{bill_status_message_prefix} participant{plural_suffix} unregistered"
        ),
        BillAction.StatusChoices.LAST_PAYMENT_FAILED: (
            f"{bill_status_message_prefix} payment{plural_suffix} failed"
        ),
    }

    return status_message_index
