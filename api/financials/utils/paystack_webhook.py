from bills.tasks.contributions import (
    finalize_one_time_contribution,
    process_action_updates_and_contribution_transfer,
    record_contribution_transfer_object,
)
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
        * subscription.create
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
        metadata = data.get("metadata")
        is_card_addition = metadata.get("is_card_addition") == "true"
        is_contribution = metadata.get("is_contribution") == "true"

        if is_card_addition:
            process_card_creation_and_refund.delay(request_data)

        if is_contribution:
            process_action_updates_and_contribution_transfer.delay(request_data)

    if event == "subscription.create":
        print(data)

    if event == "transfer.success":
        reason = data.get("reason")
        is_card_addition_refund = reason == "Refund for card creation"
        is_one_time_contribution_transfer = reason.startswith(
            "One-time contribution transfer for action"
        )

        if is_card_addition_refund:
            record_card_addition_transfer_object.delay(
                request_data,
                PaystackTransfer.TransferOutcomeChoices.SUCCESSFUL,
            )

        if is_one_time_contribution_transfer:
            finalize_one_time_contribution.delay(
                request_data,
                PaystackTransfer.TransferOutcomeChoices.SUCCESSFUL,
            )

    if event == "transfer.failed":
        reason = data.get("reason")
        is_card_addition_refund = reason == "Refund for card creation"
        is_one_time_contribution_transfer = reason.startswith(
            "One-time contribution transfer for action"
        )

        if is_card_addition_refund:
            record_card_addition_transfer_object.delay(
                request_data,
                PaystackTransfer.TransferOutcomeChoices.FAILED,
            )
            # Retry failed transaction with same reference.
            retry_failed_card_addition_charge_refund.delay(request_data)

        if is_one_time_contribution_transfer:
            record_contribution_transfer_object.delay(
                request_data,
                PaystackTransfer.TransferOutcomeChoices.FAILED,
            )

            # TODO Add retry here.

    if event == "transfer.reversed":
        reason = data.get("reason")
        is_card_addition_refund = reason == "Refund for card creation"
        is_one_time_contribution_transfer = reason.startswith(
            "One-time contribution transfer for action"
        )

        if is_card_addition_refund:
            record_card_addition_transfer_object.delay(
                request_data,
                PaystackTransfer.TransferOutcomeChoices.REVERSED,
            )

        if is_one_time_contribution_transfer:
            record_contribution_transfer_object.delay(
                request_data,
                PaystackTransfer.TransferOutcomeChoices.REVERSED,
            )
