from rest_framework import serializers

from ..models import UserCard


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
            "last4",
            "signature",
            "uid",
            "created",
        )
        exclude = ("id",)
