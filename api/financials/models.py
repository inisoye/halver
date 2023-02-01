from django.conf import settings
from django.db import models

from bills.models import Action
from core.models import AbstractTimeStampedUUIDModel
from financials.utils.common import delete_and_set_newest_as_default, set_as_default


class UserCard(AbstractTimeStampedUUIDModel, models.Model):
    """
    Stores data returned by Paystack to represent a card.
    """

    authorization_code = models.CharField(
        max_length=100,
    )
    first_6 = models.CharField(
        max_length=10,
        verbose_name="Card's first 6 digits (bin)",
    )
    last_4 = models.CharField(
        max_length=4,
        verbose_name="Card's last 4 digits",
    )
    exp_month = models.CharField(
        max_length=10,
    )
    exp_year = models.CharField(
        max_length=10,
    )
    channel = models.CharField(
        max_length=10,
    )
    card_type = models.CharField(
        max_length=10,
    )
    bank = models.CharField(
        max_length=100,
    )
    country_code = models.CharField(
        max_length=2,
        verbose_name="Country where card was issued",
    )
    brand = models.CharField(
        max_length=100,
    )
    reusable = models.BooleanField()
    signature = models.CharField(
        max_length=100,
        unique=True,
    )
    account_name = models.CharField(
        max_length=100,
        null=True,
    )
    email = models.CharField(
        max_length=100,
        null=True,
    )
    is_default = models.BooleanField(
        default=False,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cards",
    )
    complete_paystack_response = models.JSONField(
        editable=False,
    )

    def __str__(self) -> str:
        return (
            f"user: {self.user.full_name}, card: {self.last_4}, "
            f"card type: ({self.card_type})"
        )

    def set_as_default_card(self) -> None:
        """
        Sets current card instance as the default.
        """

        set_as_default(self, "user_card")

    def delete_and_set_newest_as_default(self) -> None:
        """
        Deletes the current card instance. If the deleted instance was the default card,
        the newest of the remaining instances will be set as the new default.
        """

        delete_and_set_newest_as_default(self, "user_card")

    class Meta:
        ordering = ["-created", "user"]
        verbose_name = "User card"
        verbose_name_plural = "User cards"


class TransferRecipient(AbstractTimeStampedUUIDModel, models.Model):
    """
    Stores data returned by Paystack to represent an account (nuban)
    or card (authorization) transfer recipient.
    """

    class RecipientChoices(models.TextChoices):
        CARD = "authorization", "Card"
        ACCOUNT = "nuban", "Bank account"

    is_default = models.BooleanField(
        default=False,
    )
    recipient_code = models.CharField(
        max_length=100,
        unique=True,
    )
    recipient_type = models.CharField(
        max_length=50,
        choices=RecipientChoices.choices,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transfer_recipients",
    )
    name = models.CharField(
        max_length=100,
    )
    account_number = models.CharField(
        max_length=10,
        blank=True,
        null=True,
    )
    bank_code = models.CharField(
        max_length=5,
        blank=True,
        null=True,
    )
    bank_name = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )
    email = models.EmailField(
        blank=True,
        null=True,
    )
    authorization_code = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )
    associated_card = models.OneToOneField(
        UserCard,
        on_delete=models.CASCADE,
        null=True,
        unique=True,
        related_name="associated_transfer_recipient",
    )
    complete_paystack_response = models.JSONField(
        editable=False,
    )

    def __str__(self) -> str:
        return f"user: {self.user.full_name}, type: {self.recipient_type}, " + (
            f"bank name: {self.bank_name}" if self.bank_name else ""
        )

    def set_as_default_recipient(self) -> None:
        """
        Sets current transfer recipient instance as the default.
        """

        set_as_default(self, "transfer_recipient")

    def delete_and_set_newest_as_default(self) -> None:
        """
        Deletes the current transfer recipient instance. If the deleted instance was
        the default recipient, the newest of the remaining instances will be set as the
        new default.
        """

        delete_and_set_newest_as_default(self, "transfer_recipient")

    class Meta:
        ordering = ["-created", "user"]
        verbose_name = "User transfer recipient"
        verbose_name_plural = "User transfer recipients"


class PaystackPlan(AbstractTimeStampedUUIDModel, models.Model):
    """
    Stores data returned by Paystack to represent a plan.

    Should not be deletable.
    """

    class IntervalChoices(models.TextChoices):
        DAILY = "daily", "Daily"
        WEEKLY = "weekly", "Weekly"
        MONTHLY = "monthly", "Monthly"
        BIANNUALLY = "biannually", "Biannually"
        ANNUALLY = "annually", "Annually"

    name = models.CharField(
        max_length=100,
    )
    interval = models.CharField(
        max_length=50,
        choices=IntervalChoices.choices,
    )
    plan_code = models.CharField(
        max_length=100,
    )
    amount = models.DecimalField(
        verbose_name="Amount to be paid within each interval",
        max_digits=19,
        decimal_places=4,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="paystack_plans",
    )
    complete_paystack_response = models.JSONField(
        editable=False,
    )

    def __str__(self) -> str:
        return f"name: {self.name}, interval: {self.interval}, amount: {self.amount}"

    class Meta:
        ordering = ["-created", "user"]
        verbose_name = "Paystack plan"
        verbose_name_plural = "Paystack plans"


