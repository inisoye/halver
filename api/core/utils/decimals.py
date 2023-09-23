from decimal import Decimal, InvalidOperation, getcontext
from typing import Union


def round_decimal(value: Decimal, decimal_places: Union[int, None] = None):
    """Rounds a Decimal object to the specified number of decimal places.

    Args:
        value (Decimal): Decimal object to be rounded.
        decimal_places (int, optional): Number of decimal places to round to.
        Default is None.

    Returns:
        Decimal: Rounded Decimal object.

    Raises:
        InvalidOperation: If there is an error in the operation.
    """

    DEFAULT_DECIMAL_PLACES = 4

    if decimal_places is None:
        getcontext().prec = 19

    else:
        if decimal_places < 0:
            raise ValueError("decimal_places must be a non-negative integer")

        getcontext().prec = decimal_places + 10  # Add some extra precision for safety

    getcontext().rounding = "ROUND_HALF_EVEN"

    try:
        return value.quantize(
            Decimal("0." + "0" * (decimal_places or DEFAULT_DECIMAL_PLACES))
        )

    except InvalidOperation as invalid_operation:
        raise InvalidOperation(
            f"Invalid operation: {invalid_operation}. Check your input: {value}"
        )
