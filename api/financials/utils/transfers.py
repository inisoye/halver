from core.utils.currency import convert_to_naira
from financials.models import PaystackTransfer


def create_paystack_transfer_object(
    request_data,
    transfer_outcome,
    transfer_type,
    recipient,
    receiving_user,
    paying_user=None,
    action=None,
    arrear=None,
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

    amount = data.get("amount")
    amount_in_naira = convert_to_naira(amount)

    paystack_transfer_reference = data.get("reference")

    paystack_transfer_object = {
        "amount": amount,
        "amount_in_naira": amount_in_naira,
        "paystack_transfer_reference": paystack_transfer_reference,
        "uuid": paystack_transfer_reference,
        "recipient": recipient,
        "action": action,
        "arrear": arrear,
        "paying_user": paying_user,
        "receiving_user": receiving_user,
        "transfer_outcome": transfer_outcome,
        "transfer_type": transfer_type,
        "complete_paystack_response": request_data,
    }

    # TODO this should be get or create for idempotency.
    # Prevent drawbacks of duplicate messages. Get by paystack transfer ref, maybe?
    return PaystackTransfer.objects.create(**paystack_transfer_object)


def extract_paystack_transaction_id_from_transfer_reason(reason: str):
    """Extract the Paystack transaction ID from a the reason string of a transfer.

    Example:
        >>> reason = "Subscription contribution transfer for action with ID:"
        ... " b2196cba-6441-4792-abc0-d1a8763413ae from Inioluwa Akinyosoye to Inioluwa"
        ... " Akinyosoye, on bill: Subscription tester.  Paystack transaction id:"
        ... " 2620540701."
        >>> extract_paystack_transaction_id(reason)
        '2620540701'

    Args:
        string (str): The string to extract the Paystack transaction ID from

    Returns:
        str: The Paystack transaction ID, or None if not found
    """

    # Check if the string contains the "Paystack transaction id:" substring
    if "Paystack transaction id:" in reason:
        # Split the string at the "Paystack transaction id:" substring
        split_string = reason.split("Paystack transaction id:")

        # Get the second substring (after the "Paystack transaction id:" substring)
        transaction_id_string = split_string[1]
        # sample value of transaction_id_string: ' 2620540701. jshajkhdjashkjdhakjshj'

        # Split the transaction ID substring on the first period and take the first part
        transaction_id = transaction_id_string.split(".", 1)[0]
        # sample value of transaction_id: '2620540701'

        # Strip any leading or trailing whitespace from the transaction ID and return it
        return transaction_id.strip()

    # If the string does not contain the "Paystack transaction id:" substring,
    # return None
    else:
        return None
