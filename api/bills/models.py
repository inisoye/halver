import datetime

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models, transaction

from bills.utils.bills import (
    add_contributions_and_fees_to_actions,
    create_actions_for_bill,
)
from core.models import AbstractCurrencyModel, AbstractTimeStampedUUIDModel

User = settings.AUTH_USER_MODEL


class Bill(AbstractTimeStampedUUIDModel, AbstractCurrencyModel, models.Model):
    """
    Stores a particular user's bill.

    Should not be deletable. All bill actions should be marked as cancelled when a
    bill is cancelled instead. Subscriptions should also be ended.

    ! All user's "bills_created", actions and paystack subscriptions should be cancelled.
    ! when a user deletes their account.
    """

    class IntervalChoices(models.TextChoices):
        DAILY = "daily", "Daily"
        WEEKLY = "weekly", "Weekly"
        MONTHLY = "monthly", "Monthly"
        BIANNUALLY = "biannually", "Biannually"
        ANNUALLY = "annually", "Annually"
        NONE = "none", "None"

    creator = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="bills_created",
    )
    creditor = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="bills_collected",
    )
    participants = models.ManyToManyField(
        User,
        related_name="bills",
    )
    name = models.CharField(
        max_length=100,
    )
    bill_date = models.DateTimeField()
    deadline = models.DateTimeField()
    evidence = models.FileField(
        blank=True,
    )
    interval = models.CharField(
        max_length=50,
        choices=IntervalChoices.choices,
        default="none",
    )
    notes = models.TextField(
        blank=True,
    )
    total_amount_due = models.DecimalField(
        verbose_name="Total amount to be paid",
        max_digits=19,
        decimal_places=4,
    )
    total_amount_paid = models.DecimalField(
        verbose_name="Total amount already paid",
        max_digits=19,
        decimal_places=4,
        default=0,
    )

    @property
    def is_recurring(self) -> bool:
        return self.interval != "none"

    def update_contributions_and_fees_for_actions(
        self, participant_contribution_index
    ) -> None:
        """
        Designed to be called from a view to add contribution amounts and resulting
        fees to actions associated with a bill.

        Args:
            participant_contribution_index:
            A dictionary mapping bill participant UUIDs to their contributions.
        """

        add_contributions_and_fees_to_actions(self, participant_contribution_index)

    def save(self, *args, **kwargs) -> None:
        with transaction.atomic():
            super().save(*args, **kwargs)

            # Create actions and bill participant objects for every new bill
            if self.pk is None:
                create_actions_for_bill(self)

    def clean(self) -> None:
        if self.deadline < datetime.date.today():
            raise ValidationError(
                "The deadline of a bill cannot be in the past.",
                " Use the bill date field instead.",
            )

    def __str__(self) -> str:
        return f"name: {self.name}, creator: {self.creator.full_name}"


class Action(AbstractTimeStampedUUIDModel, models.Model):
    """
    Actions broadly represent a snapshot of a user's standing in a bill.
    They represent pending actions for users that have not agreed to join a bill.
    The model is also joined with the Plan and Subscription for recurring bills.
    """

    class StatusChoices(models.TextChoices):
        # For all bill types.
        PENDING = "pending", "Pending"
        OVERDUE = "overdue", "Overdue"
        DECLINED = "declined", "Declined"
        PENDING_TRANSFER = "pending_transfer", "Pending Transfer"
        CANCELLED = "cancelled", "Cancelled"
        # For one-time bills.
        COMPLETED = "completed", "Completed"
        # For recurring bills.
        ONGOING = "ongoing", "Ongoing"

    bill = models.ForeignKey(
        Bill,
        on_delete=models.CASCADE,
        related_name="actions",
    )
    participant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="actions",
    )
    paystack_plan = models.ForeignKey(
        "financials.PaystackPlan",
        on_delete=models.PROTECT,
        null=True,
        related_name="actions",
    )
    paystack_subscription = models.OneToOneField(
        "financials.PaystackSubscription",
        on_delete=models.PROTECT,
        null=True,
        related_name="paystack_subscription",
    )
    contribution = models.DecimalField(
        verbose_name="Bill contribution of participant (excludes fees)",
        max_digits=19,
        null=True,
        decimal_places=4,
    )
    status = models.CharField(
        max_length=50,
        choices=StatusChoices.choices,
        default="pending",
    )
    paystack_transaction_fee = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        null=True,
    )
    paystack_transfer_fee = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        null=True,
    )
    halver_fee = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        null=True,
    )
    total_fee = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        null=True,
    )

    def __str__(self) -> str:
        return (
            f"participant: {self.participant.full_name}, "
            f"contribution: {self.contribution}, bill: ({self.bill.name})"
        )


class Transaction(AbstractTimeStampedUUIDModel, models.Model):
    """
    Stores a transaction particular completed by a user. This is usually only
    populated when a payment has gone through without any issues.
    That is, a paystack transaction (card payment) and paystack transfer to the
    creditor, must have been successful for a transaction to be recorded here
    """

    bill = models.ForeignKey(
        Bill,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    contribution = models.DecimalField(
        verbose_name="Bill contribution of participant (excludes fees)",
        max_digits=19,
        decimal_places=4,
    )
    total_payment = models.DecimalField(
        verbose_name="Total amount paid (includes fees)",
        max_digits=19,
        decimal_places=4,
    )
    paystack_transaction_fee = models.DecimalField(
        max_digits=19,
        decimal_places=4,
    )
    paystack_transfer_fee = models.DecimalField(
        max_digits=19,
        decimal_places=4,
    )
    halver_fee = models.DecimalField(
        max_digits=19,
        decimal_places=4,
    )
    total_fee = models.DecimalField(
        max_digits=19,
        decimal_places=4,
    )
    paystack_transaction = models.OneToOneField(
        "financials.PaystackTransaction",
        on_delete=models.PROTECT,
        related_name="halver_transaction",
    )
    paystack_transfer = models.OneToOneField(
        "financials.PaystackTransfer",
        on_delete=models.PROTECT,
        related_name="halver_transaction",
    )

    def __str__(self) -> str:
        return (
            f"payer: {self.paystack_transaction.paying_user}, "
            f"receiver: {self.paystack_transfer.receiving_user}, "
            f"payment: {self.total_payment}, bill: ({self.bill.name})"
        )
