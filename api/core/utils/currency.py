from decimal import ROUND_HALF_EVEN, Decimal
from typing import Union


def convert_to_kobo_integer(value: Union[int, float, Decimal, str]) -> int:
    """Converts a numeric value (or numeric string) to an integer value representing
    the Kobo (lowest denomination of the Nigerian Naira) value equivalent. The same
    could be done for Pesewas etc.

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
