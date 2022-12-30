from django.conf import settings
from django.db import models

from core.utils import TimeStampedUUIDModel, get_user_by_id

User = settings.AUTH_USER_MODEL


class UserCard(TimeStampedUUIDModel):
    """
    Stores fields returned by Paystack to represent a card.

    channel('card'), reusable(true) and country_code('NG') have not been added
    as they are fixed in this case.
    """

    account_name = models.CharField(
        blank=True,
        max_length=100,
    )
    authorization_code = models.CharField(
        blank=True,
        max_length=100,
    )
    bank = models.CharField(
        blank=True,
        max_length=100,
    )
    first6 = models.CharField(
        blank=True,
        max_length=10,
        verbose_name="Card's first 6 digits (bin)",
    )
    card_type = models.CharField(
        blank=True,
        max_length=10,
    )
    email = models.CharField(
        blank=True,
        max_length=100,
    )
    exp_month = models.CharField(
        blank=True,
        max_length=10,
    )
    exp_year = models.CharField(
        blank=True,
        max_length=10,
    )
    is_default = models.BooleanField(default=False)
    last4 = models.CharField(
        blank=True,
        max_length=4,
        verbose_name="Card's last 4 digits",
    )
    signature = models.CharField(
        blank=True,
        max_length=100,
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="cards",
    )

    def __str__(self) -> str:
        return f"{self.user.last_name} {self.last4} ({self.card_type})"

    def set_as_default_card(self) -> None:
        self.user.cards.update(is_default=False)
        self.is_default = True
        self.save(update_fields=["is_default"])

    @classmethod
    def create_card_from_webhook(cls, webhook_data) -> None:
        """Create card with obtained webhook data.

        Args:
            webhook_data: Data returned through webhook by Paystack
        """

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
            "email": customer_data["email"],
            "exp_month": authorization_data["exp_month"],
            "exp_year": authorization_data["exp_year"],
            "last4": authorization_data["last4"],
            "user": user,
            "signature": authorization_data["signature"],
        }

        # TODO Add logic here that automatically calls the set_default_card method to
        # make every new card the default

        cls.objects.update_or_create(**defaults, defaults=defaults)


class TransferRecipient(TimeStampedUUIDModel):
    """
    Stores fields returned by Paystack to represent an account (nuban)
    or card(authorization) transfer recipient.
    """

    class RecipientChoices(models.TextChoices):
        CARD = "authorization", "Card"
        ACCOUNT = "nuban", "Account"

    is_default = models.BooleanField(
        default=False,
    )
    recipient_code = models.CharField(
        blank=True,
        max_length=100,
    )
    recipient_type = models.CharField(
        max_length=50,
        choices=RecipientChoices.choices,
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="transfer_recipients",
    )

    def __str__(self) -> str:
        return f"{self.user.last_name} {self.recipient_type} ({self.recipient_code})"
