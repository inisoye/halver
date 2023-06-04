from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Count, Exists, OuterRef, Prefetch, Q, Subquery
from phonenumber_field.modelfields import PhoneNumberField

from accounts.models import CustomUser
from bills.utils.bills import create_bill, generate_long_status_index
from core.models import AbstractCurrencyModel, AbstractTimeStampedUUIDModel
from core.utils.dates_and_time import validate_date_not_in_past


class Bill(AbstractTimeStampedUUIDModel, AbstractCurrencyModel, models.Model):
    """Stores a particular user's bill.

    Should not be deletable. All bill actions should be marked as cancelled when
    a bill is cancelled instead. Subscriptions should also be ended.
    """

    # ! All user's "bills_created", actions and paystack subscriptions should be
    # ! cancelled when a user deletes their account.

    class IntervalChoices(models.TextChoices):
        HOURLY = "hourly", "Hourly"
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
        default=IntervalChoices.NONE,
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
    is_discreet = models.BooleanField(
        help_text=(
            "Are transactions and actions hidden from non-creditor, non-creator"
            " participants"
        ),
        default=False,
    )

    class Meta:
        indexes = [
            models.Index(fields=["uuid"]),
            models.Index(fields=["name"]),
        ]
        verbose_name = "Bill"
        verbose_name_plural = "Bills"

    def __str__(self) -> str:
        return f"name: {self.name}, creator: {self.creator.full_name}"

    def clean(self) -> None:
        super().clean()
        self._validate_dates()

    def _validate_dates(self) -> None:
        validate_date_not_in_past(self.deadline, "Deadline")

        if self.interval != "none":
            validate_date_not_in_past(self.first_charge_date, "First Charge Date")

    def _validate_amounts(self) -> None:
        if self.total_amount_due <= 0:
            raise ValidationError(
                "The total amount due must be a postive nonzero value."
            )

    @property
    def is_recurring(self) -> bool:
        return self.interval != "none"

    @property
    def total_amount_paid(self):
        """Return the total amount paid by all transactions.

        This method uses the aggregate function to sum up the contribution field of each
        completed transaction associated with a bill instance. If there are no
        transactions, it returns zero.

        For recurring bills, it should return total amount of money that has been paid
        towards a bill

        Returns:
            Decimal: The total amount paid in contribution towards bill.
        """

        result = self.transactions.aggregate(
            total_contribution=models.Sum("contribution")
        )["total_contribution"]
        return result if result else 0

    @property
    def total_participants(self):
        return self.participants.count() + self.unregistered_participants.count()

    @property
    def status(self):
        (
            most_common_status,
            most_common_status_count,
            all_actions_are_one_type,
        ) = self.get_most_common_status_details()

        status_message_index = generate_long_status_index(
            all_actions_are_one_type, most_common_status_count
        )

        return {
            "short": most_common_status,
            "long": status_message_index.get(most_common_status, ""),
        }

    @classmethod
    def create_bill_from_validated_data(cls, validated_data, creator):
        """Called from view to create a new bill with actions.

        Args:
            validated_data (dict): The validated data obtained from the serializer
            to be used in the creation of the bill
        """

        new_bill = create_bill(cls, validated_data, creator)
        return new_bill

    @classmethod
    def get_bill_with_details(cls, uuid):
        """Retrieve a bill with all relevant data joined to it.

        To be used in get bill details view. Has been customised to work with fields
        included in the serializer.

        Args:
            uuid (str): The uuid of the bill to retrieve.

        Returns:
            Bill object: A Bill object with all relevant data joined to it.
            If the bill with the given uuid does not exist, return None.
        """

        # Use Prefetch to specify custom prefetched related objects.
        # This prevents the serializer from performing n+1 queries when fetching data
        # from joined tables.

        # Define custom Prefetch objects for actions and related objects.
        action_participant_prefetch = Prefetch(
            "participant", queryset=CustomUser.objects.all()
        )
        action_unregistered_participant_prefetch = Prefetch(
            "unregistered_participant",
            queryset=BillUnregisteredParticipant.objects.all(),
        )

        actions_prefetch = Prefetch(
            "actions",
            queryset=BillAction.objects.prefetch_related(
                action_participant_prefetch, action_unregistered_participant_prefetch
            ),
        )

        try:
            # Obtain the specific bill with all relevant data joined to it
            return (
                cls.objects.select_related("creditor", "creator")
                .prefetch_related("transactions", "participants", actions_prefetch)
                .get(uuid=uuid)
            )

        except cls.DoesNotExist:
            # Handle the case where the bill with the given uuid does not exist.
            return None

    @classmethod
    def get_users_bills_with_status_info(cls, user):
        """Returns a queryset of bills related to the user with additional
        status information.

        This has been added to prevent the n+1 query. It removes the need to call
        get_most_common_status_details in the bill list serializer. The status info
        returned would be used to determine the long status on the client.

        Args:
            user: The user making the request. Usually provided by view consuming method.

        Returns:
            A queryset of Bill objects with the following annotations:
                - most_common_status: The status that occurs most frequently among
                    the bill actions.
                - most_common_status_count: The number of bill actions with the most
                    common status.
                - are_all_statuses_same: A boolean flag indicating whether all bill
                    actions have the same status or not.
        """

        bills = (
            Bill.objects.select_related("creditor", "creator")
            .prefetch_related("unregistered_participants", "participants")
            .filter(Q(participants=user) | Q(creditor=user))
        )

        status_count_subquery = (
            BillAction.objects.filter(bill=OuterRef("pk"))
            .values("status")
            .annotate(count=Count("status"))
            .order_by("-count")
        )

        bills_with_status_info = bills.annotate(
            most_common_status=Subquery(status_count_subquery.values("status")[:1]),
            most_common_status_count=Subquery(
                status_count_subquery.values("count")[:1]
            ),
            are_all_statuses_same=~Exists(status_count_subquery[1:]),
        )

        return bills_with_status_info

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

        all_actions_are_one_type = most_common_status_count == total_statuses_count

        return (
            most_common_status,
            most_common_status_count,
            all_actions_are_one_type,
        )

    def change_first_charge_date(self, new_first_charge_date):
        self.first_charge_date = new_first_charge_date
        self.save(update_fields=["first_charge_date"])


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
        indexes = [models.Index(fields=["phone"])]
        verbose_name = "Bill unregistered participant"
        verbose_name_plural = "Bill unregistered participants"

    def __str__(self) -> str:
        return f"name: {self.name}"


