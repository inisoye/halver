from rest_framework import serializers

from ..models import TransferRecipient, UserCard


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
            "is_default",
            "last4",
            "signature",
            "user",
            "uuid",
        )
        exclude = ("id",)


class TransferRecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferRecipient
        fields = (
            "created",
            "is_default",
            "recipient_code",
            "recipient_type",
            "user",
            "uuid",
        )
        exclude = ("id",)
