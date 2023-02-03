from decimal import Decimal
from decimal import InvalidOperation as InvalidDecimalOperation
from uuid import UUID

from rest_framework import serializers

from core.utils import validate_date_not_in_past


def validate_bill_serializer_dates(serializer_instance):
    """
    Ensure the dates provided in the serializer are not in the past. If the bill is not
    recurring (interval == "none"), only the deadline date is validated. Otherwise,
    both the first_charge_date and next_charge_date are validated.

    serializer_instance.validated_data is used here as the validation in this function
    is performed after the default validation (based on the model) have been carried out.
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


def validate_participant_contribution_index(serializer_raw_data):

    """
    Check that the participant_contribution_index is a
    valid dictionary of uuid keys and amount values.


    Args:
        serializer_raw_data: A dictionary containing the serializer's raw data.

    Raises:
        serializers.ValidationError: If the participant_contribution_index is invalid.
    """

    participant_contribution_index = serializer_raw_data.get(
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
