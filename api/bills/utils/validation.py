from decimal import Decimal
from decimal import InvalidOperation as InvalidDecimalOperation
from uuid import UUID

from django.conf import settings
from rest_framework import serializers

from core.utils.dates_and_time import validate_date_not_in_past
from core.utils.users import get_user_by_id_drf


def validate_create_bill_serializer_dates(serializer_data):
    """Ensure the dates provided in the serializer are not in the past. If the
    bill is not recurring (interval == "none"), only the deadline date is
    validated. Otherwise, both the first_charge_date and next_charge_date are also
    validated.

    Args:
        serializer_data: A dictionary containing the serializer's data.
    """

    validate_date_not_in_past(serializer_data.get("deadline"), "Deadline")

    if serializer_data["interval"] != "none":
        validate_date_not_in_past(
            serializer_data.get("first_charge_date"),
            "First Charge Date",
        )


def validate_participants_contribution_index(serializer_data):
    """Check that the participants_contribution_index is a valid dictionary of
    uuid keys and amount values.

    Args:
        serializer_data: A dictionary containing the serializer's data.

    Raises:
        serializers.ValidationError: If the participants_contribution_index is invalid.
    """

    participants_contribution_index = serializer_data.get(
        "participants_contribution_index"
    )

    if participants_contribution_index:
        for key, val in participants_contribution_index.items():
            try:
                UUID(key)
            except ValueError:
                raise serializers.ValidationError(f"Invalid User UUID: {key}")

            try:
                Decimal(str(val))
            except InvalidDecimalOperation:
                raise serializers.ValidationError(f"Invalid amount value: {val}")


def validate_contribution_amounts(
    participants_contribution_index, unregistered_participants
):
    """Validates the list of contributions to be made by participants and unregistered
    participants on a bill.

    Args:
        participants_contribution_index (dict): A dictionary mapping bill participant
            UUIDs (as string values) to their contributions (string, integer, or float
            values sent by the client).
        unregistered_participants (list): A list of objects containing data about
            unregistered participants.

    Raises:
        serializers.ValidationError: If any contribution value is less than the minimum
        amount.

    Returns:
        tuple: A tuple of two lists that contains the contributions of participants and
        unregistered participants.
    """

    # Currently set in NGN. Determined by Paystack's rules.
    MINIMUM_CONTRIBUTION = settings.MINIMUM_CONTRIBUTION

    participants_contributions = []
    if participants_contribution_index:
        for value in participants_contribution_index.values():
            contribution = float(value)
            if contribution < MINIMUM_CONTRIBUTION:
                raise serializers.ValidationError(
                    "A participant's contribution cannot be less than"
                    f" {MINIMUM_CONTRIBUTION} Naira (NGN)"
                )
            participants_contributions.append(contribution)

    unregistered_participants_contributions = []
    for participant in unregistered_participants:
        contribution = float(participant["contribution"])
        if contribution < MINIMUM_CONTRIBUTION:
            raise serializers.ValidationError(
                "An unregistered participant's contribution cannot be less than"
                f" {MINIMUM_CONTRIBUTION} Naira (NGN)"
            )
        unregistered_participants_contributions.append(contribution)

    return participants_contributions, unregistered_participants_contributions


def validate_contributions_and_total_amount_due(serializer_data):
    """
    Validates whether the total contributions made by participants and unregistered
    participants add up to the total amount due.

    Also perfoms validations on minimum amounts. Contributions and the total amount due
    must be greater than stipulated constants.

    Args:
        serializer_data: A dictionary containing the serializer's data.


    Raises:
        serializers.ValidationError: If the sum of participant contributions and
        unregistered participant contributions does not equal the total amount due.
        Also raised if amounts are below specified thresholds.
    """

    participants_contribution_index = serializer_data.get(
        "participants_contribution_index"
    )
    unregistered_participants = serializer_data.get("unregistered_participants")
    total_amount_due = serializer_data.get("total_amount_due")

    (
        participants_contributions,
        unregistered_participants_contributions,
    ) = validate_contribution_amounts(
        participants_contribution_index, unregistered_participants
    )

    total_participants_contributions = sum(participants_contributions)

    total_unregistered_participants_contributions = sum(
        unregistered_participants_contributions
    )

    total_contributions = (
        total_participants_contributions + total_unregistered_participants_contributions
    )

    if total_contributions != total_amount_due:
        raise serializers.ValidationError(
            "Contributions do not add up to the total amount due."
        )

    # Currently set in NGN
    MINIMUM_BILL_AMOUNT = settings.MINIMUM_BILL_AMOUNT

    if total_contributions < MINIMUM_BILL_AMOUNT:
        raise serializers.ValidationError(
            f"Total contributions must be at least {MINIMUM_BILL_AMOUNT} Naira (NGN)"
        )


def validate_participants_and_unregistered_participants(
    serializer_instance, serializer_data
):
    """Ensure that the bill has at least one participant or unregistered
    participant, and that the details of the creditor (id/uuid, phone
    number) are not in either of these lists.

    Args:
        serializer_data: A dictionary of data from the serializer.

    Returns:
        None: If the validation is successful.

    Raises:
        serializers.ValidationError: If any of the validation checks fail.
    """

    unregistered_participants = serializer_data.get("unregistered_participants", [])
    participants_contribution_index = serializer_data.get(
        "participants_contribution_index"
    )
    participants_ids = (
        participants_contribution_index.keys()
        if participants_contribution_index
        else []
    )

    if not participants_ids and not unregistered_participants:
        raise serializers.ValidationError(
            "A bill must have at least one participant or unregistered participant."
        )

    creditor_id = serializer_data.get("creditor_id")

    if not creditor_id:
        raise serializers.ValidationError(
            "A creditor is required for bill to be created."
        )

    if str(creditor_id) in participants_ids:
        raise serializers.ValidationError(
            "A bill's creditor should not be listed as a participant."
        )

    creditor = get_user_by_id_drf(creditor_id)

    if not creditor.has_default_transfer_recipient:
        raise serializers.ValidationError(
            "A bill's creditor must have a default transfer recipient on their account."
        )

    # Creator obtained with this approach as it is a read only field.
    creator = serializer_instance.context["request"].user

    is_creator_the_creditor = creditor.uuid == creator.uuid

    if (not is_creator_the_creditor) and (str(creator.uuid) not in participants_ids):
        raise serializers.ValidationError(
            "Creators who are not creditors must be listed as participants."
        )

    for participant in unregistered_participants:
        if participant.get("phone") in [creditor.phone, creator.phone]:
            raise serializers.ValidationError(
                "Neither the creator nor creditor should be listed as a bill's ",
                "unregistered participant.",
            )