class BillAction(AbstractTimeStampedUUIDModel, models.Model):
    """Actions broadly represent a snapshot of a user's standing in a bill.
    It connects a participant (or unregistered participant) with the amount they
    are to pay (the contribution). Its summary denotes a participant's status as well.

    The model is also joined with the Plan and Subscription for recurring bills.
    """

    class StatusChoices(models.TextChoices):
        # For all bill types.
        UNREGISTERED = "unregistered", "Unregistered"
        PENDING = "pending", "Pending"
        OVERDUE = "overdue", "Overdue"
        OPTED_OUT = "opted_out", "Opted out"
        PENDING_TRANSFER = "pending_transfer", "Pending transfer"
        FAILED_TRANSFER = "failed_transfer", "Failed transfer"
        REVERSED_TRANSFER = "reversed_transfer", "Reversed transfer"
        CANCELLED = "cancelled", "Cancelled"
        # For one-time bills.
        COMPLETED = "completed", "Completed"
        # For recurring bills.
        ONGOING = "ongoing", "Ongoing"
        LAST_PAYMENT_FAILED = "last_payment_failed", "Last payment failed"

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
        default=StatusChoices.PENDING,
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
        indexes = [models.Index(fields=["status"])]
        verbose_name = "Bill action"
        verbose_name_plural = "Bill actions"

    def __str__(self) -> str:
        return (
            f"participant: {self.participant or self.unregistered_participant},"
            f" payment_due: {self.total_payment_due}, bill: {self.bill.name}"
        )

    def clean(self):
        super().clean()
        self._validate_contribution()

    def _validate_contribution(self) -> None:
        if not self.contribution or self.contribution <= 0:
            raise ValidationError("Actions must have a positive, nonzero contribution.")

    def _update_status(self, status):
        self.status = status
        self.save(update_fields=["status"])

    def opt_out_of_bill(self):
        """Signifies that a participant refused to participate in a bill."""

        self._update_status(self.StatusChoices.OPTED_OUT)

    def mark_as_pending_transfer(self):
        self._update_status(self.StatusChoices.PENDING_TRANSFER)

    def mark_as_failed_transfer(self):
        self._update_status(self.StatusChoices.FAILED_TRANSFER)

    def mark_as_reversed_transfer(self):
        self._update_status(self.StatusChoices.REVERSED_TRANSFER)

    def mark_as_completed(self):
        self._update_status(self.StatusChoices.COMPLETED)

    def mark_as_ongoing(self):
        self._update_status(self.StatusChoices.ONGOING)

    def mark_as_last_failed(self):
        self._update_status(self.StatusChoices.LAST_PAYMENT_FAILED)

    @classmethod
    def get_action_status_counts_for_user(cls, user_id):
        relevant_statuses = (
            cls.StatusChoices.PENDING,
            cls.StatusChoices.OVERDUE,
            cls.StatusChoices.ONGOING,
            cls.StatusChoices.PENDING_TRANSFER,
            cls.StatusChoices.LAST_PAYMENT_FAILED,
        )

        return (
            cls.objects.only("participant", "status")
            .filter(participant_id=user_id, status__in=relevant_statuses)
            .values("status")
            .annotate(count=Count("status"))
        )

    @classmethod
    def get_action_with_bills_by_status(cls, user, status):
        return (
            cls.objects.filter(
                participant=user,
                status=status,
            )
            .select_related("bill")
            .only(
                "contribution",
                "created",
                "modified",
                "status",
                "total_payment_due",
                "uuid",
                "bill__name",
                "bill__uuid",
            )
        )


