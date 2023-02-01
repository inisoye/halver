from typing import Literal

from celery.utils.log import get_task_logger
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.response import Response

from core.utils.responses import format_exception
from financials.models import TransferRecipient, UserCard
from libraries.paystack.transfer_recipient_requests import TransferRecipientRequests

logger = get_task_logger(__name__)


def generate_paystack_transfer_recipient_payload(validated_data):
    """
    Generates payload for creating a transfer recipient with Paystack API call.

    Args:
        validated_data (dict): Validated data from a serializer.

    Returns:
        dict: Payload for creating a transfer recipient in Paystack.

    Raises:
        serializers.ValidationError: If recipient type is unknown.
    """

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
    """
    Returns the recipient type in a more readable format.

    Args:
        type (Literal["nuban", "authorization"]): Type of recipient.

    Returns:
        Literal["bank account", "card"]: Readable recipient type.

    Raises:
        serializers.ValidationError: If recipient type is unknown.
    """

    if type == TransferRecipient.RecipientChoices.ACCOUNT:
        return "bank account"

    elif type == TransferRecipient.RecipientChoices.CARD:
        return "card"

    else:
        raise serializers.ValidationError("Unknown recipient type")


def format_create_paystack_transfer_recipient_response(paystack_response):
    """
    Formats the response from the Paystack API for creating a transfer recipient
    object in the local database.

    Args:
        paystack_response (dict): The response from the Paystack API.

    Returns:
        tuple: A tuple containing two elements:
            recipient_code (str): The recipient code separated from the rest of the
            data. Used to check for duplicates.
            defaults (dict): The formatted response from the Paystack API for
            creating a transfer recipient.
    """

    response_data_object = paystack_response["data"]
    response_data_details_object = paystack_response["data"]["details"]

    # Recipient code separated from rest of data as it would be used in lookup.
    # It has a uniqueness constraint and is used in get part of get_or_create.
    recipient_code = response_data_object["recipient_code"]

    defaults = dict(
        recipient_type=response_data_object["type"],
        name=response_data_object["name"],
        account_number=response_data_details_object["account_number"],
        bank_code=response_data_details_object["bank_code"],
        bank_name=response_data_details_object["bank_name"],
        email=response_data_object["email"],
        authorization_code=response_data_details_object["authorization_code"],
        complete_paystack_response=paystack_response,
    )

    return recipient_code, defaults


def create_transfer_recipient_object(
    paystack_response, user
) -> tuple[bool, Literal["bank account", "card"]]:
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

    recipient_code, defaults = format_create_paystack_transfer_recipient_response(
        paystack_response,
    )

    recipient, created = TransferRecipient.objects.get_or_create(
        recipient_code=recipient_code,
        defaults=dict(
            **defaults,
            user=user,
        ),
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


def create_local_and_remote_transfer_recipient(paystack_payload, user) -> Response:
    """
    Handles remote (Paystack) and local (db) transfer recipient creation.

    Args:
        paystack_payload (dict): The Paystack transfer recipient payload as defined in
        the Paystack Docs.
        user (User): The user who is making the request.

    Returns:
        Response: The response of the request, with the appropriate HTTP status code.
    """

    response = TransferRecipientRequests.create(**paystack_payload)

    if response["status"]:
        user = user

        is_recipient_new, readable_recipient_type = create_transfer_recipient_object(
            paystack_response=response,
            user=user,
        )

        if not is_recipient_new:
            return format_exception(
                message=(
                    f"This {readable_recipient_type} has been previously"
                    f" added to your account on Halver."
                ),
                status=status.HTTP_409_CONFLICT,
            )

        return Response(status=status.HTTP_201_CREATED)

    else:
        return format_exception(
            message=response["message"],
            status=status.HTTP_400_BAD_REQUEST,
        )


def create_card_recipient_from_webhook(
    metadata,
    customer,
    authorization,
    user,
    new_card,
) -> TransferRecipient | None:
    """
    Creates a Paystack card recipient from webhook data and associates it
    with a db user and the db object of the card.

    Args:
        metadata (dict): The metadata field from the Paystack webhook request.
        customer (dict): The customer object returned by Paystack.
        authorization (dict): The authorization object returned by Paystack.
        user (User object): User model instance to associate the recipient with.
        new_card (Card object): Card model instance to associate the recipient with.
    """

    paystack_card_recipient_payload = dict(
        name=metadata.get("full_name"),
        type=TransferRecipient.RecipientChoices.CARD,
        email=customer.get("email"),
        authorization_code=authorization.get("authorization_code"),
    )

    response = TransferRecipientRequests.create(**paystack_card_recipient_payload)

    recipient_code, defaults = format_create_paystack_transfer_recipient_response(
        response,
    )

    if response["status"]:
        recipient, created = TransferRecipient.objects.get_or_create(
            recipient_code=recipient_code,
            defaults=dict(
                **defaults,
                user=user,
                associated_card=new_card,
            ),
        )

        return recipient

    else:
        paystack_error = response["message"]
        logger.error(f"Error: {paystack_error}")

        return None
