# Custom manager inspired by built in User model and the following:
# https://simpleisbetterthancomplex.com/article/2021/07/08/what-you-should-know-about-the-django-user-model.html
# https://github.com/fusionbox/django-authtools/blob/master/authtools/models.py

import time
import uuid

import blurhash
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager, PermissionsMixin
from django.contrib.auth.validators import ASCIIUsernameValidator
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.db import models
from django.db.models.functions import Lower
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from PIL import Image

from core.utils.images import convert_image_to_byte_array


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
    """Custom user model built on Django's default model.

    Args:
        AbstractBaseUser
        PermissionsMixin
    """

    # ! Ensure the user object has all its joined models disabled before it is deleted.
    # This includes bills, paystack subs and paystack plans.
    # TODO These should be joined with models.SET_NULL and not any other strategy.

    username_validator = ASCIIUsernameValidator()

    username = models.CharField(
        _("username"),
        max_length=50,
        unique=True,
        help_text=_(
            "Required. 50 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
    first_name = models.CharField(
        _("first name"),
        max_length=50,
        blank=True,
    )
    last_name = models.CharField(
        _("last name"),
        max_length=50,
        blank=True,
    )
    email = models.EmailField(
        _("email address"),
        max_length=50,
        unique=True,
        error_messages={
            "unique": _("A user with that email address already exists."),
        },
    )
    phone = PhoneNumberField(
        max_length=30,
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
    profile_image_url = models.URLField(null=True, blank=True)
    profile_image_hash = models.CharField(max_length=35, null=True, blank=True)
    uuid = models.UUIDField(
        unique=True,
        editable=False,
        default=uuid.uuid4,
        verbose_name="Public identifier",
    )
    expo_push_token = models.CharField(
        max_length=70,
        null=True,
        blank=True,
        error_messages={
            "unique": _("This token already exists for a different user."),
        },
    )

    objects = CustomUserManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        # Set a unique constraint on the lowercase version of the username and email
        # https://docs.djangoproject.com/en/4.0/ref/models/constraints/#expressions
        constraints = [
            models.UniqueConstraint(
                Lower("username"),
                Lower("email"),
                name="user_username_email_ci_uniqueness",
            ),
        ]
        # Order of indexes intentionally determined for optimized filtering
        # https://stackoverflow.com/a/45329852
        indexes = [
            models.Index(fields=["uuid"]),
            models.Index(
                fields=[
                    "phone",
                    "email",
                    "first_name",
                    "last_name",
                    "username",
                ]
            ),
            models.Index(fields=["expo_push_token"], name="expo_push_token_index"),
        ]
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def __str__(self) -> str:
        return f"name: {self.full_name}"

    def clean(self) -> None:
        super().clean()

        # Phone numbers are (already) normalized by the phonenumber_field package
        self.email = self.__class__.objects.normalize_email(self.email)
        self.username = self.username.lower()

    @property
    def full_name(self) -> str:
        """Return the first_name plus the last_name, with a space in between."""

        return f"{self.first_name} {self.last_name}"

    @property
    def default_transfer_recipient(self):
        try:
            return self.transfer_recipients.get(is_default=True)
        except ObjectDoesNotExist:
            return None

    @property
    def default_card(self):
        try:
            return self.cards.get(is_default=True)
        except ObjectDoesNotExist:
            return None

    @property
    def has_default_transfer_recipient(self):
        """Return True if the user has a default transfer recipient, False
        otherwise."""

        return self.default_transfer_recipient is not None

    @property
    def has_default_card(self):
        """Return True if the user has a default card, False otherwise."""

        return self.default_card is not None

    def get_short_name(self) -> str:
        """Return the short name for the user."""

        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs) -> None:
        """Send an email to this user."""

        send_mail(subject, message, from_email, [self.email], **kwargs)

    def get_recipient_codes(self) -> list:
        """Obtain all the (Paystack) recipient codes for this user.

        Returns:
            list: A list of this user's recipient codes.
        """

        recipient_codes = self.transfer_recipients.values_list(
            "recipient_code",
            flat=True,
        )
        return list(recipient_codes)

    def activate_user(self):
        """Activate a user, usually after login."""

        self.is_active = True
        self.save()

    def update_profile_image(self, profile_image):
        """Update the user's profile image, generate a blurhash, and store the
        URL and hash.

        Args:
            profile_image: A file object containing the new profile image.
        """

        image = Image.open(profile_image)

        image.thumbnail((500, 500))
        image_bytes = convert_image_to_byte_array(image)

        hash = blurhash.encode(image, x_components=4, y_components=3)

        image_public_id = f"{self.last_name}_{self.uuid}_avatar"
        FOLDER_NAME = "profile_images"

        upload(
            image_bytes,
            public_id=image_public_id,
            use_filename=True,
            unique_filename=False,
            folder=FOLDER_NAME,
            overwrite=True,
        )

        url, options = cloudinary_url(
            f"{FOLDER_NAME}/{image_public_id}",
            width=300,
            height=300,
            crop="fill",
            version=int(time.time()),
        )

        self.profile_image_hash = hash
        self.profile_image_url = url
        self.save()

        # Close the file object
        profile_image.close()
