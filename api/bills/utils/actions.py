from core.utils.currency import convert_to_kobo_integer
from libraries.paystack.transaction_requests import TransactionRequests


def handle_one_time_contribution(
    bill_name,
    participant_name,
    participant_uuid_string,
    creditor_uuid_string,
    participant_card,
    amount_in_kobo,
):
    """Handle a one-time contribution by creating a Paystack charge for a
    participant's card (or authorization as it is called by Paystack).

    Args:
        bill_name (str): The name of the bill being contributed to.
        participant_name (str): The name of the participant making the contribution.
        participant_uuid_string (str): The UUID string of the participant making the
            contribution.
        creditor_uuid_string (str): The UUID string of the creditor receiving the
            contribution.
        participant_card (dict): A dictionary representing the participant's card,
            containing an authorization code and email.
        amount_in_kobo (int): The amount of the contribution in kobo (the smallest
            currency unit in Nigeria).

    Returns:
        dict: A dictionary representing the Paystack charge created for the contribution.
    """

    transaction_type = f"One time contribution to {bill_name} bill."

    metadata = {
        "full_name": participant_name,
        "user_id": participant_uuid_string,
        "creditor_id": creditor_uuid_string,
        "is_contribution": True,
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


def handle_bill_contribution(action):
    """Handle a contribution to a bill by either creating a Paystack charge for
    a one-time payment or creating a subscription to automatically charge the
    participant's card.

    The function is called after a valid response to a bill action is recieved.

    Args:
        action (object): An object representing the action to be taken, containing a
            bill and a participant.

    Returns:
        dict: A dictionary representing the Paystack charge created for the contribution
            (if the bill is not recurring) or a dictionary representing the subscription.
    """

    bill = action.bill
    bill_name = bill.name
    is_bill_recurring = bill.is_recurring

    amount = action.total_payment_due
    amount_in_kobo = convert_to_kobo_integer(amount)

    creditor = bill.creditor
    creditor_uuid_string = creditor.uuid.__str__()

    participant = action.participant
    participant_card = participant.default_card
    participant_name = participant.full_name
    participant_uuid_string = participant.uuid.__str__()

    # Handle one-time payments
    if not is_bill_recurring:
        charge_response = handle_one_time_contribution(
            bill_name=bill_name,
            participant_name=participant_name,
            participant_uuid_string=participant_uuid_string,
            creditor_uuid_string=creditor_uuid_string,
            participant_card=participant_card,
            amount_in_kobo=amount_in_kobo,
        )

        return charge_response
