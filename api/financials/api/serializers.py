from rest_framework import serializers

from ..models import TransferRecipient, UserCard
from ..utils import validate_new_recipient_data


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


class TransferRecipientSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100, required=True)
    type = serializers.ChoiceField(
        choices=TransferRecipient.RecipientChoices.choices,
        required=True,
    )
    account_number = serializers.CharField(max_length=10, allow_blank=True)
    bank_code = serializers.CharField(max_length=5, allow_blank=True)
    email = serializers.EmailField(allow_blank=True)
    authorization_code = serializers.CharField(max_length=100, allow_blank=True)

    def validate(self, data):
        validate_new_recipient_data(data)
        return data
