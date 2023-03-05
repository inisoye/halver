import uuid

from celery.utils.log import get_task_logger

from core.utils.currency import convert_to_kobo_integer, convert_to_naira
from financials.models import PaystackTransaction, UserCard
from libraries.paystack.transaction_requests import TransactionRequests
from libraries.paystack.transfer_requests import TransferRequests

logger = get_task_logger(__name__)


def handle_one_time_contribution(
    bill_name,
    participant_name,
    action_uuid_string,
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
        "action_id": action_uuid_string,
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
    participant's card over a given interval.

    The function is called after a valid response to a bill action is recieved.

    Args:
        action (object): An object representing the action to be taken, containing a
            bill and a participant.

    Returns:
        dict: A dictionary representing the Paystack charge created for the contribution
            (if the bill is not recurring) or a dictionary representing the subscription.
    """

    action_uuid_string = action.uuid.__str__()

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
            action_uuid_string=action_uuid_string,
            participant_name=participant_name,
            participant_uuid_string=participant_uuid_string,
            creditor_uuid_string=creditor_uuid_string,
            participant_card=participant_card,
            amount_in_kobo=amount_in_kobo,
        )

        return charge_response

    has_subscription_been_created = action.paystack_subscription.exists()

    # if not has_subscription_been_created:


def create_contribution_transaction_object(data, action, participant, request_data):
    amount = data.get("amount")
    amount_in_naira = convert_to_naira(amount)

    authorization_signature = data.get("authorization").get("signature")
    card = UserCard.objects.get(signature=authorization_signature)

    paystack_transaction_object = {
        "amount": amount,
        "amount_in_naira": amount_in_naira,
        "card": card,
        "action": action,
        "paying_user": participant,
        "transaction_outcome": PaystackTransaction.TransactionOutcomeChoices.SUCCESSFUL,
        "transaction_type": PaystackTransaction.TransactionChoices.PARTICIPANT_PAYMENT,
        "paystack_transaction_id": data.get("id"),
        "paystack_transaction_reference": data.get("reference"),
        "complete_paystack_response": request_data,
    }

    new_transaction = PaystackTransaction.objects.create(**paystack_transaction_object)

    return new_transaction


def initiate_contribution_transfer(
    contribution_amount,
    creditor_default_recipient_code,
    reason,
) -> None:
    paystack_transfer_payload = {
        "source": "balance",
        "amount": contribution_amount,
        "recipient": creditor_default_recipient_code,
        "reason": reason,
        "reference": str(uuid.uuid4()),
    }

    response = TransferRequests.initiate(**paystack_transfer_payload)

    if not response["status"]:
        paystack_error = response["message"]
        logger.error(f"Error intiating Paystack transfer: {paystack_error}")
