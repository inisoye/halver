import datetime

from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from accounts.models import CustomUser


def remove_underscores(string: str) -> str:
    return string.replace("_", " ")


def get_user_by_id(user_id) -> CustomUser:
    User = get_user_model()

    try:
        return User.objects.get(uuid=user_id)
    except User.DoesNotExist:
        raise ObjectDoesNotExist(f"User with user ID: {user_id} not found")


def validate_date_not_in_past(date: datetime.datetime | None, date_name: str) -> None:
    """
    Validate that a given date is not in the past.

    Args:
    date: The date to be validated.
    date_name: The name of the date, used in the error message.
    """

    if date is None:
        raise ValidationError(f"{date_name} must be provided.")

    if date < datetime.date.today():
        raise ValidationError(f"{date_name} cannot be in the past.")
