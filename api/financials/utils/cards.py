from bills.utils.fees import calculate_all_transaction_fees
from core.utils.users import get_user_by_id


def generate_add_card_paystack_payload(charge_amount, user):
    """
       Formats the payload for adding a card on Paystack through the initialize
       transaction API endpoint.

    Args:
        charge_amount (decimal.Decimal): The amount to charge the user in the default
            currency.
        user (User): The user for whom the card is being added.

    Returns:
        dict: A dictionary containing the payload for adding a card on Paystack.
    """

    AMOUNT = charge_amount
    AMOUNT_IN_KOBO = AMOUNT * 100

    # Refundable amount is in default currency (Naira not Kobo, for example).
    refundable_amount = calculate_all_transaction_fees(AMOUNT)["card_addition_refund"]

    email = user.email
    metadata = dict(
        full_name=user.full_name,
        user_id=user.uuid.__str__(),
        is_refundable=True,
        refundable_amount=str(refundable_amount),
    )

    return dict(
        email=email,
        amount=AMOUNT_IN_KOBO,
        metadata=metadata,
    )


def create_card(UserCardModel, webhook_data) -> None:
    """
    Create card with obtained webhook data.

    Args:
        webhook_data: Data returned through webhook by Paystack
    """

    # TODO Add a method for adding new cards on paystack.
    # This should initialize transactions, should be refundable and should be
    # the only non-recurring paystack transaction for every user.

    # The user id added in the metadata of the initialized card transaction
    user_id = webhook_data["metadata"]["user_id"]
    # The user for whom the card is created
    user = get_user_by_id(user_id)
    customer_data = webhook_data["customer"]
    authorization_data = webhook_data["authorization"]

    defaults = {
        "account_name": authorization_data["account_name"],
        "authorization_code": authorization_data["authorization_code"],
        "bank": authorization_data["bank"],
        "first6": authorization_data["bin"],
        "card_type": authorization_data["card_type"],
        "country_code": authorization_data["country_code"],
        "email": customer_data["email"],
        "exp_month": authorization_data["exp_month"],
        "exp_year": authorization_data["exp_year"],
        "last4": authorization_data["last4"],
        "user": user,
        "signature": authorization_data["signature"],
    }

    UserCardModel.objects.update_or_create(**defaults, defaults=defaults)
