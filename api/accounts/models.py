# Custom manager inspired by built in User model and the following:
# https://simpleisbetterthancomplex.com/article/2021/07/08/what-you-should-know-about-the-django-user-model.html
# https://github.com/fusionbox/django-authtools/blob/master/authtools/models.py

import uuid

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager, PermissionsMixin
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.contrib.postgres.fields import CICharField, CIEmailField
from django.core.mail import send_mail
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        if not username:
            raise ValueError("The Username field must be set")

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, username, password, **extra_fields)

    def get_by_natural_key(self, email):
        normalized_email = self.normalize_email(email)
        return self.get(**{self.model.USERNAME_FIELD: normalized_email})


class CustomUser(AbstractBaseUser, PermissionsMixin):
    username_validator = ASCIIUsernameValidator()

    username = CICharField(
        _("username"),
        max_length=150,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_" " only."
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
    first_name = models.CharField(
        _("first name"),
        max_length=150,
        blank=True,
    )
    last_name = models.CharField(
        _("last name"),
        max_length=150,
        blank=True,
    )
    email = CIEmailField(
        _("email address"),
        unique=True,
        error_messages={
            "unique": _("A user with that email address already exists."),
        },
    )
    phone = PhoneNumberField(
        null=True,
        blank=True,
        unique=True,
        error_messages={
            "unique": _("A user with that phone number already exists."),
        },
    )
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active."
            " Unselect this instead of deleting accounts."
        ),
    )
    date_joined = models.DateTimeField(
        _("date joined"),
        default=timezone.now,
    )
    profile_image = models.ImageField(
        upload_to="profile_images/",
        blank=True,
    )
    uuid = models.UUIDField(
        unique=True,
        editable=False,
        default=uuid.uuid4,
        verbose_name="Public identifier",
    )

    objects = CustomUserManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self) -> str:
        return f"name: {self.full_name}"

    def clean(self) -> None:
        super().clean()

        # Phone numbers are (already) normalized with the phonenumber_field package
        self.email = self.__class__.objects.normalize_email(self.email)
        self.username = self.username.lower()

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    def get_full_name(self) -> str:
        """
        Return the first_name plus the last_name, with a space in between.
        """

        full_name = "%s %s" % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self) -> str:
        """
        Return the short name for the user.
        """

        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs) -> None:
        """
        Send an email to this user.
        """

        send_mail(subject, message, from_email, [self.email], **kwargs)

    def get_recipient_codes(self) -> list:
        """
        Obtain all the (Paystack) recipient codes for this user.

        Returns:
            list: A list of this user's recipient codes.
        """

        recipient_codes = self.transfer_recipients.values_list(
            "recipient_code",
            flat=True,
        )
        return list(recipient_codes)

    class Meta:
        ordering = ["first_name", "last_name", "email"]
        verbose_name = _("user")
        verbose_name_plural = _("users")
