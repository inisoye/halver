from core.utils import get_user_by_id


def create_card(UserCardModel, webhook_data) -> None:
    """Create card with obtained webhook data.

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
