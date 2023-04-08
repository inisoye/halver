# Custom manager inspired by built in User model and the following:
# https://simpleisbetterthancomplex.com/article/2021/07/08/what-you-should-know-about-the-django-user-model.html
# https://github.com/fusionbox/django-authtools/blob/master/authtools/models.py

import time
import uuid
from io import BytesIO

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
    """Custom user model built Django's default model.

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
        max_length=150,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
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
    email = models.EmailField(
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
    profile_image_url = models.URLField(null=True, blank=True)
    profile_image_hash = models.CharField(max_length=35, null=True, blank=True)
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
        indexes = [models.Index(fields=["uuid"])]
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

    def update_profile_image(self, profile_image):
        """Update the user's profile image, generate a blurhash, and store the
        URL and hash.

        Args:
            profile_image: A file object containing the new profile image.
        """

        # Read the data from the file object into memory
        image_data = profile_image.read()
        image = Image.open(BytesIO(image_data))

        # Generate blurhash
        image.thumbnail((100, 100))
        hash = blurhash.encode(image, x_components=4, y_components=3)

        image_public_id = f"{self.last_name}_{self.uuid}_avatar"

        # Prevent file loss: https://stackoverflow.com/a/44722982
        profile_image.seek(0)

        upload(
            profile_image,
            public_id=image_public_id,
            unique_filename=False,
            overwrite=True,
        )

        url, options = cloudinary_url(
            image_public_id,
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
