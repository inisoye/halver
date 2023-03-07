import datetime

from django.core.exceptions import ValidationError
from django.utils import timezone


def check_date_is_in_past(dt: datetime.datetime | None) -> bool:
    """
    Check whether a given date is in the past.

    Args:
        dt: The date to be checked.

    Returns:
        bool: True if the date is in the past, False otherwise.
    """

    if dt is None:
        raise ValidationError("A date must be provided.")

    return dt.date() < datetime.date.today()


def validate_date_not_in_past(dt: datetime.datetime | None, date_name: str) -> None:
    """Validate that a given date is not in the past.

    Args:
        dt: The date to be validated.
        date_name: The name of the date, used in the error message.
    """

    if dt is None:
        raise ValidationError(f"{date_name} must be provided.")

    if dt.date() < datetime.date.today():
        raise ValidationError(f"{date_name} cannot be in the past.")


def get_one_day_from_now(use_day_start=False):
    """
    Get the date and time one day from now.

    Args:
        use_day_start (bool, optional): If True, return the date at the start of the day
        (i.e., midnight). Default is False.

    Returns:
        datetime: the date and time one day from now. If `use_day_start` is True,
        the time will be set to midnight (i.e., the start of the day).
    """

    # Calculate the datetime one day from now
    one_day_from_now = timezone.now() + datetime.timedelta(days=1)

    # If use_day_start is True, set the time to midnight (i.e., the start of the day)
    if use_day_start:
        return one_day_from_now.replace(hour=0, minute=0, second=0, microsecond=0)

    # Otherwise, return the datetime as-is
    return one_day_from_now


def get_one_day_from_date(date, use_day_start=False):
    """
    Get the date and time one day after the given date.

    Args:
        date (datetime): The starting date to add one day to.
        use_day_start (bool, optional): If True, return the date at the start of the day
        (i.e., midnight). Default is False.

    Returns:
        datetime: the date and time one day after the given date. If `use_day_start`
        is True, the time will be set to midnight (i.e., the start of the day).
    """

    # Calculate the datetime one day after the given date
    one_day_after_date = date + datetime.timedelta(days=1)

    # If use_day_start is True, set the time to midnight (i.e., the start of the day)
    if use_day_start:
        return one_day_after_date.replace(hour=0, minute=0, second=0, microsecond=0)

    # Otherwise, return the datetime as-is
    return one_day_after_date


def get_one_week_from_now(use_day_start=False):
    """
    Get the date and time one week from now.

    Args:
        use_day_start (bool, optional): If True, return the date at the start of the day
        (i.e., midnight). Default is False.

    Returns:
        datetime: the date and time one week from now. If `use_day_start` is True,
        the time will be set to midnight (i.e., the start of the day).
    """

    # Calculate the datetime one week from now
    one_week_from_now = timezone.now() + datetime.timedelta(weeks=1)

    # If use_day_start is True, set the time to midnight (i.e., the start of the day)
    if use_day_start:
        return one_week_from_now.replace(hour=0, minute=0, second=0, microsecond=0)

    # Otherwise, return the datetime as-is
    return one_week_from_now


def validate_date_is_at_least_one_week_into_future(
    date: datetime.datetime | None, date_name: str, use_day_start=False
) -> None:
    """
    Validate that a given date is at least one week into the future.

    Args:
        date (datetime.datetime or None): The date to be validated.
        date_name (str): The name of the date, used in the error message.
        use_day_start (bool, optional): If True, consider the start of the day
            (i.e., midnight) one week from now. Default is False.

    Raises:
        ValidationError: If the date is not at least one week into the future,
            or if the date is None.
    """

    if date is None:
        raise ValidationError(f"{date_name} must be provided.")

    # Calculate the datetime one week from now, optionally at the start of the day
    one_week_from_now = get_one_week_from_now(use_day_start)

    if date < one_week_from_now:
        raise ValidationError(f"{date_name} must be at least one week into the future.")
