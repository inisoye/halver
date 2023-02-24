from decimal import Decimal
from decimal import InvalidOperation as InvalidDecimalOperation
from uuid import UUID

from rest_framework import serializers

from core.utils.dates_and_time import (
    validate_date_is_at_least_one_week_into_future,
    validate_date_not_in_past,
)
from core.utils.users import get_user_by_id_drf


def validate_bill_serializer_dates(serializer_instance):
    """Ensure the dates provided in the serializer are not in the past. If the
    bill is not recurring (interval == "none"), only the deadline date is
    validated. Otherwise, both the first_charge_date and next_charge_date are
    validated.

    serializer_instance.validated_data is used here as the validation in this
    function is performed after the default validation (based on the model) have
    been carried out.
    """

    if serializer_instance.validated_data["interval"] == "none":
        validate_date_not_in_past(
            serializer_instance.validated_data.get("deadline"), "Deadline"
        )
    else:
        validate_date_not_in_past(
            serializer_instance.validated_data.get("first_charge_date"),
            "First Charge Date",
        )
        validate_date_not_in_past(
            serializer_instance.validated_data.get("next_charge_date"),
            "Next Charge Date",
        )
        validate_date_is_at_least_one_week_into_future(
            serializer_instance.validated_data.get("first_charge_date"),
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

    if participant_contribution_index is None:
        raise serializers.ValidationError("Participant contribution index is required")

    for key, val in participant_contribution_index.items():
        try:
            UUID(key)
        except ValueError:
            raise serializers.ValidationError(f"Invalid User ID: {key}")

        try:
            Decimal(str(val))
        except InvalidDecimalOperation:
            raise serializers.ValidationError(f"Invalid amount value: {val}")


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

    participants_ids = serializer_data.get("participants_ids", [])
    unregistered_participants = serializer_data.get("unregistered_participants", [])

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