class PaystackSubscription(AbstractTimeStampedUUIDModel, models.Model):
    """
    Stores data returned by Paystack to represent a subscription.

    Should not be deletable. Subscriptions should be recorded as cancelled when they end.
    """

    class SubscriptionChoices(models.TextChoices):
        ACTIVE = "active", "Active"
        NON_RENEWING = "non-renewing", "Non-renewing"
        ATTENTION = "attention", "Attention"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    plan = models.ForeignKey(
        PaystackPlan,
        on_delete=models.CASCADE,
        related_name="paystack_subscriptions",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="paystack_subscriptions",
    )
    status = models.CharField(
        max_length=50,
        choices=SubscriptionChoices.choices,
    )
    card = models.ForeignKey(
        UserCard,
        on_delete=models.CASCADE,
        null=True,
        related_name="paystack_subscriptions",
        help_text=(
            "NULL means the card used for this transaction has been deleted"
            " on Halver. Check full paystack data for card details."
        ),
    )
    start_date = models.DateTimeField()
    next_payment_date = models.DateTimeField()
    complete_paystack_response = models.JSONField(
        editable=False,
    )

    def __str__(self) -> str:
        return (
            f"user: {self.user.full_name}, plan interval: {self.plan.interval},"
            f" plan amount: {self.plan.amount}"
        )

    class Meta:
        ordering = ["-created", "user"]
        verbose_name = "Paystack subscription"
        verbose_name_plural = "Paystack subscriptions"


class PaystackTransaction(AbstractTimeStampedUUIDModel, models.Model):
    """
    Stores data returned by Paystack after a verified card transaction.
    """

    class TransactionChoices(models.TextChoices):
        PARTICIPANT_PAYMENT = "participant-payment", "Participant payment"
        CARD_ADDITION = "card-addition", "Card addition"

    class TransactionOutcomeChoices(models.TextChoices):
        SUCCESSFUL = "successful", "Successful"
        FAILED = "failed", "Failed"

    amount = models.DecimalField(
        max_digits=19,
        decimal_places=4,
    )
    refundable_amount = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        blank=True,
        null=True,
    )
    card = models.ForeignKey(
        UserCard,
        on_delete=models.SET_NULL,
        null=True,
        related_name="paystack_transactions",
        help_text=(
            "NULL means the card used for this transaction has been deleted"
            " on Halver. Check full paystack data for card details."
        ),
    )
    action = models.ForeignKey(
        Action,
        on_delete=models.SET_NULL,
        null=True,
        related_name="paystack_transactions",
    )
    paying_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="paystack_transactions",
    )
    # TODO Detect failure from both status==False and also data.status!="success"
    transaction_outcome = models.CharField(
        max_length=50,
        choices=TransactionOutcomeChoices.choices,
    )
    transaction_type = models.CharField(
        max_length=50,
        choices=TransactionChoices.choices,
    )
    paystack_transaction_id = models.BigIntegerField()
    paystack_transaction_reference = models.CharField(
        max_length=100,
    )
    complete_paystack_response = models.JSONField(
        editable=False,
    )

    def __str__(self) -> str:
        return f"amount: {self.amount}, type: {self.transaction_outcome}"

    class Meta:
        ordering = ["-created"]
        verbose_name = "Paystack transaction"
        verbose_name_plural = "Paystack transactions"


class PaystackTransfer(AbstractTimeStampedUUIDModel, models.Model):
    """
    Stores data returned by Paystack after a verified transfer.
    """

    class TransferChoices(models.TextChoices):
        CREDITOR_SETTLEMENT = "creditor-settlement", "Creditor settlement"
        CARD_ADDITION_REFUND = "card-addition-refund", "Card addition refund"

    class TransferOutcomeChoices(models.TextChoices):
        SUCCESSFUL = "successful", "Successful"
        FAILED = "failed", "Failed"
        REVERSED = "reversed", "Reversed"

    amount = models.DecimalField(
        max_digits=19,
        decimal_places=4,
    )
    # TODO Create a new uuidv4 for this field. The field should be created at point
    # the transfer is initiated. Can be made to match the object's uuid field value.
    paystack_transfer_reference = models.UUIDField(
        unique=True,
        editable=False,
        verbose_name="Public identifier",
    )
    recipient = models.ForeignKey(
        TransferRecipient,
        on_delete=models.SET_NULL,
        null=True,
        related_name="paystack_transfers_received",
        help_text=(
            "NULL means the recipient who received this transfer has been deleted"
            " on Halver. Check full paystack data for recipient details."
        ),
    )
    action = models.ForeignKey(
        Action,
        on_delete=models.SET_NULL,
        null=True,
        related_name="paystack_transfers",
    )
    receiving_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="paystack_transfers_received",
    )
    # TODO Success should have data.status=="success" and so on
    transfer_outcome = models.CharField(
        max_length=50,
        choices=TransferOutcomeChoices.choices,
    )
    transfer_type = models.CharField(
        max_length=50,
        choices=TransferChoices.choices,
    )
    complete_paystack_response = models.JSONField(
        editable=False,
    )

    def __str__(self) -> str:
        return f"amount: {self.amount}, type: {self.transfer_outcome}"

    class Meta:
        ordering = ["-created"]
        verbose_name = "Paystack transfer"
        verbose_name_plural = "Paystack transfers"
