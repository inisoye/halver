from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from bills.models import BillAction, BillUnregisteredParticipant
from core.models import AbstractTimeStampedUUIDModel
from financials.utils.common import delete_and_set_newest_as_default, set_as_default


class UserCard(AbstractTimeStampedUUIDModel, models.Model):
    """Stores data returned by Paystack to represent a card."""

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
        """Sets current card instance as the default."""

        set_as_default(self, "user_card")

    def delete_and_set_newest_as_default(self) -> None:
        """Deletes the current card instance.

        If the deleted instance was the default card, the newest of the
        remaining instances will be set as the new default.
        """

        delete_and_set_newest_as_default(self, "user_card")

    class Meta:
        verbose_name = "User card"
        verbose_name_plural = "User cards"


class TransferRecipient(AbstractTimeStampedUUIDModel, models.Model):
    """Stores data returned by Paystack to represent an account (nuban) or card
    (authorization) transfer recipient."""

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
        unique=True,
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

    class Meta:
        verbose_name = "User transfer recipient"
        verbose_name_plural = "User transfer recipients"

    def set_as_default_recipient(self) -> None:
        """Sets current transfer recipient instance as the default."""

        set_as_default(self, "transfer_recipient")

    def delete_and_set_newest_as_default(self) -> None:
        """Deletes the current transfer recipient instance.

        If the deleted instance was the default recipient, the newest of the
        remaining instances will be set as the new default.
        """

        delete_and_set_newest_as_default(self, "transfer_recipient")


class PaystackPlan(AbstractTimeStampedUUIDModel, models.Model):
    """Stores data returned by Paystack to represent a plan.

    Should not be deletable.
    """

    class IntervalChoices(models.TextChoices):
        HOURLY = "hourly", "Hourly"
        DAILY = "daily", "Daily"
        WEEKLY = "weekly", "Weekly"
        MONTHLY = "monthly", "Monthly"
        QUARTERLY = "quarterly", "Quarterly"
        BIANNUALLY = "biannually", "Biannually"
        ANNUALLY = "annually", "Annually"

    name = models.CharField(
        max_length=200,
    )
    interval = models.CharField(
        max_length=50,
        choices=IntervalChoices.choices,
    )
    plan_code = models.CharField(
        max_length=100,
    )
    amount = models.DecimalField(
        verbose_name="Amount in Kobo or other subunit",
        help_text=(
            "Amount to be paid within each interval, in kobo (or other subunit),"
            " according to Paystack's standard approach."
        ),
        max_digits=19,
        decimal_places=4,
    )
    amount_in_naira = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        blank=True,
        null=True,
    )
    action = models.OneToOneField(
        BillAction,
        on_delete=models.PROTECT,
        related_name="paystack_plan",
    )
    participant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        related_name="paystack_plans",
    )
    unregistered_participant = models.ForeignKey(
        BillUnregisteredParticipant,
        on_delete=models.CASCADE,
        null=True,
        related_name="paystack_plans",
    )
    complete_paystack_payload = models.JSONField(
        null=True,
        editable=False,
    )
    complete_paystack_response = models.JSONField(
        editable=False,
    )

    class Meta:
        verbose_name = "Paystack plan"
        verbose_name_plural = "Paystack plans"

    def __str__(self) -> str:
        return f"name: {self.name}, interval: {self.interval}, amount: {self.amount}"

    def clean(self):
        if self.participant is None and self.unregistered_participant is None:
            raise ValidationError(
                "Either participant or unregistered participant must be provided."
            )


class PaystackPlanFailures(AbstractTimeStampedUUIDModel, models.Model):
    """Stores data returned by Paystack when a plan creation call fails.

    These could be displayed in the UI to allow the bill creator/creditor to
    retry plan creation.
    """

    action = models.OneToOneField(
        BillAction,
        on_delete=models.PROTECT,
        related_name="paystack_plan_failure",
    )
    failure_message = models.CharField(
        max_length=150,
    )
    participant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        related_name="paystack_plan_failures",
    )
    unregistered_participant = models.ForeignKey(
        BillUnregisteredParticipant,
        on_delete=models.CASCADE,
        null=True,
        related_name="paystack_plan_failures",
    )

    class Meta:
        verbose_name = "Paystack plan failure"
        verbose_name_plural = "Paystack plan failures"

    def __str__(self) -> str:
        return (
            f" participant: {self.participant or self.unregistered_participant},"
            f" message: {self.failure_message}"
        )

    def clean(self):
        if self.participant is None and self.unregistered_participant is None:
            raise ValidationError(
                "Either participant or unregistered participant must be provided."
            )


