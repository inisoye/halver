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

    def update_contributions_and_fees_for_actions(
        self, participant_contribution_index
    ) -> None:
        """
        Designed to be called from a view to add contribution amounts and resulting
        fees to actions associated with a bill.

        Args:
            participant_contribution_index:
            A dictionary mapping bill participant UUIDs (as string values) to their
            contributions (string, integer, or float values sent by the client).
            e.g participant_contribution_index = {
                    "73c9d9b7-fc01-4c01-b22c-cfa7d8f4a75a": "100.00",
                    "2d3837c1-a7e5-4fdd-b181-a4f4e7d4c9d9": 200,
                    "3c2db1bb-6e5f-4420-9c5b-79b524c9d9cd": 300.50,
                }
        """

        add_contributions_and_fees_to_actions(self, participant_contribution_index)

    def save(self, *args, **kwargs) -> None:
        with transaction.atomic():
            # Save the Bill instance
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
        return f"name: {self.name}"


class Action(AbstractTimeStampedUUIDModel, models.Model):
    class StatusChoices(models.TextChoices):
        # For all bill types.
        PENDING = "pending", "Pending"
        OVERDUE = "overdue", "Overdue"
        DECLINED = "declined", "Declined"
        PENDING_TRANSFER = "pending_transfer", "Pending Transfer"
        # For one-time bills.
        COMPLETED = "completed", "Completed"
        # For recurring bills.
        ONGOING = "ongoing", "Ongoing"
        CANCELLED = "cancelled", "Cancelled"

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
    contribution = models.DecimalField(
        verbose_name="Bill contribution of participant (excludes fees)",
        max_digits=19,
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

    def __str__(self) -> str:
        return (
            f"participant: {self.participant.last_name}, "
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
    participant = models.ForeignKey(
        User,
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
    # TODO These Paystack details should probably be inlcuded as joins.
    # Also consider adding the card used for the transaction, as well as the recipeint.
    paystack_transaction_reference = models.CharField(
        max_length=100,
        blank=True,
    )
    paystack_transfer_reference = models.CharField(
        max_length=100,
        blank=True,
    )
    # Added to make card addition transactions obvious.
    refundable = models.BooleanField(default=False)

    def __str__(self) -> str:
        return (
            f"participant: {self.participant.last_name}, payment: {self.total_payment}, "
            f"bill: ({self.bill.name})"
        )
