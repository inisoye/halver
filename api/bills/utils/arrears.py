import uuid

from bills.models import BillArrear
from core.utils.currency import convert_to_kobo_integer
from financials.models import PaystackTransaction, PaystackTransfer
from financials.utils.contributions import (
    create_contribution_transaction_object,
    initiate_contribution_transfer,
)
from libraries.paystack.transaction_requests import TransactionRequests


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
    creditor_default_recipient = creditor.default_transfer_recipient
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

    # Create interim transfer object used to record failures if they occur.
    paystack_transfer_failure_object = {
        "amount": contribution_amount_in_kobo,
        "amount_in_naira": contribution_amount,
        "paystack_transfer_reference": transfer_reference,
        "uuid": transfer_reference,
        "recipient": creditor_default_recipient,
        "action": action,
        "arrear": arrear,
        "receiving_user": creditor,
        "transfer_outcome": PaystackTransfer.TransferOutcomeChoices.FAILED,
        "transfer_type": PaystackTransfer.TransferChoices.CREDITOR_SETTLEMENT,
    }

    # Idempotency should be ensured within this function.
    initiate_contribution_transfer(
        contribution_amount=contribution_amount_in_kobo,
        creditor_default_recipient_code=creditor_default_recipient_code,
        reason=transfer_reason,
        reference=transfer_reference,
        paystack_transfer_failure_object=paystack_transfer_failure_object,
    )
