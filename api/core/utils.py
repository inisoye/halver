from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

from accounts.models import CustomUser


def remove_underscores(error_message: str) -> str:
    return error_message.replace("_", " ")


def get_user_by_id(user_id) -> CustomUser:
    User = get_user_model()

    try:
        return User.objects.get(uuid=user_id)
    except User.DoesNotExist:
        raise ObjectDoesNotExist(f"User with user ID: {user_id} not found")
