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
