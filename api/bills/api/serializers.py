from django.conf import settings
from django.core.validators import MinValueValidator
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault

from accounts.models import CustomUser
from bills.models import (
    Bill,
    BillAction,
    BillArrear,
    BillTransaction,
    BillUnregisteredParticipant,
)
from bills.utils.validation import (
    validate_contributions_and_total_amount_due,
    validate_create_bill_serializer_dates,
    validate_participants_and_unregistered_participants,
    validate_participants_contribution_index,
)


class BillUnregisteredParticipantListSerializer(serializers.ModelSerializer):
    phone = PhoneNumberField(required=True)

    class Meta:
        model = BillUnregisteredParticipant
        fields = (
            "created",
            "modified",
            "name",
            "phone",
            "uuid",
        )
        read_only_fields = fields


class BillUnregisteredParticipantsDataTransferSerializer(serializers.Serializer):
    unregistered_participant_phone = PhoneNumberField(required=False)


class BillUnregisteredParticipantCreateSerializer(serializers.ModelSerializer):
    contribution = serializers.DecimalField(
        max_digits=19,
        decimal_places=4,
        coerce_to_string=False,
        allow_null=False,
        validators=[
            MinValueValidator(settings.MINIMUM_CONTRIBUTION),
        ],
    )
    phone = PhoneNumberField(required=True)

    class Meta:
        model = BillUnregisteredParticipant
        fields = (
            "contribution",
            "created",
            "modified",
            "name",
            "phone",
            "uuid",
        )
        read_only_fields = (
            "created",
            "modified",
            "uuid",
        )


