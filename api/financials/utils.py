from rest_framework import serializers

from core.utils import remove_underscores

from .models import TransferRecipient


# --------------------------------------------------------------------------------------
# Functions
# --------------------------------------------------------------------------------------
def validate_new_recipient_data(data):
    """
    Ensures that every new recipient has required fields depending on its type.

    Args:
        data: The data passed in to the serializer for a new recipient.

    Raises:
        serializers.ValidationError: A customised validation error message.
    """
    if data["type"] == TransferRecipient.RecipientChoices.ACCOUNT:
        required_fields = ["account_number", "bank_code"]
        readable_recipient_type = "bank account"
    elif data["type"] == TransferRecipient.RecipientChoices.CARD:
        required_fields = ["email", "authorization_code"]
        readable_recipient_type = "card"
    else:
        required_fields = []
        readable_recipient_type = ""

    for field in required_fields:
        if not data[field]:
            field_name = remove_underscores(field)
            error_message = (
                f"Your {field_name} is required "
                f"to add a new {readable_recipient_type} recipient."
            )
            raise serializers.ValidationError(error_message)
