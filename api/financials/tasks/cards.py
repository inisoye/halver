import json
import uuid

from celery import shared_task
from celery.utils.log import get_task_logger

from accounts.models import CustomUser
from core.utils.currency import convert_to_kobo_integer
from core.utils.strings import extract_uuidv4s_from_string
from core.utils.users import get_user_by_id
from financials.models import PaystackTransfer, TransferRecipient
from financials.utils.cards import (
    create_card_addition_paystack_transaction_object,
    create_card_object_from_webhook,
)
from financials.utils.transfer_recipients import create_card_recipient_from_webhook
from financials.utils.transfers import create_paystack_transfer_object
from libraries.notifications.base import send_push_messages
from libraries.paystack.transfer_requests import TransferRequests

logger = get_task_logger(__name__)


@shared_task
def process_card_creation_and_refund(request_data):
    """Processes card creation and initiates a refund for the card creation fee.

    Args:
        request_data (dict): The JSON request data received from the Paystack webhook.

    Returns:
        None
    """

    data = request_data.get("data")

    authorization = data.get("authorization")
    customer = data.get("customer")
    metadata = data.get("metadata")

    user_id = metadata.get("user_id")
    user = get_user_by_id(user_id)

    new_card = create_card_object_from_webhook(
        authorization,
        customer,
        user,
    )

    # New cards should be made default.
    new_card.set_as_default_card()

    new_card_addition_transaction = create_card_addition_paystack_transaction_object(
        data,
        metadata,
        new_card,
        user,
        request_data,
    )

    new_card_recipient = create_card_recipient_from_webhook(
        metadata,
        customer,
        authorization,
        user,
        new_card,
    )

    refundable_amount_in_kobo = convert_to_kobo_integer(
        new_card_addition_transaction.refundable_amount
    )
    refund_recipient_code = new_card_recipient.recipient_code

    reason = f"Refund for card creation for user:{user_id}"
    reference = str(uuid.uuid4())

    failed_paystack_transfer_object_defaults = {
        "amount": refundable_amount_in_kobo,
        "amount_in_naira": new_card_addition_transaction.refundable_amount,
        "uuid": reference,
        "recipient": new_card_recipient,
        "receiving_user": user,
        "transfer_outcome": PaystackTransfer.TransferOutcomeChoices.FAILED,
        "transfer_type": PaystackTransfer.TransferChoices.CARD_ADDITION_REFUND,
        "reason": reason,
    }

    error_push_parameters_list = [
        {
            "token": user.expo_push_token,
            "title": "Card addition fee transfer error",
            "message": (
                "We could not successfully transfer the refund from your card"
                " addition fee You can retry the transfer in the"
                " Halver app for free."
            ),
            "extra": {
                "action": "failed-or-reversed-transfer",
            },
        },
    ]

    try:
        paystack_transfer_payload = {
            "source": "balance",
            "amount": refundable_amount_in_kobo,
            "recipient": refund_recipient_code,
            "reason": reason,
            "reference": reference,
        }

        response = TransferRequests.initiate(**paystack_transfer_payload)

        if not response["status"]:
            PaystackTransfer.objects.update_or_create(
                paystack_transfer_reference=reference,
                defaults={
                    **failed_paystack_transfer_object_defaults,
                    "complete_paystack_response": {
                        "response": response,
                        "request_data": request_data,
                    },
                },
            )

            send_push_messages(error_push_parameters_list)

            paystack_error = response["message"]
            logger.error(f"Error intiating Paystack transfer: {paystack_error}")

    # Handle cases when Paystack response is malformed.
    except json.decoder.JSONDecodeError as json_error:
        PaystackTransfer.objects.update_or_create(
            paystack_transfer_reference=reference,
            defaults={
                **failed_paystack_transfer_object_defaults,
                "complete_paystack_response": {
                    "detail": "Transfer failed due to malformed data from paystack",
                    "error": json_error,
                    "request_data": request_data,
                },
            },
        )

        send_push_messages(error_push_parameters_list)


@shared_task
def record_card_addition_transfer_object(request_data, transfer_outcome):
    """Create or update a PaystackTransfer object with data from the
    request_data and the outcome of the transfer.

    The task is dedicated to transfers made to refund money paid to add cards.

    Args:
        request_data (dict): A dictionary of data received from Paystack
            webhooks containing information on a successful or failed
            transfer.
        transfer_outcome (str): A string indicating the outcome of the
            transfer, could be `PaystackTransfer.TransferOutcome.SUCCESS` or
            `PaystackTransfer.TransferOutcome.FAILED`, for example.

    Returns:
        None
    """

    data = request_data.get("data")

    reason = data.get("reason")
    user_id = extract_uuidv4s_from_string(reason, position=0)
    receiving_user = CustomUser.objects.get(uuid=user_id)

    recipient_code = data.get("recipient").get("recipient_code")
    recipient = TransferRecipient.objects.get(
        recipient_code=recipient_code,
        user=receiving_user,
    )

    create_paystack_transfer_object(
        request_data=request_data,
        recipient=recipient,
        receiving_user=receiving_user,
        transfer_outcome=transfer_outcome,
        transfer_type=PaystackTransfer.TransferChoices.CARD_ADDITION_REFUND,
        reason=reason,
    )

    if (
        transfer_outcome == PaystackTransfer.TransferOutcomeChoices.FAILED
        or transfer_outcome == PaystackTransfer.TransferOutcomeChoices.REVERSED
    ):
        push_parameters_list = [
            {
                "token": receiving_user.expo_push_token,
                "title": "Card addition fee transfer error",
                "message": (
                    "We could not successfully transfer the refund from your card"
                    " addition fee You can retry the transfer in the"
                    " Halver app for free."
                ),
                "extra": {
                    "action": "failed-or-reversed-transfer",
                },
            },
        ]

        send_push_messages(push_parameters_list)
