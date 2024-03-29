# Configuration inspired by this guide:
# https://www.rootstrap.com/blog/registration-and-authentication-in-django-apps-with-dj-rest-auth/

from dj_rest_auth.models import TokenModel
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils.translation import gettext_lazy as _
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from financials.data.logos import bank_logo_index
from financials.models import TransferRecipient, UserCard

CustomUser = get_user_model()


class CustomRegisterSerializer(RegisterSerializer):
    phone = PhoneNumberField(
        required=False,
        # Add a custom validator for uniqueness because this serializer
        # does not inherit (all) the attributes of the CustomUser model.
        validators=[
            UniqueValidator(
                queryset=CustomUser.objects.all(),
                message=_("A user with this phone number already exists."),
            )
        ],
    )
    first_name = serializers.CharField(required=False, allow_blank=True, max_length=30)
    last_name = serializers.CharField(required=False, allow_blank=True, max_length=30)

    # Define transaction.atomic to rollback the save operation in case of error
    @transaction.atomic
    def save(self, request):
        user = super().save(request)
        user.phone = self.data.get("phone")
        user.first_name = self.data.get("first_name")
        user.last_name = self.data.get("last_name")
        user.save()
        return user


class CustomUserDefaultCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCard
        fields = (
            "account_name",
            "bank",
            "card_type",
            "created",
            "exp_month",
            "exp_year",
            "first_6",
            "last_4",
            "uuid",
        )


class CustomUserDefaultTransferRecipientSerializer(serializers.ModelSerializer):
    bank_logo = serializers.SerializerMethodField()

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
            "authorization_code",
            "bank_code",
            "bank_logo",
            "bank_name",
            "created",
            "email",
            "name",
            "recipient_code",
            "recipient_type",
            "uuid",
        )


class CustomUserDetailsSerializer(serializers.ModelSerializer):
    default_card = CustomUserDefaultCardSerializer(required=False, allow_null=True)
    default_transfer_recipient = CustomUserDefaultTransferRecipientSerializer(
        required=False, allow_null=True
    )

    class Meta:
        model = CustomUser
        fields = (
            "date_joined",
            "default_card",
            "default_transfer_recipient",
            "email",
            "first_name",
            "full_name",
            "last_name",
            "phone",
            "profile_image_url",
            "profile_image_hash",
            "username",
            "uuid",
        )
        read_only_fields = (
            "date_joined",
            "uuid",
        )


class CustomTokenSerializer(serializers.ModelSerializer):
    """
    Custom serializer for overiding default dj-rest-auth TokenSerializer.
    """

    user = CustomUserDetailsSerializer(many=False, read_only=True)

    class Meta:
        model = TokenModel
        fields = ("key", "user")


class ProfileImageSerializer(serializers.Serializer):
    profile_image = serializers.ImageField(allow_empty_file=False)


class RegisteredContactsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            "first_name",
            "full_name",
            "last_name",
            "phone",
            "profile_image_url",
            "profile_image_hash",
            "username",
            "uuid",
        )
        read_only_fields = fields


class ExpoPushTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("expo_push_token",)
