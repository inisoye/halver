import datetime

from django.core.exceptions import ValidationError
from django.utils import timezone


def validate_date_not_in_past(dt: datetime.datetime | None, date_name: str) -> None:
    """Validate that a given date is not in the past.

    Args:
    date: The date to be validated.
    date_name: The name of the date, used in the error message.
    """

    if dt is None:
        raise ValidationError(f"{date_name} must be provided.")

    if dt.date() < datetime.date.today():
        raise ValidationError(f"{date_name} cannot be in the past.")


def get_one_week_from_now():
    """Get the date and time one week from now.

    Returns:
        datetime: the date and time one week from now
    """

    return timezone.now() + datetime.timedelta(weeks=1)


def validate_date_is_at_least_one_week_into_future(
    date: datetime.datetime | None, date_name: str
) -> None:
    """Validate that a given date is at least one week into the future.

    Args:
    date: The date to be validated.
    date_name: The name of the date, used in the error message.
    """

    if date is None:
        raise ValidationError(f"{date_name} must be provided.")

    one_week_from_now = get_one_week_from_now()

    if date < one_week_from_now:
        raise ValidationError(f"{date_name} must be at least one week into the future.")
