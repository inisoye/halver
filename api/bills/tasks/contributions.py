from celery import shared_task
from celery.utils.log import get_task_logger

from bills.models import BillAction, BillTransaction
from bills.utils.contributions import (
    create_contribution_transaction_object,
    initiate_contribution_transfer,
)
from core.utils.currency import convert_to_kobo_integer, convert_to_naira
from core.utils.strings import extract_uuidv4s_from_string
from financials.models import PaystackTransaction, PaystackTransfer
from financials.utils.transfers import create_paystack_transfer_object

logger = get_task_logger(__name__)


@shared_task
def process_action_updates_and_contribution_transfer(request_data):
    """Processes contributions towards a bill and updates the the status of the
    action that triggered the contribution at every stage.

    Args:
        request_data (dict): The JSON request data received from the Paystack webhook.
    """

    data = request_data.get("data")

    metadata = data.get("metadata")

    action_id = metadata.get("action_id")
    action = BillAction.objects.get(uuid=action_id)

    action.mark_as_pending_transfer()

    contribution_amount = action.contribution
    contribution_amount_in_kobo = convert_to_kobo_integer(contribution_amount)

    participant = action.participant
    participant_name = participant.full_name

    bill = action.bill
    bill_name = bill.name

    creditor = bill.creditor
    creditor_name = creditor.full_name
    creditor_default_recipient_code = creditor.default_transfer_recipient.recipient_code

    create_contribution_transaction_object(
        data=data,
        action=action,
        participant=participant,
        request_data=request_data,
    )

    transfer_reason = (
        f"One-time contribution transfer for action with ID: {action_id} from"
        f" {participant_name} to {creditor_name}, on bill: {bill_name}"
    )

    initiate_contribution_transfer(
        contribution_amount=contribution_amount_in_kobo,
        creditor_default_recipient_code=creditor_default_recipient_code,
        reason=transfer_reason,
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

    # The action is effectively complete as the transfer has been successful.
    action_id = extract_uuidv4s_from_string(reason, position=1)
    action = BillAction.objects.get(uuid=action_id)

    create_paystack_transfer_object(
        request_data=request_data,
        transfer_outcome=transfer_outcome,
        transfer_type=PaystackTransfer.TransferChoices.CREDITOR_SETTLEMENT,
        action=action,
    )


@shared_task
def finalize_one_time_contribution(request_data, transfer_outcome):
    """Finalizes a one-time contribution by creating a BillTransaction object, a
    PaystackTransfer object, and marking the corresponding BillAction as
    completed.

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

    # The final contribution is the amount transferred to the creditor.
    amount = data.get("amount")

    # The action is effectively complete as the transfer has been successful.
    action_id = extract_uuidv4s_from_string(reason, position=1)
    action = BillAction.objects.get(uuid=action_id)
    action.mark_as_completed()

    # Used to obtain the amount paid in transaction
    paystack_transaction_object = PaystackTransaction.objects.get(action=action)

    paystack_transfer_object = create_paystack_transfer_object(
        request_data=request_data,
        transfer_outcome=transfer_outcome,
        transfer_type=PaystackTransfer.TransferChoices.CREDITOR_SETTLEMENT,
        action=action,
    )

    bill_transaction_object = {
        "bill": action.bill,
        "contribution": convert_to_naira(amount),
        "total_payment": paystack_transaction_object.amount_in_naira,
        "action": action,
        "paystack_transaction": paystack_transaction_object,
        "paystack_transfer": paystack_transfer_object,
    }

    BillTransaction.objects.create(**bill_transaction_object)
