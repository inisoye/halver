from celery import shared_task
from celery.utils.log import get_task_logger

from core.utils.users import get_user_by_id
from financials.models import PaystackTransfer, TransferRecipient
from financials.utils.cards import (
    create_card_addition_paystack_transaction_object,
    create_card_object_from_webhook,
    initiate_card_addition_charge_refund,
)
from financials.utils.transfer_recipients import create_card_recipient_from_webhook
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

    refundable_amount = (
        int(float(new_card_addition_transaction.refundable_amount)) * 100
    )
    refund_recipient_code = new_card_recipient.recipient_code

    initiate_card_addition_charge_refund(refundable_amount, refund_recipient_code)


@shared_task
def retry_failed_card_addition_charge_refund(request_data):
    """Retries failed card addition charge refunds.

    Args:
        request_data (dict): The JSON request data received from the Paystack webhook.

    Returns:
        None
    """

    data = request_data.get("data")

    paystack_transfer_payload = {
        "source": "balance",
        "amount": data.get("amount"),
        "recipient": data.get("recipient").get("recipient_code"),
        "reason": "Refund for card creation",
        "reference": data.get("reference"),
    }

    response = TransferRequests.initiate(**paystack_transfer_payload)

    if not response["status"]:
        paystack_error = response["message"]
        logger.error(f"Error intiating Paystack transfer: {paystack_error}")


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

    recipient_code = data.get("recipient").get("recipient_code")
    recipient = TransferRecipient.objects.get(recipient_code=recipient_code)

    paystack_transfer_object = {
        "amount": data.get("amount"),
        "paystack_transfer_reference": data.get("reference"),
        "uuid": data.get("reference"),
        "recipient": recipient,
        "receiving_user": recipient.user,
        "transfer_outcome": transfer_outcome,
        "transfer_type": PaystackTransfer.TransferChoices.CARD_ADDITION_REFUND,
        "complete_paystack_response": request_data,
    }

    new_transfer, created = PaystackTransfer.objects.get_or_create(
        **paystack_transfer_object
    )

    logger.info(new_transfer)
