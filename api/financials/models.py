from django.conf import settings
from django.db import models

from core.models import AbstractTimeStampedUUIDModel
from core.utils import get_user_by_id

User = settings.AUTH_USER_MODEL


class UserCard(AbstractTimeStampedUUIDModel, models.Model):
    """
    Stores data returned by Paystack to represent a card.

    channel('card') and reusable(True) have not been added
    as they would normally be fixed in this case.
    They should be manually added when transactions are
    intialized with a card (or Paystack authorization).
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
    country_code = models.CharField(
        blank=True,
        max_length=2,
        verbose_name="Country where card was issued",
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
    first6 = models.CharField(
        blank=True,
        max_length=10,
        verbose_name="Card's first 6 digits (bin)",
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

    def set_as_default(self) -> None:
        """
        Sets current card instance as the default card.
        """

        self.user.cards.update(is_default=False)
        self.is_default = True
        self.save(update_fields=["is_default"])

    def save(self, *args, **kwargs):
        """
        Makes every new card the default card
        """

        if self.pk is None:
            self.set_as_default()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-created", "user"]
        verbose_name = "User's Card"
        verbose_name_plural = "User's Cards"

    def __str__(self) -> str:
        return f"{self.user.last_name} {self.last4} ({self.card_type})"

    @classmethod
    def create_card_from_webhook(cls, webhook_data) -> None:
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

        cls.objects.update_or_create(**defaults, defaults=defaults)


class TransferRecipient(AbstractTimeStampedUUIDModel, models.Model):
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

    def set_as_default(self) -> None:
        """
        Sets current recipient instance as the default recipient.
        """

        self.user.transfer_recipients.update(is_default=False)
        self.is_default = True
        self.save(update_fields=["is_default"])

    def save(self, *args, **kwargs):
        """
        Makes every new recipient the default recipient
        """

        if self.pk is None:
            self.set_as_default()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-created", "user"]
        verbose_name = "User's Transfer Recipient"
        verbose_name_plural = "User's Transfer Recipients"

    def __str__(self) -> str:
        return f"{self.user.last_name} {self.recipient_type} ({self.recipient_code})"
