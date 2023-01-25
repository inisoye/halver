from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault

from bills.models import Bill
from bills.utils.validation import validate_bill_serializer_dates


class BillSerializer(serializers.ModelSerializer):
    creator = serializers.HiddenField(default=CurrentUserDefault(), read_only=True)

    def validate(self, data):
        validate_bill_serializer_dates(self)
        return data

    class Meta:
        model = Bill
        fields = (
            "creator",
            "creditor",
            "participants",
            "name",
            "first_charge_date",
            "next_charge_date",
            "deadline",
            "evidence",
            "interval",
            "notes",
            "total_amount_due",
            "total_amount_paid",
            "currency_name",
            "currency_symbol",
            "currency_code",
            "created",
            "modified",
            "uuid",
        )
        read_only_fields = (
            "created",
            "modified",
            "uuid",
        )
