import uuid

from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.db import models

from accounts.models import CustomUser


# --------------------------------------------------------------------------------------
# Functions
# --------------------------------------------------------------------------------------
def remove_underscores(error_message: str) -> str:
    return error_message.replace("_", " ")


def get_user_by_id(user_id) -> CustomUser:
    User = get_user_model()

    try:
        return User.objects.get(uuid=user_id)
    except User.DoesNotExist:
        raise ObjectDoesNotExist(f"User with user ID: {user_id} not found")


# --------------------------------------------------------------------------------------
# Classes
# --------------------------------------------------------------------------------------
class TimeStampedUUIDModel(models.Model):
    """
    An abstract base class model that provides
    self-updating "created" and "modified" fields.
    """

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    uuid = models.UUIDField(
        unique=True,
        editable=False,
        default=uuid.uuid4,
        verbose_name="Public identifier",
    )

    class Meta:
        abstract = True
