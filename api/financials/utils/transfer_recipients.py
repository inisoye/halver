from typing import Literal

from rest_framework import serializers

from financials.models import TransferRecipient


def generate_paystack_transfer_recipient_payload(validated_data):
    if validated_data["recipient_type"] == TransferRecipient.RecipientChoices.ACCOUNT:
        return dict(
            name=validated_data["name"],
            type=validated_data["recipient_type"],
            account_number=validated_data["account_number"],
            bank_code=validated_data["bank_code"],
        )

    elif validated_data["recipient_type"] == TransferRecipient.RecipientChoices.CARD:
        return dict(
            name=validated_data["name"],
            type=validated_data["recipient_type"],
            email=validated_data["email"],
            authorization_code=validated_data["authorization_code"],
        )

    else:
        raise serializers.ValidationError("Unknown recipient type")


def return_readable_recipient_type(
    type: Literal["nuban", "authorization"]
) -> Literal["bank account", "card"]:
    if type == TransferRecipient.RecipientChoices.ACCOUNT:
        return "bank account"

    elif type == TransferRecipient.RecipientChoices.CARD:
        return "card"

    else:
        raise serializers.ValidationError("Unknown recipient type")


def format_create_paystack_transfer_recipient_response(paystack_response):
    response_data_object = paystack_response["data"]
    response_data_details_object = paystack_response["data"]["details"]

    return dict(
        recipient_code=response_data_object["recipient_code"],
        recipient_type=response_data_object["type"],
        name=response_data_object["name"],
        account_number=response_data_details_object["account_number"],
        bank_code=response_data_details_object["bank_code"],
        email=response_data_object["email"],
        authorization_code=response_data_details_object["authorization_code"],
        complete_paystack_response=paystack_response,
    )