class BillCreateSerializer(serializers.ModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(
        default=serializers.CreateOnlyDefault(CurrentUserDefault()),
        read_only=True,
    )
    creditor_id = serializers.UUIDField(
        write_only=True,
        required=True,
    )
    participants_contribution_index = serializers.DictField(
        required=False,
        child=serializers.DecimalField(
            max_digits=19,
            decimal_places=4,
            coerce_to_string=False,
            allow_null=False,
            validators=[
                MinValueValidator(settings.MINIMUM_CONTRIBUTION),
            ],
        ),
    )
    unregistered_participants = BillUnregisteredParticipantCreateSerializer(
        many=True, required=False
    )

    def validate(self, data):
        validate_create_bill_serializer_dates(data)
        validate_participants_contribution_index(data)
        validate_contributions_and_total_amount_due(data)
        validate_participants_and_unregistered_participants(self, data)
        return data

    class Meta:
        model = Bill
        fields = (
            "created",
            "creator",
            "creditor_id",
            "currency_code",
            "currency_name",
            "currency_symbol",
            "deadline",
            "evidence",
            "first_charge_date",
            "interval",
            "modified",
            "name",
            "notes",
            "participants_contribution_index",
            "total_amount_due",
            "unregistered_participants",
            "uuid",
        )
        read_only_fields = (
            "created",
            "modified",
            "uuid",
        )


class BillListSerializer(serializers.ModelSerializer):
    interval = serializers.SerializerMethodField()
    is_creator = serializers.SerializerMethodField()
    is_creditor = serializers.SerializerMethodField()
    is_recurring = serializers.BooleanField()
    status_info = serializers.SerializerMethodField()
    total_participants = serializers.IntegerField()

    def get_interval(self, obj) -> str:
        """Returns the human-readable version of the interval field.

        https://docs.djangoproject.com/en/dev/ref/models/instances/#django.db.models.Model.get_FOO_display.

        Parameters:
            obj (Bill): An instance of the Bill model.

        Returns:
            str: A human-readable string of the interval field.
        """

        return obj.get_interval_display()

    def get_is_creator(self, obj) -> bool:
        return obj.creator == self.context["request"].user

    def get_is_creditor(self, obj) -> bool:
        return obj.creditor == self.context["request"].user

    def get_status_info(self, obj):
        return {
            "most_common_status": obj.most_common_status,
            "most_common_status_count": obj.most_common_status_count,
            "are_all_statuses_same": obj.are_all_statuses_same,
        }

    class Meta:
        model = Bill
        fields = (
            "created",
            "interval",
            "is_creator",
            "is_creditor",
            "is_recurring",
            "modified",
            "name",
            "status_info",
            "total_participants",
            "uuid",
        )
        read_only_fields = fields


# --------------------------------------------------------------
# Serializers nested inside BillDetailSerializer start.
# --------------------------------------------------------------


class BillCreatorCreditorParticipantSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = (
            "date_joined",
            "email",
            "first_name",
            "full_name",
            "last_name",
            "profile_image_url",
            "profile_image_hash",
            "username",
            "uuid",
        )
        read_only_fields = fields


class BillDetailUnregisteredParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillUnregisteredParticipant
        fields = (
            "created",
            "modified",
            "name",
            "phone",
            "uuid",
        )
        read_only_fields = fields


class BillDetailActionSerializer(serializers.ModelSerializer):
    participant = BillCreatorCreditorParticipantSerializer()
    unregistered_participant = BillDetailUnregisteredParticipantSerializer()

    class Meta:
        model = BillAction
        fields = (
            "contribution",
            "created",
            "modified",
            "participant",
            "status",
            "total_payment_due",
            "unregistered_participant",
            "uuid",
        )
        read_only_fields = fields


# --------------------------------------------------------------
# Serializers nested inside BillDetailSerializer end.
# --------------------------------------------------------------


class BillDetailSerializer(serializers.ModelSerializer):
    actions = BillDetailActionSerializer(many=True)
    creator = BillCreatorCreditorParticipantSerializer()
    creditor = BillCreatorCreditorParticipantSerializer()
    interval = serializers.SerializerMethodField()
    is_creator = serializers.SerializerMethodField()
    is_creditor = serializers.SerializerMethodField()
    is_recurring = serializers.BooleanField()
    status = serializers.DictField()
    total_amount_paid = serializers.DecimalField(
        help_text="Total amount already paid",
        max_digits=19,
        decimal_places=4,
        default=0,
    )
    total_participants = serializers.IntegerField()

    # TODO The requester's action and the subscription tied to it should be returned
    # here as well.

    def get_interval(self, obj) -> str:
        """Returns the human-readable version of the interval field.

        https://docs.djangoproject.com/en/dev/ref/models/instances/#django.db.models.Model.get_FOO_display.

        Parameters:
            obj (Bill): An instance of the Bill model.

        Returns:
            str: A human-readable string of the interval field.
        """

        return obj.get_interval_display()

    def get_is_creditor(self, obj) -> bool:
        return obj.creditor == self.context["request"].user

    def get_is_creator(self, obj) -> bool:
        return obj.creator == self.context["request"].user

    class Meta:
        model = Bill
        fields = (
            "actions",
            "created",
            "creator",
            "creditor",
            "currency_code",
            "currency_name",
            "currency_symbol",
            "deadline",
            "evidence",
            "first_charge_date",
            "interval",
            "is_creator",
            "is_creditor",
            "is_discreet",
            "is_recurring",
            "modified",
            "name",
            "notes",
            "status",
            "total_amount_due",
            "total_amount_paid",
            "total_participants",
            "uuid",
        )
        read_only_fields = fields


class BillDetailsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = ("name", "notes", "evidence", "is_discreet", "deadline")
        extra_kwargs = {
            "name": {"required": False},
            "notes": {"required": False},
            "evidence": {"required": False},
            "is_discreet": {"required": False},
            "deadline": {"required": False},
        }


class BillActionResponseUpdateSerializer(serializers.ModelSerializer):
    has_participant_agreed = serializers.BooleanField(read_only=True)

    class Meta:
        model = BillAction
        fields = ("has_participant_agreed",)


class BillArrearResponseUpdateSerializer(serializers.ModelSerializer):
    is_forgiveness = serializers.BooleanField(read_only=True, default=False)

    class Meta:
        model = BillArrear
        fields = ("is_forgiveness",)


class BillArrearListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillArrear
        fields = (
            "contribution",
            "created",
            "modified",
            "participant",
            "status",
            "total_payment_due",
            "uuid",
        )
        read_only_fields = fields


class BillTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillTransaction
        fields = (
            "contribution",
            "created",
            "modified",
            "total_payment",
            "transaction_type",
            "uuid",
        )
        read_only_fields = fields