class PaystackSubscription(AbstractTimeStampedUUIDModel, models.Model):
    """Stores data returned by Paystack to represent a subscription.

    Should not be deletable. Subscriptions should be recorded as cancelled when
    they end.
    """

    class SubscriptionChoices(models.TextChoices):
        ACTIVE = "active", "Active"
        NON_RENEWING = "non-renewing", "Non-renewing"
        ATTENTION = "attention", "Attention"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    plan = models.ForeignKey(
        PaystackPlan,
        on_delete=models.PROTECT,
        related_name="paystack_subscriptions",
    )
    participant = models.ForeignKey(
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
        on_delete=models.PROTECT,
        null=True,
        related_name="paystack_subscriptions",
        help_text=(
            "NULL means the card used for this transaction has been deleted"
            " on Halver. Check full paystack data for card details."
        ),
    )
    action = models.OneToOneField(
        BillAction,
        on_delete=models.PROTECT,
        related_name="paystack_subscription",
    )
    start_date = models.DateTimeField()
    next_payment_date = models.DateTimeField()
    complete_paystack_response = models.JSONField(
        editable=False,
    )

    class Meta:
        verbose_name = "Paystack subscription"
        verbose_name_plural = "Paystack subscriptions"

    def __str__(self) -> str:
        return (
            f"participant: {self.participant.full_name}, plan interval:"
            f" {self.plan.interval}, plan amount: {self.plan.amount}"
        )


class PaystackTransaction(AbstractTimeStampedUUIDModel, models.Model):
    """Stores data returned by Paystack after a verified card transaction."""

    class TransactionChoices(models.TextChoices):
        ONE_TIME_CONTRIBUTION = (
            "one_time_contribution",
            "One-time contribution",
        )
        SUBSCRIPTION_CONTRIBUTION = (
            "subscription_contribution",
            "Subscription contribution",
        )
        CARD_ADDITION = "card_addition", "Card addition"

    class TransactionOutcomeChoices(models.TextChoices):
        SUCCESSFUL = "successful", "Successful"
        FAILED = "failed", "Failed"

    amount = models.DecimalField(
        verbose_name="Amount in Kobo or other subunit",
        max_digits=19,
        decimal_places=4,
        help_text="Amount returned by Paystack, in Kobo (or other subunit)",
    )
    amount_in_naira = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        blank=True,
        null=True,
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
        BillAction,
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

    class Meta:
        verbose_name = "Paystack transaction"
        verbose_name_plural = "Paystack transactions"

    def __str__(self) -> str:
        return f"amount: {self.amount}, type: {self.transaction_outcome}"


class PaystackTransfer(AbstractTimeStampedUUIDModel, models.Model):
    """Stores data returned by Paystack after a verified transfer."""

    class TransferChoices(models.TextChoices):
        CREDITOR_SETTLEMENT = "creditor_settlement", "Creditor settlement"
        CARD_ADDITION_REFUND = "card_addition_refund", "Card addition refund"

    class TransferOutcomeChoices(models.TextChoices):
        SUCCESSFUL = "successful", "Successful"
        FAILED = "failed", "Failed"
        REVERSED = "reversed", "Reversed"

    amount = models.DecimalField(
        verbose_name="Amount in Kobo or other subunit",
        max_digits=19,
        decimal_places=4,
        help_text="Amount returned by Paystack, in Kobo (or other subunit)",
    )
    amount_in_naira = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        blank=True,
        null=True,
    )
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
        BillAction,
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

    class Meta:
        verbose_name = "Paystack transfer"
        verbose_name_plural = "Paystack transfers"

    def __str__(self) -> str:
        return (
            f"amount: {self.amount}, outcome: {self.transfer_outcome}"
            f" type: {self.transfer_type}"
        )
