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
            "last4",
            "signature",
            "user",
            "created",
            "uuid",
        )


class TransferRecipientListCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100, required=True)
    type = serializers.ChoiceField(
        choices=TransferRecipient.RecipientChoices.choices,
        required=True,
    )
    account_number = serializers.CharField(
        max_length=10, allow_blank=True, required=False
    )
    bank_code = serializers.CharField(max_length=5, allow_blank=True, required=False)
    email = serializers.EmailField(allow_blank=True, required=False)
    authorization_code = serializers.CharField(
        max_length=100, allow_blank=True, required=False
    )

    def validate(self, data):
        validate_new_recipient_data(data)
        return data


class TransferRecipientDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferRecipient
        fields = ("recipient_code",)
