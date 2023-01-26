import datetime

from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.utils import timezone

from accounts.models import CustomUser


def get_user_by_id(user_id) -> CustomUser:
    """
    Get user by ID.

    Args:
        user_id (str): The ID of the user to retrieve.

    Returns:
        CustomUser: The user with the specified ID.

    Raises:
        ObjectDoesNotExist: If the user with the specified ID does not exist.
    """

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


def remove_underscores(string: str) -> str:
    """
    Removes underscores from a string.

    Args:
        string (str): The string to remove underscores from.

    Returns:
        str: The string with underscores removed.
    """

    return string.replace("_", " ")


def get_one_week_from_now():
    """
    Get the date and time one week from now

    Returns:
        datetime: the date and time one week from now
    """

    return timezone.now() + datetime.timedelta(weeks=1)
