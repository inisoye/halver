import datetime

from django.core.exceptions import ValidationError
from django.utils import timezone


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


def get_one_week_from_now():
    """
    Get the date and time one week from now

    Returns:
        datetime: the date and time one week from now
    """

    return timezone.now() + datetime.timedelta(weeks=1)
