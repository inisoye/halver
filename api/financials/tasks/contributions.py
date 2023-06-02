from celery import shared_task
from celery.utils.log import get_task_logger

from bills.models import BillAction
from core.utils.strings import extract_uuidv4s_from_string
from financials.models import PaystackTransaction, PaystackTransfer, TransferRecipient
from financials.utils.contributions import (
    finalize_contribution,
    process_contribution_transfer,
)
from financials.utils.transfers import create_paystack_transfer_object

logger = get_task_logger(__name__)


@shared_task
def process_action_updates_and_one_time_contribution_transfer(request_data):
    """Processes contributions towards a bill and updates the the status of the
    action that triggered the contribution at every stage.

    This task is exclusively used for one-time bills.

    Creates a transaction object in db for the contribution and initiates a Paystack
    transfer to the bill's creditor.

    Args:
        request_data (dict): The JSON request data received from the Paystack webhook.
    """

    data = request_data.get("data")

    metadata = data.get("metadata")

    action_id = metadata.get("action_id")

    process_contribution_transfer(
        action_id=action_id,
        request_data=request_data,
        transaction_type=PaystackTransaction.TransactionChoices.ONE_TIME_CONTRIBUTION,
    )


@shared_task
def record_contribution_transfer_object(request_data, transfer_outcome):
    """Create or update a PaystackTransfer object with data from the
    request_data and the outcome of the transfer.

    The task is dedicated to transfers made of contributions of participants to
    contributors.

    Args:
        request_data (dict): A dictionary of data received from Paystack
            webhooks containing information on a successful or failed
            transfer.
        transfer_outcome (str): A string indicating the outcome of the
            transfer, could be `PaystackTransfer.TransferOutcome.SUCCESS` or
            `PaystackTransfer.TransferOutcome.FAILED`, for example.
    """

    data = request_data.get("data")

    reason = data.get("reason")

    action_id = extract_uuidv4s_from_string(reason, position=1)
    action = BillAction.objects.select_related("participant").get(uuid=action_id)
    paying_user = action.participant

    recipient_code = data.get("recipient").get("recipient_code")
    recipient = TransferRecipient.objects.select_related("user").get(
        recipient_code=recipient_code
    )
    receiving_user = recipient.user

    create_paystack_transfer_object(
        request_data=request_data,
        recipient=recipient,
        paying_user=paying_user,
        receiving_user=receiving_user,
        transfer_outcome=transfer_outcome,
        transfer_type=PaystackTransfer.TransferChoices.CREDITOR_SETTLEMENT,
        action=action,
    )


@shared_task
def finalize_one_time_contribution(
    request_data,
    transfer_outcome=PaystackTransfer.TransferOutcomeChoices.SUCCESSFUL,
    final_action_status=BillAction.StatusChoices.COMPLETED,
):
    """Finalizes a one-time contribution by creating a BillTransaction object, a
    PaystackTransfer object, and marking the corresponding BillAction as
    completed.

    Args:
        request_data (dict): A dictionary of data received from Paystack
            webhooks containing information on a successful or failed
            transfer.
        transfer_outcome (str): A string indicating the outcome of the
            transfer, should be `PaystackTransfer.TransferOutcome.SUCCESS`
    """

    finalize_contribution(
        request_data=request_data,
        transfer_outcome=transfer_outcome,
        final_action_status=final_action_status,
    )
