import datetime

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models, transaction

from core.utils import TimeStampedUUIDModel

User = settings.AUTH_USER_MODEL


class Bill(TimeStampedUUIDModel):
    """
    Stores a particular user's bill.
    """

    class RepeatChoices(models.TextChoices):
        DAILY = "daily", "Daily"
        MONTHLY = "monthly", "Monthly"
        YEARLY = "yearly", "Yearly"
        NONE = "none", "None"

    creator = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="bills_created",
    )
    collector = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="bills_collected",
    )
    participants = models.ManyToManyField(
        User,
        related_name="bills",
        through="BillParticipant",
    )

    name = models.CharField(max_length=100)
    bill_date = models.DateTimeField()
    due_date = models.DateTimeField()
    evidence = models.FileField(blank=True)
    notes = models.TextField(blank=True)

    total_amount_due = models.DecimalField(
        verbose_name="Total amount to be paid",
        max_digits=7,
        decimal_places=2,
    )
    total_amount_paid = models.DecimalField(
        verbose_name="Total amount already paid",
        max_digits=7,
        decimal_places=2,
        default=0,
    )

    def __str__(self) -> str:
        return f"{self.creator.last_name}"

    def clean(self):
        if self.due_date < datetime.date.today():
            raise ValidationError(
                "The due date of a bill cannot be in the past.",
                " Use the bill date field instead.",
            )

    def create_bill_participants_and_actions_for_bill(self) -> None:
        for participant in self.participants.all():
            bill_participant, created = BillParticipant.objects.get_or_create(
                bill=self, user=participant
            )

            Action.objects.create(
                bill=self,
                user=participant,
                bill_participant=bill_participant,
                amount_due=bill_participant.amount_owed,
            )

    def save(self, *args, **kwargs):
        with transaction.atomic():
            # Save the Bill instance
            super().save(*args, **kwargs)

            if self.pk is None:
                self.create_bill_participants_and_actions_for_bill()


class BillParticipant(models.Model):
    class StatusChoices(models.TextChoices):
        PENDING = "pending", "Pending"
        OVERDUE = "overdue", "Overdue"
        SETTLED = "settled", "Settled"
        DECLINED = "declined", "Declined"

    bill = models.ForeignKey(
        Bill,
        on_delete=models.CASCADE,
        related_name="bill_participants",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="bill_participant_profiles",
    )
    amount_owed = models.DecimalField(
        max_digits=7,
        decimal_places=2,
    )
    status = models.CharField(
        max_length=10,
        choices=StatusChoices.choices,
        default="pending",
    )


class Transaction(TimeStampedUUIDModel):
    """
    Stores a transaction particular completed by a user. This is usually only
    populated when a payment has gone through without any issues.
    That is, a paystack transaction (card payment) and paystack transfer to the
    creditor, must have been successful for a transaction to be recorded here
    """

    class StatusChoices(models.TextChoices):
        SETTLED = "settled", "Settled"
        DECLINED = "declined", "Declined"

    bill = models.ForeignKey(
        Bill,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    bill_participant = models.ForeignKey(
        BillParticipant,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    amount_paid = models.DecimalField(
        max_digits=7,
        decimal_places=2,
    )
    status = models.CharField(
        max_length=10,
        choices=StatusChoices.choices,
    )
    # TODO These Paystack details should probably be inlcuded as joins.
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


class Action(TimeStampedUUIDModel):
    class StatusChoices(models.TextChoices):
        PENDING = "pending", "Pending"
        OVERDUE = "overdue", "Overdue"

    bill = models.ForeignKey(
        Bill,
        on_delete=models.CASCADE,
        related_name="actions",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="actions",
    )
    bill_participant = models.ForeignKey(
        BillParticipant,
        on_delete=models.CASCADE,
        related_name="actions",
    )
    amount_due = models.DecimalField(
        max_digits=7,
        decimal_places=2,
    )
    status = models.CharField(
        max_length=10,
        choices=StatusChoices.choices,
        default="pending",
    )
