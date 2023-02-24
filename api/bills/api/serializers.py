from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault

from bills.models import Bill, BillUnregisteredParticipant
from bills.utils.validation import (
    validate_bill_serializer_dates,
    validate_participant_contribution_index,
    validate_participants_and_unregistered_participants,
)


class BillUnregisteredParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillUnregisteredParticipant
        fields = (
            "name",
            "phone",
            "email",
            "contribution",
            "created",
            "modified",
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
    creditor_id = serializers.UUIDField(write_only=True)
    participants_ids = serializers.ListField(
        child=serializers.UUIDField(), write_only=True
    )
    unregistered_participants = BillUnregisteredParticipantSerializer(many=True)
    participant_contribution_index = serializers.DictField(required=True)

    def validate(self, data):
        validate_bill_serializer_dates(self)
        validate_participant_contribution_index(data)
        validate_participants_and_unregistered_participants(self, data)
        return data

    class Meta:
        model = Bill
        fields = (
            "creator",
            "creditor_id",
            "participants_ids",
            "unregistered_participants",
            "name",
            "first_charge_date",
            "next_charge_date",
            "deadline",
            "evidence",
            "interval",
            "notes",
            "total_amount_due",
            "currency_name",
            "currency_symbol",
            "currency_code",
            "created",
            "modified",
            "uuid",
            "participant_contribution_index",
        )
        read_only_fields = (
            "created",
            "modified",
            "uuid",
        )


class BillListSerializer(serializers.ModelSerializer):
    interval = serializers.SerializerMethodField()
    is_recurring = serializers.BooleanField()
    total_participants = serializers.IntegerField(source="get_total_participants")
    short_status = serializers.CharField(source="get_short_bill_status")
    long_status = serializers.CharField(source="get_long_bill_status")

    def get_interval(self, obj) -> str:
        """Returns the human-readable version of the interval field.

        https://docs.djangoproject.com/en/dev/ref/models/instances/#django.db.models.Model.get_FOO_display.

        Parameters:
            obj (Bill): An instance of the Bill model.

        Returns:
            str: A human-readable string of the interval field.
        """

        return obj.get_interval_display()

    class Meta:
        model = Bill
        fields = (
            "participants",
            "unregistered_participants",
            "name",
            "interval",
            "total_participants",
            "short_status",
            "long_status",
            "is_recurring",
        )
        read_only = fields


class BillDetailSerializer(serializers.ModelSerializer):
    interval = serializers.SerializerMethodField()
    is_recurring = serializers.BooleanField()
    total_participants = serializers.IntegerField(source="get_total_participants")
    short_status = serializers.CharField(source="get_short_bill_status")
    long_status = serializers.CharField(source="get_long_bill_status")

    def get_interval(self, obj) -> str:
        """Returns the human-readable version of the interval field.

        https://docs.djangoproject.com/en/dev/ref/models/instances/#django.db.models.Model.get_FOO_display.

        Parameters:
            obj (Bill): An instance of the Bill model.

        Returns:
            str: A human-readable string of the interval field.
        """

        return obj.get_interval_display()

    class Meta:
        model = Bill
        fields = (
            "creator",
            "creditor",
            "deadline",
            "evidence",
            "first_charge_date",
            "interval",
            "is_discreet",
            "long_status",
            "name",
            "next_charge_date",
            "notes",
            "participants",
            "short_status",
            "total_amount_due",
            "total_amount_paid",
            "total_participants",
            "unregistered_participants",
            "created",
            "modified",
            "uuid",
            "is_recurring",
            "actions",
            "transactions",
        )

        read_only = fields


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
