from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

from bills.utils.bills import create_bill, generate_long_status_index
from core.models import AbstractCurrencyModel, AbstractTimeStampedUUIDModel
from core.utils.dates_and_time import (
    get_one_week_from_now,
    validate_date_is_at_least_one_week_into_future,
    validate_date_not_in_past,
)


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
        QUARTERLY = "quarterly", "Quarterly"
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
    unregistered_participants = models.ManyToManyField(
        "BillUnregisteredParticipant",
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
        help_text="Total amount to be paid",
        max_digits=19,
        decimal_places=4,
    )
    total_amount_paid = models.DecimalField(
        help_text="Total amount already paid",
        max_digits=19,
        decimal_places=4,
        default=0,
    )
    is_discreet = models.BooleanField(
        help_text=(
            "Are transactions and actions hidden from non-creditor, non-creator"
            " participants"
        ),
        default=False,
    )

    class Meta:
        verbose_name = "Bill"
        verbose_name_plural = "Bills"

    def __str__(self) -> str:
        return f"name: {self.name}, creator: {self.creator.full_name}"

    def clean(self) -> None:
        super().clean()
        self._validate_dates()

        if self.pk is None:
            validate_date_is_at_least_one_week_into_future(
                self.first_charge_date,
                "First Charge Date",
                use_day_start=True,
            )

    @property
    def is_recurring(self) -> bool:
        return self.interval != "none"

    def _validate_dates(self) -> None:
        validate_date_not_in_past(self.deadline, "Deadline")

        if self.is_recurring:
            validate_date_not_in_past(self.first_charge_date, "First Charge Date")
            validate_date_not_in_past(self.next_charge_date, "Next Charge Date")

    def _validate_amounts(self) -> None:
        if self.total_amount_due <= 0:
            raise ValidationError(
                "The total amount due must be a postive nonzero value."
            )

    @classmethod
    def create_bill_from_validated_data(cls, validated_data, creator):
        """Called from view to create a new bill with actions.

        Args:
            validated_data (dict): The validated data obtained from the serializer
            to be used in the creation of the bill
        """

        new_bill = create_bill(cls, validated_data, creator)
        return new_bill

    def get_total_participants(self):
        return self.participants.count() + self.unregistered_participants.count()

    def get_most_common_status_details(self):
        """Returns the most common status and its frequency, as well as a flag
        indicating whether all actions are of the same status.

        Returns:
            A tuple of (most_common_status: str, most_common_status_count: int,
                all_actions_are_one_type: bool)
            most_common_status: The status code that appears most frequently among
                the bill's actions.
            most_common_status_count: The number of times that most_common_status
                appears among the bill's actions.
            all_actions_are_one_type: A flag indicating whether all actions in the bill
                have the same status code.
        """

        actions = self.actions.all()
        counts = (
            actions.values("status")
            .annotate(count=models.Count("status"))
            .order_by("-count")
        )

        action_counts_index = {item["status"]: item["count"] for item in counts}
        total_statuses_count = sum(action_counts_index.values())

        most_common_status = max(action_counts_index, key=action_counts_index.get)
        most_common_status_count = action_counts_index[most_common_status]

        all_actions_are_one_type: bool = (
            most_common_status_count == total_statuses_count
        )

        return (
            most_common_status,
            most_common_status_count,
            all_actions_are_one_type,
        )

    def get_short_bill_status(self):
        """Returns the most common status of the bill.

        Short status would enable easy color coding on the client.

        Returns:
            A string representing the most common status of the bill.
        """

        most_common_status_details = self.get_most_common_status_details()
        return most_common_status_details[0]

    def get_long_bill_status(self):
        """Returns a human-readable string describing the status of the bill.

        Returns:
            A string describing the status of the bill.
        """

        (
            most_common_status,
            most_common_status_count,
            all_actions_are_one_type,
        ) = self.get_most_common_status_details()

        status_message_index = generate_long_status_index(
            all_actions_are_one_type, most_common_status_count
        )

        # Return the message for the most common status
        return status_message_index.get(most_common_status, "")


class BillUnregisteredParticipant(AbstractTimeStampedUUIDModel, models.Model):
    name = models.CharField(
        max_length=100,
    )
    phone = PhoneNumberField(
        unique=True,
        error_messages={
            "unique": "A user with that phone number already exists.",
        },
    )

    class Meta:
        verbose_name = "Bill unregistered participant"
        verbose_name_plural = "Bill unregistered participants"

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
        OPTED_OUT = "opted_out", "Opted out"
        PENDING_TRANSFER = "pending_transfer", "Pending transfer"
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
        help_text="Bill contribution of participant (excludes fees)",
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
        help_text="Summation of contribution and total fees. Actual amount to be paid",
        max_digits=19,
        decimal_places=4,
        null=True,
    )

    class Meta:
        verbose_name = "Bill action"
        verbose_name_plural = "Bill actions"

    def __str__(self) -> str:
        return (
            f"participant: {self.participant or self.unregistered_participant},"
            f" contribution: {self.contribution}, bill: ({self.bill.name})"
        )

    def clean(self):
        super().clean()
        self._validate_contribution()

    def _validate_contribution(self) -> None:
        if not self.contribution or self.contribution <= 0:
            raise ValidationError("Actions must have a positive, nonzero contribution.")


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
        help_text="Bill contribution of participant (excludes fees)",
        max_digits=19,
        decimal_places=4,
    )
    total_payment = models.DecimalField(
        help_text="Total amount paid (includes fees)",
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

    class Meta:
        verbose_name = "Bill transaction"
        verbose_name_plural = "Bill transactions"

    def __str__(self) -> str:
        return (
            f"payer: {self.paystack_transaction.paying_user}, "
            f"receiver: {self.paystack_transfer.receiving_user}, "
            f"payment: {self.total_payment}, bill: ({self.bill.name})"
        )
