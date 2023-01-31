from rest_framework import serializers

from financials.models import TransferRecipient, UserCard
from financials.utils.validation import validate_new_recipient_data


class UserCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCard
        fields = (
            "account_name",
            "authorization_code",
            "bank",
            "card_type",
            "email",
            "exp_month",
            "exp_year",
            "is_default",
            "last_4",
            "signature",
            "user",
            "created",
            "uuid",
        )


class PaystackTransferRecipientListSerializer(serializers.Serializer):
    user_id = serializers.UUIDField(required=True)


class TransferRecipientListSerializer(serializers.ModelSerializer):
    recipient_type = serializers.SerializerMethodField()

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

    class Meta:
        model = TransferRecipient
        fields = (
            "is_default",
            "recipient_code",
            "recipient_type",
            "name",
            "account_number",
            "bank_code",
            "bank_name",
            "email",
            "authorization_code",
            "associated_card",
            "created",
            "uuid",
        )

        read_only = "__all__"


class TransferRecipientCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferRecipient
        fields = (
            "is_default",
            "recipient_type",
            "name",
            "account_number",
            "bank_code",
            "email",
            "authorization_code",
        )

    def validate(self, data):
        validate_new_recipient_data(data)
        return data


class TransferRecipientUpdateDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferRecipient
        fields = (
            "recipient_code",
            "uuid",
            "is_default",
        )
        read_only = ("recipient_code", "uuid")
