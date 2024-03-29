from rest_framework import serializers

from bills.api.serializers import NestedCustomUserSerializer
from bills.models import BillAction
from financials.data.logos import bank_logo_index
from financials.models import PaystackTransfer, TransferRecipient, UserCard
from financials.utils.validation import validate_new_recipient_data


class UserCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCard
        fields = (
            "account_name",
            "authorization_code",
            "bank",
            "card_type",
            "created",
            "email",
            "exp_month",
            "exp_year",
            "first_6",
            "is_default",
            "last_4",
            "signature",
            "user",
            "uuid",
        )


class UserCardListSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCard
        fields = (
            "account_name",
            "bank",
            "card_type",
            "created",
            "email",
            "first_6",
            "is_default",
            "last_4",
            "uuid",
        )


class PaystackBankListSerializer(serializers.Serializer):
    id = serializers.IntegerField(
        required=False,
        allow_null=True,
    )
    name = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    slug = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    code = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    longcode = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    gateway = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    pay_with_bank = serializers.BooleanField(
        required=False,
        allow_null=True,
    )
    active = serializers.BooleanField(
        required=False,
        allow_null=True,
    )
    country = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    currency = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    type = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    is_deleted = serializers.BooleanField(
        required=False,
        allow_null=True,
    )
    createdAt = serializers.DateTimeField(
        required=False,
        allow_null=True,
    )
    updatedAt = serializers.DateTimeField(
        required=False,
        allow_null=True,
    )
    logo = serializers.URLField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )


class PaystackAccountNumberCheckSerializer(serializers.Serializer):
    account_number = serializers.CharField()
    bank_code = serializers.CharField()


class PaystackTransferRecipientListSerializer(serializers.Serializer):
    user_id = serializers.UUIDField(required=True)


class TransferRecipientListSerializer(serializers.ModelSerializer):
    recipient_type = serializers.SerializerMethodField()
    bank_logo = serializers.SerializerMethodField()

    def get_recipient_type(self, obj) -> str:
        """
        Returns the human-readable version of the recipient_type field.
        https://docs.djangoproject.com/en/dev/ref/models/instances/#django.db.models.Model.get_FOO_display

        Parameters:
            obj (TransferRecipient): An instance of the TransferRecipient model.

        Returns:
            str: A human-readable string of the recipient_type field.
        """

        return obj.get_recipient_type_display()

    def get_bank_logo(self, obj):
        if obj.recipient_type == TransferRecipient.RecipientChoices.ACCOUNT:
            bank_code = obj.bank_code
            if bank_code:
                return bank_logo_index.get(bank_code, None)

        return None

    class Meta:
        model = TransferRecipient
        fields = (
            "account_number",
            "associated_card",
            "authorization_code",
            "bank_code",
            "bank_logo",
            "bank_name",
            "created",
            "email",
            "is_default",
            "name",
            "recipient_code",
            "recipient_type",
            "uuid",
        )
        read_only = fields


class TransferRecipientCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferRecipient
        fields = (
            "account_number",
            "authorization_code",
            "bank_code",
            "email",
            "is_default",
            "name",
            "recipient_type",
        )

    def validate(self, data):
        validate_new_recipient_data(data)
        return data


class TransferRecipientUpdateDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferRecipient
        fields = (
            "is_default",
            "recipient_code",
            "uuid",
        )
        read_only = ("recipient_code", "uuid")


class FailedAndReversedPaystackTransfersActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillAction
        fields = (
            "contribution",
            "created",
            "modified",
            "status",
            "total_payment_due",
            "uuid",
        )
        read_only_fields = fields


class FailedAndReversedPaystackTransfersSerializer(serializers.ModelSerializer):
    paying_user = NestedCustomUserSerializer()
    recipient = TransferRecipientListSerializer()
    action = FailedAndReversedPaystackTransfersActionSerializer()

    class Meta:
        model = PaystackTransfer
        fields = (
            "action",
            "amount_in_naira",
            "amount",
            "created",
            "modified",
            "paying_user",
            "paystack_transfer_reference",
            "reason",
            "recipient",
            "transfer_outcome",
            "transfer_type",
            "uuid",
        )
        read_only_fields = fields


class PaystackTransferRetrySerializer(serializers.ModelSerializer):
    class Meta:
        model = PaystackTransfer
        fields = (
            "amount",
            "recipient_code",
            "reason",
            "paystack_transfer_reference",
        )
