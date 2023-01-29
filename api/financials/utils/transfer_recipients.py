from typing import Literal

from django.shortcuts import get_object_or_404
from rest_framework import serializers

from financials.models import TransferRecipient, UserCard


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
        bank_name=response_data_details_object["bank_name"],
        email=response_data_object["email"],
        authorization_code=response_data_details_object["authorization_code"],
        complete_paystack_response=paystack_response,
    )


def handle_transfer_recipient_object_creation(paystack_response, user):
    """
    Create or retrieve transfer recipient object based on the response from
    the Paystack API.

    Args:
        paystack_response (dict): The response from the Paystack API after
            creating a transfer recipient.
        user (User): The user object to associate the transfer recipient with.

    Returns:
        tuple:
            bool: Indicates whether the transfer recipient is new or has been retrieved.
            str: The human-readable type of the transfer recipient.
    """

    recipient_type = paystack_response["data"]["type"]
    readable_recipient_type = return_readable_recipient_type(recipient_type)

    formatted_paystack_response = format_create_paystack_transfer_recipient_response(
        paystack_response,
    )

    recipient, created = TransferRecipient.objects.get_or_create(
        **formatted_paystack_response,
        user=user,
    )

    if recipient_type == TransferRecipient.RecipientChoices.CARD:
        # Join the card model to recipient.
        # Done here instead of model for brevity of get_object_or_404.
        associated_card_object = get_object_or_404(
            UserCard,
            authorization_code=paystack_response["data"]["details"][
                "authorization_code"
            ],
        )
        recipient.associated_card = associated_card_object

    # New recipients should be made default.
    recipient.set_as_default_recipient()

    return (created, readable_recipient_type)
