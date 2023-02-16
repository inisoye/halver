from django.conf import settings
from django.db import models, transaction
from phonenumber_field.modelfields import PhoneNumberField

from bills.utils.bills import (
    add_participant_contributions_and_fees_to_actions,
    create_actions_for_bill,
    create_bill,
)
from core.models import AbstractCurrencyModel, AbstractTimeStampedUUIDModel
from core.utils.dates_and_time import get_one_week_from_now, validate_date_not_in_past


class Bill(AbstractTimeStampedUUIDModel, AbstractCurrencyModel, models.Model):
    """Stores a particular user's bill.

    Should not be deletable. All bill actions should be marked as cancelled when
    a bill is cancelled instead. Subscriptions should also be ended.
    """

    # ! All user's "bills_created", actions and paystack subscriptions should be
    # ! cancelled when a user deletes their account.

    class IntervalChoices(models.TextChoices):
        DAILY = "daily", "Daily"
        WEEKLY = "weekly", "Weekly"
        MONTHLY = "monthly", "Monthly"
        BIANNUALLY = "biannually", "Biannually"
        ANNUALLY = "annually", "Annually"
        NONE = "none", "None"

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="bills_created",
    )
    creditor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="bills_collected",
    )
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="bills",
    )
    name = models.CharField(
        max_length=100,
    )
    first_charge_date = models.DateTimeField(
        blank=True,
        null=True,
        default=get_one_week_from_now,
    )
    next_charge_date = models.DateTimeField(
        blank=True,
        null=True,
    )
    deadline = models.DateTimeField(
        blank=True,
        null=True,
    )
    evidence = models.FileField(
        blank=True,
        null=True,
    )
    interval = models.CharField(
        max_length=50,
        choices=IntervalChoices.choices,
        default="none",
    )
    notes = models.TextField(
        blank=True,
        null=True,
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
    is_discreet = models.BooleanField(
        verbose_name=(
            "Are transactions and actions hidden from non-creditor, non-creator"
            " participants"
        ),
        default=False,
    )

    @property
    def is_recurring(self) -> bool:
        return self.interval != "none"

    def save(self, *args, **kwargs) -> None:
        with transaction.atomic():
            super().save(*args, **kwargs)

            if self.pk is None:
                create_actions_for_bill(self)

    def clean(self) -> None:
        self._validate_dates()

    def __str__(self) -> str:
        return f"name: {self.name}, creator: {self.creator.full_name}"

    def _validate_dates(self) -> None:
        validate_date_not_in_past(self.deadline, "Deadline")

        if self.is_recurring:
            validate_date_not_in_past(self.first_charge_date, "First Charge Date")
            validate_date_not_in_past(self.next_charge_date, "Next Charge Date")

    @classmethod
    def create_bill_from_validated_data(cls, validated_data):
        """Called from view to create a new bill with actions.

        Args:
            validated_data (dict): The validated data obtained from the serializer
            to be used in the creation of the bill
        """

        new_bill = create_bill(cls, validated_data)

        return new_bill

    def update_contributions_and_fees_for_actions(
        self, participant_contribution_index
    ) -> None:
        """Called after bill creation. Adds contribution amounts and fees to
        bill actions.

        Args:
            participant_contribution_index: Dictionary connecting participant uuids with
            contributions.
        """

        add_participant_contributions_and_fees_to_actions(
            self, participant_contribution_index
        )

    def get_total_participants(self):
        return self.participants.count() + self.unregistered_participants.count()

    def get_actions_counts(self):
        """Returns the count of actions for each status on this bill.

        Returns:
            A dictionary mapping all the statuses of the bill's actions to their
            frequency.
        """
        actions = self.actions.all()
        counts = (
            actions.values("status")
            .annotate(count=models.Count("status"))
            .order_by("-count")
        )
        return {item["status"]: item["count"] for item in counts}

    def get_bill_status(self):
        """Returns a human-readable string describing the status of the bill.

        Returns:
            A string describing the status of the bill.
        """

        # TODO There should be a get long status and get short status.
        # Both different fields to be sent over the API. The former for display and the
        # latter for color coding

        status_counts = self.get_actions_counts()
        total_statuses_count = sum(status_counts.values())

        most_common_status = max(status_counts, key=status_counts.get)
        most_common_status_count = status_counts[most_common_status]

        all_actions_are_one_type = most_common_status_count == total_statuses_count

        bill_status_message_prefix = (
            "All" if all_actions_are_one_type else f"{most_common_status_count}"
        )

        # Map status codes to messages
        status_message_index = {
            BillAction.StatusChoices.PENDING_TRANSFER: (
                f"{bill_status_message_prefix} transfers pending"
            ),
            BillAction.StatusChoices.OVERDUE: (
                f"{bill_status_message_prefix} payments overdue"
            ),
            BillAction.StatusChoices.CANCELLED: "Bill cancelled"
            if all_actions_are_one_type
            else f"{bill_status_message_prefix} opted out",
            BillAction.StatusChoices.COMPLETED: (
                f"{bill_status_message_prefix} payments completed"
            ),
            BillAction.StatusChoices.ONGOING: (
                f"{bill_status_message_prefix} subscriptions ongoing"
            ),
            BillAction.StatusChoices.DECLINED: (
                f"{bill_status_message_prefix} opted out"
            ),
            BillAction.StatusChoices.PENDING: (
                f"{bill_status_message_prefix} yet to accept"
            ),
            BillAction.StatusChoices.UNREGISTERED: (
                f"{bill_status_message_prefix} participants unregistered"
            ),
        }

        # Return the message for the most common status
        return status_message_index.get(most_common_status, "")


class BillUnregisteredParticipant(AbstractTimeStampedUUIDModel, models.Model):
    name = models.CharField(
        max_length=100,
    )
    bill = models.ForeignKey(
        Bill,
        on_delete=models.CASCADE,
        related_name="unregistered_participants",
    )
    phone = PhoneNumberField(
        unique=True,
        error_messages={
            "unique": "Duplicate phone numbers are not allowed.",
        },
    )
    email = models.EmailField(
        null=True,
        blank=True,
    )
    contribution = models.DecimalField(
        verbose_name="Bill contribution of unregistered participant",
        max_digits=19,
        decimal_places=4,
    )

    def __str__(self) -> str:
        return f"name: {self.name}"


class BillAction(AbstractTimeStampedUUIDModel, models.Model):
    """Actions broadly represent a snapshot of a user's standing in a bill.

    The model is also joined with the Plan and Subscription for recurring bills.
    """

    class StatusChoices(models.TextChoices):
        # For all bill types.
        UNREGISTERED = "unregistered", "Unregistered"
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
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        related_name="actions",
    )
    unregistered_participant = models.ForeignKey(
        BillUnregisteredParticipant,
        on_delete=models.CASCADE,
        null=True,
        related_name="actions",
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
    total_payment_due = models.DecimalField(
        verbose_name=(
            "Summation of contribution and total fees. Actual amount to be paid"
        ),
        max_digits=19,
        decimal_places=4,
        null=True,
    )

    def __str__(self) -> str:
        return (
            f"participant: {self.participant or self.unregistered_participant},"
            f" contribution: {self.contribution}, bill: ({self.bill.name})"
        )


class BillTransaction(AbstractTimeStampedUUIDModel, models.Model):
    """Stores a transaction particular completed by a user.

    This is usually only populated when a payment has gone through without any
    issues. That is, a paystack transaction (card payment) and paystack transfer
    to the creditor, must have been successful for a transaction to be recorded
    here
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
