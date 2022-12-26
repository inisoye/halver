from django.conf import settings
from django.db import models

from core.utils import get_user

User = settings.AUTH_USER_MODEL


class UserCard(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cards")

    # Fields obtained from Paystack's authorization response
    # channel('card'), reusable(true) and country_code('NG') have not been added to model
    account_name = models.CharField(blank=True, max_length=100)
    authorization_code = models.CharField(blank=True, max_length=100)
    bank = models.CharField(blank=True, max_length=100)
    first6 = models.CharField(
        blank=True,
        max_length=10,
        verbose_name="Card's first 6 digits (bin)",
    )
    card_type = models.CharField(blank=True, max_length=10)
    email = models.CharField(blank=True, max_length=100)
    exp_month = models.CharField(blank=True, max_length=10)
    exp_year = models.CharField(blank=True, max_length=10)
    last4 = models.CharField(
        blank=True,
        max_length=4,
        verbose_name="Card's last 4 digits",
    )
    signature = models.CharField(blank=True, max_length=100)

    @classmethod
    def create(cls, user, customer_data, authorization_data) -> None:
        """Create new card

        Args:
            user (CustomUser): The user for whom the card is created
            customer_data : Customer data returned from Paystack through webhook or API
            authorization_data : Authorization data returned from Paystack through
            webhook or API
        """

        defaults = {
            "account_name": authorization_data["account_name"],
            "authorization_code": authorization_data["authorization_code"],
            "bank": authorization_data["bank"],
            "first6": authorization_data["bin"],
            "card_type": authorization_data["card_type"],
            "email": customer_data["email"],
            "exp_month": authorization_data["exp_month"],
            "exp_year": authorization_data["exp_year"],
            "last4": authorization_data["last4"],
            "user": user,
            "signature": authorization_data["signature"],
        }

        cls.objects.update_or_create(**defaults, defaults=defaults)

    @classmethod
    def create_card_from_webhook(cls, webhook_data) -> None:
        """Create card with obtained webhook data

        Args:
            webhook_data: Data returned through webhook by Paystack
        """

        user_id = webhook_data["metadata"]["user_id"]
        user = get_user(user_id)

        customer_data = webhook_data["customer"]
        authorization_data = webhook_data["authorization"]

        cls.create(user, customer_data, authorization_data)
