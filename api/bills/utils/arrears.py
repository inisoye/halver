import json
import uuid

from celery.utils.log import get_task_logger

from bills.models import BillArrear
from core.utils.currency import convert_to_kobo_integer
from financials.models import PaystackTransaction, PaystackTransfer
from financials.utils.contributions import create_contribution_transaction_object
from libraries.notifications.base import send_push_messages
from libraries.paystack.transaction_requests import TransactionRequests
from libraries.paystack.transfer_requests import TransferRequests

logger = get_task_logger(__name__)


def handle_arrear_contribution(arrear):
    """Handle an arrear contribution by creating a Paystack charge for a
    participant's card (or authorization as it is called by Paystack).

    Args:
        arrear (object): An arrear object, based on which the charge
        will be made.

    Returns:
        dict: A dictionary representing the Paystack charge created for the contribution.
    """

    arrear_uuid_string = arrear.uuid.__str__()

    bill = arrear.bill
    bill_name = bill.name

    amount = arrear.total_payment_due
    amount_in_kobo = convert_to_kobo_integer(amount)

    creditor = bill.creditor
    creditor_uuid_string = creditor.uuid.__str__()

    participant = arrear.participant
    participant_card = participant.default_card
    participant_name = participant.full_name
    participant_uuid_string = participant.uuid.__str__()

    transaction_type = f"Arrear contribution to {bill_name} bill."

    metadata = {
        "full_name": participant_name,
        "arrear_id": arrear_uuid_string,
        "user_id": participant_uuid_string,
        "creditor_id": creditor_uuid_string,
        "is_arrear_contribution": True,
        "transaction_type": transaction_type,
        "custom_fields": [
            {
                "display_name": "User's Full Name",
                "variable_name": "full_name",
                "value": participant_name,
            },
            {
                "display_name": "User ID",
                "variable_name": "user_id",
                "value": participant_uuid_string,
            },
            {
                "display_name": "Transaction Type",
                "variable_name": "transaction_type",
                "value": transaction_type,
            },
        ],
    }

    charge_response = TransactionRequests.charge(
        authorization_code=participant_card.authorization_code,
        email=participant_card.email,
        amount=amount_in_kobo,
        metadata=metadata,
        channels=["card"],
    )

    return charge_response


def process_arrear_contribution_transfer(arrear_id, request_data):
    """Processes an arrear contribution and initiates a Paystack transfer.

    Creates a transaction object in db for the contribution and initiates a Paystack
    transfer to the bill's creditor.

    Args:
        arrear_id (str): The UUID of the BillArrear object.
        request_data (dict): The JSON request data received from the Paystack webhook.
        transaction_type (str): The type of transaction to be recorded in the
            PaystackTransaction object.
    """

    transaction_type = PaystackTransaction.TransactionChoices.ARREAR_CONTRIBUTION

    arrear = BillArrear.objects.select_related(
        "participant", "bill", "bill__creditor", "action"
    ).get(uuid=arrear_id)

    contribution_amount = arrear.contribution
    contribution_amount_in_kobo = convert_to_kobo_integer(contribution_amount)

    participant = arrear.participant
    participant_name = participant.full_name

    bill = arrear.bill
    bill_name = bill.name

    creditor = bill.creditor
    creditor_name = creditor.full_name
    creditor_default_recipient_code = creditor.default_transfer_recipient.recipient_code

    action = arrear.action

    arrear.mark_as_pending_transfer()
    action.mark_as_last_failed()

    data = request_data.get("data")

    create_contribution_transaction_object(
        data=data,
        action=action,
        participant=participant,
        request_data=request_data,
        transaction_type=transaction_type,
        arrear=arrear,
    )

    # Use this to get specific transaction when recording bill transaction in db.
    # Check finalize_contribution method
    paystack_transaction_id = data.get("id")

    # ! Be careful not to change "transfer_reason" string format without a good reason.
    # ! The ids in it are used for transfer logic.
    transfer_reason = (
        f"{transaction_type.label} transfer for arrear with ID: {arrear_id} from"
        f" {participant_name} to {creditor_name}, on bill: {bill_name}. Paystack"
        f" transaction id: {paystack_transaction_id}."
    )

    transfer_reference = str(uuid.uuid4())

    failed_paystack_transfer_object_defaults = {
        "amount": contribution_amount_in_kobo,
        "amount_in_naira": contribution_amount,
        "uuid": transfer_reference,
        "recipient": creditor.default_transfer_recipient,
        "action": action,
        "arrear": arrear,
        "paying_user": participant,
        "receiving_user": creditor,
        "transfer_outcome": PaystackTransfer.TransferOutcomeChoices.FAILED,
        "transfer_type": PaystackTransfer.TransferChoices.ARREAR_SETTLEMENT,
        "reason": transfer_reason,
    }

    error_push_parameters_list = [
        {
            "token": participant.expo_push_token,
            "title": "Contribution transfer error",
            "message": (
                "We could not successfully transfer your contribution on"
                f" {bill.name}. You can retry the transfer in the Halver app for"
                " free."
            ),
            "extra": {
                "action": "failed-or-reversed-transfer",
                "bill_name": bill.name,
                "bill_id": bill.uuid,
            },
        },
        {
            "token": creditor.expo_push_token,
            "title": "Contribution transfer error",
            "message": (
                f"We could not successfully transfer {participant.full_name}'s"
                f" contribution on {bill.name}. You can retry the transfer in the"
                " Halver app for free."
            ),
            "extra": {
                "action": "failed-or-reversed-transfer",
                "bill_name": bill.name,
                "bill_id": bill.uuid,
            },
        },
    ]

    try:
        # The custom reference passed here would help with idempotence.
        # If Paystack receives the same reference for two transfers,
        # an error would be thrown.
        paystack_transfer_payload = {
            "source": "balance",
            "amount": contribution_amount_in_kobo,
            "recipient": creditor_default_recipient_code,
            "reason": transfer_reason,
            "reference": transfer_reason,
        }

        response = TransferRequests.initiate(**paystack_transfer_payload)

        if not response["status"]:
            arrear.mark_as_failed_transfer()

            PaystackTransfer.objects.update_or_create(
                paystack_transfer_reference=transfer_reference,
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
        arrear.mark_as_failed_transfer()

        PaystackTransfer.objects.update_or_create(
            paystack_transfer_reference=transfer_reference,
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
