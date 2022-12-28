import uuid

from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from rest_framework import status
from rest_framework.response import Response

from accounts.admin import CustomUser


# --------------------------------------------------------------------------------------
# Functions
# --------------------------------------------------------------------------------------
def return_ok_response(data=None, status=status.HTTP_200_OK) -> Response:
    response = {"status": "ok", "result": data}
    return Response(response, status=status)


def return_bad_request_exception(data, status=status.HTTP_400_BAD_REQUEST) -> Response:
    response = {"status": "bad request", "result": data}
    return Response(response, status=status)


def get_user_by_id(user_id) -> CustomUser:
    User = get_user_model()
    try:
        return User.objects.get(uid=user_id)
    except User.DoesNotExist:
        raise ObjectDoesNotExist(f"User with user ID: {user_id} not found")


# --------------------------------------------------------------------------------------
# Classes
# --------------------------------------------------------------------------------------
class TimeStampedModelWithUID(models.Model):
    """
    An abstract base class model that provides
    self-updating "created" and "modified" fields.
    """

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    uid = models.UUIDField(
        unique=True,
        editable=False,
        default=uuid.uuid4,
        verbose_name="Public identifier",
    )

    class Meta:
        abstract = True
