from bills.utils.fees import calculate_all_transaction_fees
from financials.models import PaystackTransaction, UserCard


def generate_add_card_paystack_payload(charge_amount, user):
    """
    Formats the payload for adding a card on Paystack through the initialize
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
    metadata = {
        "full_name": user.full_name,
        "user_id": user.uuid.__str__(),
        "is_card_addition": True,
        "refundable_amount": str(refundable_amount),
    }

    return {
        "email": email,
        "amount": AMOUNT_IN_KOBO,
        "metadata": metadata,
    }


def create_card_object_from_webhook(authorization, customer, user) -> UserCard:
    """
    Create a new UserCard object.

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
        "user": user,
        "complete_paystack_response": authorization,
    }

    new_card, created = UserCard.objects.get_or_create(
        signature=signature, defaults=defaults
    )

    return new_card


def create_card_addition_paystack_transaction_object(
    data,
    metadata,
    new_card,
    user,
    request_data,
) -> PaystackTransaction:
    """
    Create a new PaystackTransaction object for the addition of a card.

    Args:
        data (dict): The data field from the Paystack webhook request.
        metadata (dict): The metadata field from the Paystack webhook request.
        new_card (UserCard): The newly created UserCard object.
        user: The user associated with the transaction.
        request_data (dict): The complete Paystack webhook request data.

    Returns:
        PaystackTransaction: The newly created PaystackTransaction object.
    """

    paystack_transaction_object = {
        "amount": data.get("amount"),
        "refundable_amount": metadata.get("refundable_amount"),
        "card": new_card,
        "paying_user": user,
        "transaction_outcome": PaystackTransaction.TransactionOutcomeChoices.SUCCESSFUL,
        "transaction_type": PaystackTransaction.TransactionChoices.CARD_ADDITION,
        "paystack_transaction_id": data.get("id"),
        "paystack_transaction_reference": data.get("reference"),
        "complete_paystack_response": request_data,
    }

    new_transaction, created = PaystackTransaction.objects.get_or_create(
        **paystack_transaction_object
    )

    return new_transaction
