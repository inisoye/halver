from decimal import Decimal
from decimal import InvalidOperation as InvalidDecimalOperation
from uuid import UUID

from rest_framework import serializers

from core.utils.dates_and_time import (
    validate_date_is_at_least_one_week_into_future,
    validate_date_not_in_past,
)
from core.utils.dictionaries import sum_numeric_dictionary_values
from core.utils.lists import sum_list_of_dictionary_values
from core.utils.users import get_user_by_id_drf


def validate_bill_serializer_dates(serializer_data):
    """Ensure the dates provided in the serializer are not in the past. If the
    bill is not recurring (interval == "none"), only the deadline date is
    validated. Otherwise, both the first_charge_date and next_charge_date are
    validated.

    Args:
        serializer_data: A dictionary containing the serializer's data.
    """

    if serializer_data["interval"] == "none":
        validate_date_not_in_past(serializer_data.get("deadline"), "Deadline")
    else:
        validate_date_not_in_past(
            serializer_data.get("first_charge_date"),
            "First Charge Date",
        )
        validate_date_not_in_past(
            serializer_data.get("next_charge_date"),
            "Next Charge Date",
        )
        validate_date_is_at_least_one_week_into_future(
            serializer_data.get("first_charge_date"),
            "First Charge Date",
        )


def validate_participant_contribution_index(serializer_data):
    """Check that the participant_contribution_index is a valid dictionary of
    uuid keys and amount values.

    Args:
        serializer_data: A dictionary containing the serializer's data.

    Raises:
        serializers.ValidationError: If the participant_contribution_index is invalid.
    """

    participant_contribution_index = serializer_data.get(
        "participant_contribution_index"
    )

    if participant_contribution_index:
        for key, val in participant_contribution_index.items():
            try:
                UUID(key)
            except ValueError:
                raise serializers.ValidationError(f"Invalid User ID: {key}")

            try:
                Decimal(str(val))
            except InvalidDecimalOperation:
                raise serializers.ValidationError(f"Invalid amount value: {val}")


def validate_total_amount_due(serializer_data):
    """
    Validates whether the total contributions made by participants and unregistered
    participants add up to the total amount due.

    Args:
        serializer_data: A dictionary containing the serializer's data.


    Raises:
        serializers.ValidationError: If the sum of participant contributions and
        unregistered participantcontributions does not equal the total amount due.
    """

    participant_contribution_index = serializer_data.get(
        "participant_contribution_index"
    )
    unregistered_participants = serializer_data.get("unregistered_participants")
    total_amount_due = serializer_data.get("total_amount_due")

    total_participant_contributions = (
        sum_numeric_dictionary_values(participant_contribution_index)
        if participant_contribution_index
        else 0
    )

    total_unregistered_participants_contributions = (
        sum_list_of_dictionary_values(unregistered_participants, "contribution")
        if unregistered_participants
        else 0
    )

    total_contributions = (
        total_participant_contributions + total_unregistered_participants_contributions
    )

    if total_contributions != total_amount_due:
        raise serializers.ValidationError("Contributions do not add up to total amount")


def validate_participants_and_unregistered_participants(
    serializer_instance, serializer_data
):
    """Ensure that the bill has at least one participant or unregistered
    participant, and that the details of the creator (id/uuid, email, phone
    number) are not in either of these lists.

    Args:
        serializer_data: A dictionary of data from the serializer.

    Returns:
        None: If the validation is successful.

    Raises:
        serializers.ValidationError: If any of the validation checks fail.
    """

    unregistered_participants = serializer_data.get("unregistered_participants", [])
    participant_contribution_index = serializer_data.get(
        "participant_contribution_index"
    )
    participants_ids = (
        participant_contribution_index.keys() if participant_contribution_index else []
    )

    if not participants_ids and not unregistered_participants:
        raise serializers.ValidationError(
            "A bill must have at least one participant or unregistered participant."
        )

    creditor_id = serializer_data.get("creditor_id", "")

    if not creditor_id:
        raise serializers.ValidationError(
            "A creditor is required for bill to be created."
        )

    if creditor_id in participants_ids:
        raise serializers.ValidationError(
            "A bill's creditor should not be listed as a participant"
        )

    creditor = get_user_by_id_drf(creditor_id)
    creator = serializer_instance.context["request"].user

    for participant in unregistered_participants:
        if (participant.get("email") in [creditor.email, creator.email]) or (
            participant.get("phone") in [creditor.phone, creator.phone]
        ):
            raise serializers.ValidationError(
                "Neither the creator nor creditor should be listed as a bill's ",
                "unregistered participant.",
            )
