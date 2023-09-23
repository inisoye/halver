from celery.utils.log import get_task_logger

from bills.utils.fees import calculate_all_transaction_fees
from core.utils.currency import convert_to_naira
from financials.models import PaystackTransaction, UserCard

logger = get_task_logger(__name__)


def generate_add_card_paystack_payload(charge_amount, user):
    """Formats the payload for adding a card on Paystack through the initialize
    transaction API endpoint.

    Args:
        charge_amount (decimal.Decimal): The amount to charge the user in the default
        currency (usally Naira).
        user (User): The user for whom the card is being added.

    Returns:
        dict: A dictionary containing the payload for adding a card on Paystack.
    """

    AMOUNT = charge_amount
    AMOUNT_IN_KOBO = AMOUNT * 100

    # Refundable amount is in default currency (Naira not Kobo, for example).
    refundable_amount = calculate_all_transaction_fees(AMOUNT)["card_addition_refund"]

    email = user.email
    uuid_string = user.uuid.__str__()
    refundable_amount_string = str(refundable_amount)

    metadata = {
        "full_name": user.full_name,
        "user_id": uuid_string,
        "is_card_addition": True,
        "refundable_amount": refundable_amount_string,
        "custom_fields": [
            {
                "display_name": "User's Full Name",
                "variable_name": "full_name",
                "value": user.full_name,
            },
            {
                "display_name": "User ID",
                "variable_name": "user_id",
                "value": uuid_string,
            },
            {
                "display_name": "Transaction Type",
                "variable_name": "transaction_type",
                "value": "Card addition",
            },
            {
                "display_name": "Refundable Amount",
                "variable_name": "refundable_amount",
                "value": refundable_amount_string,
            },
        ],
    }

    return {
        "email": email,
        "amount": AMOUNT_IN_KOBO,
        "metadata": metadata,
        "channels": ["card"],
    }


def create_card_object_from_webhook(authorization, customer, user) -> UserCard:
    """Create a new UserCard object.

    Args:
        authorization (dict): The authorization object returned by Paystack.
        customer (dict): The customer object returned by Paystack.
        user: The user object associated with the card.

    Returns:
        UserCard: The newly created UserCard object.
    """

    signature = authorization.get("signature")

    defaults = {
        "authorization_code": authorization.get("authorization_code"),
        "first_6": authorization.get("bin"),
        "last_4": authorization.get("last_4"),
        "exp_month": authorization.get("exp_month"),
        "exp_year": authorization.get("exp_year"),
        "channel": authorization.get("channel"),
        "card_type": authorization.get("card_type"),
        "bank": authorization.get("bank"),
        "country_code": authorization.get("country_code"),
        "brand": authorization.get("brand"),
        "reusable": authorization.get("reusable"),
        "account_name": authorization.get("account_name"),
        "email": customer.get("email"),
        "complete_paystack_response": authorization,
    }

    new_card, created = UserCard.objects.get_or_create(
        signature=signature,
        user=user,
        defaults=defaults,
    )

    return new_card


def create_card_addition_paystack_transaction_object(
    data,
    metadata,
    new_card,
    user,
    request_data,
) -> PaystackTransaction:
    """Create a new PaystackTransaction object for the addition of a card.

    Args:
        data (dict): The data field from the Paystack webhook request.
        metadata (dict): The metadata field from the Paystack webhook request.
        new_card (UserCard): The newly created UserCard object.
        user: The user associated with the transaction.
        request_data (dict): The complete Paystack webhook request data.

    Returns:
        PaystackTransaction: The newly created PaystackTransaction object.
    """

    amount = data.get("amount")
    amount_in_naira = convert_to_naira(amount)

    paystack_transaction_object = {
        "amount": amount,
        "amount_in_naira": amount_in_naira,
        "refundable_amount": metadata.get("refundable_amount"),
        "card": new_card,
        "paying_user": user,
        "transaction_outcome": PaystackTransaction.TransactionOutcomeChoices.SUCCESSFUL,
        "transaction_type": PaystackTransaction.TransactionChoices.CARD_ADDITION,
        "paystack_transaction_id": data.get("id"),
        "paystack_transaction_reference": data.get("reference"),
        "complete_paystack_response": request_data,
    }

    new_transaction = PaystackTransaction.objects.create(**paystack_transaction_object)

    return new_transaction