class BillTransaction(AbstractTimeStampedUUIDModel, models.Model):
    """Stores a transaction particular completed by a user.

    This is usually only populated when a payment has gone through without any
    issues. That is, a paystack transaction (card payment) and paystack transfer
    to the creditor, must have been successful for a transaction to be recorded
    here
    """

    class TypeChoices(models.TextChoices):
        REGULAR = "regular", "Regular"
        ARREAR = "arrear", "Arrear"

    bill = models.ForeignKey(
        Bill,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    contribution = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        validators=[
            MinValueValidator(settings.MINIMUM_CONTRIBUTION),
        ],
        help_text="Bill contribution of the participant (excludes fees).",
    )
    paying_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="halver_transactions",
        help_text="The participant who paid.",
    )
    receiving_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="halver_transactions_recieved",
        help_text="The participant who was paid (the bill's creditor).",
    )
    transaction_type = models.CharField(
        max_length=10,
        choices=TypeChoices.choices,
        default=TypeChoices.REGULAR,
    )
    total_payment = models.DecimalField(
        max_digits=19,
        decimal_places=4,
        help_text="Total amount paid (includes fees)",
    )
    action = models.ForeignKey(
        BillAction,
        on_delete=models.PROTECT,
        related_name="halver_transactions",
    )
    arrear = models.OneToOneField(
        "BillArrear",
        on_delete=models.PROTECT,
        null=True,
        related_name="halver_transaction",
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

    @classmethod
    def get_bill_transactions_for_user(cls, user):
        """Returns a queryset containing all complete transactions by a user."""

        return cls.objects.select_related(
            "bill",
            "paying_user",
            "receiving_user",
        ).filter(
            Q(paying_user=user) | Q(receiving_user=user),
        )

    @classmethod
    def get_bill_transactions(cls, bill_uuid):
        """Returns a queryset containing all complete transactions on a
        particular bill."""

        return cls.objects.select_related(
            "bill",
            "paying_user",
            "receiving_user",
        ).filter(
            bill__uuid=bill_uuid,
        )


class BillArrear(AbstractTimeStampedUUIDModel, models.Model):
    """Arrears record payments that have been missed due to a failed payment in a
    recurring bill's billing cycle.

    They are handled as one time payments similar to how actions handle them.
    """

    class StatusChoices(models.TextChoices):
        OVERDUE = "overdue", "Overdue"
        FORGIVEN = "forgiven", "Forgiven"
        PENDING_TRANSFER = "pending_transfer", "Pending transfer"
        COMPLETED = "completed", "Completed"

    bill = models.ForeignKey(
        Bill,
        on_delete=models.CASCADE,
        related_name="arrears",
    )
    participant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        related_name="arrears",
    )
    action = models.ForeignKey(
        BillAction,
        on_delete=models.PROTECT,
        related_name="arrears",
    )
    status = models.CharField(
        max_length=50,
        choices=StatusChoices.choices,
        default=StatusChoices.OVERDUE,
    )
    contribution = models.DecimalField(
        help_text="Bill contribution of participant (excludes fees)",
        max_digits=19,
        null=True,
        decimal_places=4,
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
        indexes = [models.Index(fields=["status"])]
        verbose_name = "Bill arrear"
        verbose_name_plural = "Bill arrears"

    def __str__(self) -> str:
        return (
            f"participant: {self.participant}, payment_due: {self.total_payment_due},"
            f" bill: {self.bill.name}"
        )

    def clean(self):
        super().clean()
        self._validate_contribution()

    def _validate_contribution(self) -> None:
        if not self.contribution or self.contribution <= 0:
            raise ValidationError("Arrears must have a positive, nonzero contribution.")

    def _update_status(self, status):
        self.status = status
        self.save(update_fields=["status"])

    def mark_as_forgiven(self):
        self._update_status(self.StatusChoices.FORGIVEN)

    def mark_as_pending_transfer(self):
        self._update_status(self.StatusChoices.PENDING_TRANSFER)

    def mark_as_failed_transfer(self):
        self._update_status(self.StatusChoices.FAILED_TRANSFER)

    def mark_as_completed(self):
        self._update_status(self.StatusChoices.COMPLETED)

    @classmethod
    def get_unsettled_arrears_on_bill(cls, bill_uuid):
        unsettled_arrear_statuses = ("overdue", "pending_transfer", "failed_transfer")

        return cls.objects.select_related("participant").filter(
            bill__uuid=bill_uuid,
            status__in=unsettled_arrear_statuses,
        )
