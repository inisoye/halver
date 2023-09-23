from decimal import ROUND_HALF_EVEN, Decimal
from typing import Union

from core.utils.decimals import round_decimal


def convert_to_kobo_integer(value: Union[int, float, Decimal, str]) -> int:
    """Converts a numeric value (or numeric string) to an integer value
    representing the Kobo (lowest denomination of the Nigerian Naira) value
    equivalent. The same could be done for Pesewas etc.

    The conversion is typically carried out to convert amounts to values acceptable by
    the Paystack API.

    Args:
        value (int, float, Decimal, str): The numeric value (or numeric string) to
        convert.

    Returns:
        int: The integer value representing the Kobo value equivalent of the numeric
        value.
    """

    value_decimal = Decimal(str(value))
    kobo = value_decimal * Decimal("100")
    kobo_rounded = kobo.quantize(Decimal("1"), rounding=ROUND_HALF_EVEN)
    return int(kobo_rounded)


def convert_to_naira(value: Union[int, float, Decimal, str]) -> Decimal:
    """Converts a value representing the Kobo value equivalent of the Nigerian
    Naira to a Decimal value representing the Naira value.

    Args:
        value (int, float, Decimal, str): The integer value representing the Kobo
        value equivalent of the Naira value.

    Returns:
        Decimal: The Decimal value representing the Naira value equivalent of the
        Kobo value.
    """

    value_decimal = Decimal(str(value))
    naira = value_decimal / Decimal("100")
    naira_rounded = naira.quantize(Decimal("0.0001"), rounding=ROUND_HALF_EVEN)
    return naira_rounded


def add_commas_to_amount(
    value: Union[int, float, Decimal, str], decimal_places: int = 4
):
    return "{:,}".format(round_decimal(Decimal(value), decimal_places))
