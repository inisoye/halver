from financials.models import PaystackTransfer
from financials.tasks.cards import (
    process_card_creation_and_refund,
    record_card_addition_transfer_object,
    retry_failed_card_addition_charge_refund,
)


def handle_paystack_webhook_response(request_data):
    """Handle Paystack webhook response.

    This function handles the response of a Paystack webhook by triggering the
    appropriate tasks based on the event. The events handled are:
        * charge.success
        * transfer.success
        * transfer.failed
        * transfer.reversed

    Args:
        request_data (dict): The data received from the Paystack webhook.

    Returns:
        None
    """

    event = request_data.get("event")
    data = request_data.get("data")

    if event == "charge.success":
        is_card_addition = data.get("metadata").get("is_card_addition") == "true"

        if is_card_addition:
            process_card_creation_and_refund.delay(request_data)

    if event == "transfer.success":
        is_card_addition_refund = data.get("reason") == "Refund for card creation"

        if is_card_addition_refund:
            record_card_addition_transfer_object.delay(
                request_data,
                PaystackTransfer.TransferOutcomeChoices.SUCCESSFUL,
            )

    if event == "transfer.failed":
        is_card_addition_refund = data.get("reason") == "Refund for card creation"

        if is_card_addition_refund:
            record_card_addition_transfer_object.delay(
                request_data,
                PaystackTransfer.TransferOutcomeChoices.FAILED,
            )
            # Retry failed transaction with same reference.
            retry_failed_card_addition_charge_refund.delay(request_data)

    if event == "transfer.reversed":
        is_card_addition_refund = data.get("reason") == "Refund for card creation"

        if is_card_addition_refund:
            record_card_addition_transfer_object.delay(
                request_data,
                PaystackTransfer.TransferOutcomeChoices.REVERSED,
            )
