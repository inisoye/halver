import json

from bills.tasks.contributions import (
    finalize_one_time_contribution,
    process_action_updates_and_one_time_contribution_transfer,
    record_contribution_transfer_object,
)
from bills.tasks.subscriptions import (
    finalize_subscription_contribution,
    process_action_updates_and_subscription_contribution_transfer,
    process_subscription_creation,
)
from financials.models import PaystackTransaction, PaystackTransfer
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

    one_time_contribution_label = (
        PaystackTransaction.TransactionChoices.ONE_TIME_CONTRIBUTION.label
    )
    subscription_contribution_label = (
        PaystackTransaction.TransactionChoices.SUBSCRIPTION_CONTRIBUTION.label
    )

    if event == "charge.success":
        print("CHARGE SUCCESS", json.dumps(request_data))

        metadata = data.get("metadata")
        plan = data.get("plan")
        is_card_addition = metadata.get("is_card_addition") == "true"
        is_one_time_contribution = metadata.get("is_contribution") == "true"
        is_subscription_contribution = (
            plan.get("name").startswith("Plan for") if plan else False
        )

        if is_card_addition:
            process_card_creation_and_refund.delay(request_data)

        if is_one_time_contribution:
            process_action_updates_and_one_time_contribution_transfer.delay(
                request_data
            )

        if is_subscription_contribution:
            process_action_updates_and_subscription_contribution_transfer.delay(
                request_data
            )

    if event == "subscription.create":
        print("SUBSCRIPTION CREATED", json.dumps(request_data))

        process_subscription_creation.delay(request_data)

    if event == "transfer.success":
        print("TRANSFER SUCCESSFUL", json.dumps(request_data))

        reason = data.get("reason")

        is_card_addition_refund = reason == "Refund for card creation"
        is_one_time_contribution_transfer = reason.startswith(
            f"{one_time_contribution_label} transfer for action"
        )
        is_subscription_contribution_transfer = reason.startswith(
            f"{subscription_contribution_label} transfer for action"
        )

        if is_card_addition_refund:
            record_card_addition_transfer_object.delay(
                request_data,
                PaystackTransfer.TransferOutcomeChoices.SUCCESSFUL,
            )

        if is_one_time_contribution_transfer:
            finalize_one_time_contribution.delay(request_data)

        if is_subscription_contribution_transfer:
            finalize_subscription_contribution.delay(request_data)

    if event == "transfer.failed":
        reason = data.get("reason")
        is_card_addition_refund = reason == "Refund for card creation"
        is_one_time_contribution_transfer = reason.startswith(
            f"{one_time_contribution_label} transfer for action"
        )
        is_subscription_contribution_transfer = reason.startswith(
            f"{subscription_contribution_label} transfer for action"
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

        if is_subscription_contribution_transfer:
            record_contribution_transfer_object.delay(
                request_data,
                PaystackTransfer.TransferOutcomeChoices.FAILED,
            )

            # TODO Add retry here.

    if event == "transfer.reversed":
        reason = data.get("reason")
        is_card_addition_refund = reason == "Refund for card creation"
        is_one_time_contribution_transfer = reason.startswith(
            f"{one_time_contribution_label} transfer for action"
        )
        is_subscription_contribution_transfer = reason.startswith(
            f"{subscription_contribution_label} transfer for action"
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

        if is_subscription_contribution_transfer:
            record_contribution_transfer_object.delay(
                request_data,
                PaystackTransfer.TransferOutcomeChoices.REVERSED,
            )

            # TODO Add retry here.

    if event == "invoice.create":
        print("INVOICE CREATED", json.dumps(request_data))

    if event == "invoice.payment_failed":
        print("INVOICE FAILED", json.dumps(request_data))

    if event == "invoice.update":
        print("INVOICE UPDATED", json.dumps(request_data))
