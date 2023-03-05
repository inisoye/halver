from core.utils.currency import convert_to_naira
from financials.models import PaystackTransfer, TransferRecipient


def create_paystack_transfer_object(
    request_data, transfer_outcome, transfer_type, action=None
) -> PaystackTransfer:
    """Create or update a PaystackTransfer object with data from the
    request_data and the outcome of the transfer.

    Args:
        request_data (dict): A dictionary of data received from Paystack
            webhooks containing information on a successful or failed
            transfer.
        transfer_outcome (str): A string indicating the outcome of the
            transfer, could be `PaystackTransfer.TransferOutcome.SUCCESS` or
            `PaystackTransfer.TransferOutcome.FAILED`, for example.
        transfer_type (str): A string indicating the type of transfer, such as
            "CARD_ADDITION_REFUND" or "CREDITOR_SETTLEMENT".

    Returns:
        PaystackTransfer: The newly created PaystackTransfer object.
    """

    data = request_data.get("data")

    recipient_code = data.get("recipient").get("recipient_code")
    recipient = TransferRecipient.objects.get(recipient_code=recipient_code)

    amount = data.get("amount")
    amount_in_naira = convert_to_naira(amount)

    paystack_transfer_object = {
        "amount": amount,
        "amount_in_naira": amount_in_naira,
        "paystack_transfer_reference": data.get("reference"),
        "uuid": data.get("reference"),
        "recipient": recipient,
        "action": action,
        "receiving_user": recipient.user,
        "transfer_outcome": transfer_outcome,
        "transfer_type": transfer_type,
        "complete_paystack_response": request_data,
    }

    return PaystackTransfer.objects.create(**paystack_transfer_object)
