from core.utils import validate_date_not_in_past


def validate_bill_serializer_dates(serializer_instance):
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
