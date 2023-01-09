from django.conf import settings
from django.db import models

from core.models import AbstractTimeStampedUUIDModel
from financials.utils.cards import create_card
from financials.utils.common import set_as_default

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

    def save(self, *args, **kwargs) -> None:
        if self.pk is None:
            # Make every new card the default card
            set_as_default(self, "user_card")

        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-created", "user"]
        verbose_name = "User Card"
        verbose_name_plural = "User Cards"

    def __str__(self) -> str:
        return f"{self.user.last_name} {self.last4} ({self.card_type})"

    @classmethod
    def create_card_from_webhook(cls, webhook_data) -> None:
        """Create card with obtained webhook data.

        Args:
            webhook_data: Data returned through webhook by Paystack
        """

        create_card(cls, webhook_data)


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

    def save(self, *args, **kwargs) -> None:
        if self.pk is None:
            # Make every new recipient the default recipient
            set_as_default(self, "transfer_recipient")

        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-created", "user"]
        verbose_name = "User Transfer Recipient"
        verbose_name_plural = "User Transfer Recipients"

    def __str__(self) -> str:
        return f"{self.user.last_name} {self.recipient_type} ({self.recipient_code})"
