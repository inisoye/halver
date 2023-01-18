# Configuration inspired by this guide:
# https://www.rootstrap.com/blog/registration-and-authentication-in-django-apps-with-dj-rest-auth/

from dj_rest_auth.registration.serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils.translation import gettext_lazy as _
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

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


class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            "uuid",
            "email",
            "phone",
            "username",
            "first_name",
            "last_name",
            "date_joined",
            "profile_image",
        )
        read_only_fields = (
            "uuid",
            "first_name",
            "last_name",
            "date_joined",
        )
