from decimal import Decimal, InvalidOperation, getcontext


def round_decimal(value: Decimal):
    """Rounds a Decimal object to 4 decimal places.

    Args:
        value (Decimal): Decimal object to be rounded.

    Returns:
        Decimal: Rounded Decimal object.

    Raises:
        InvalidOperation: If there is an error in the operation.
    """

    # Set precision for Decimal object to 19
    getcontext().prec = 19

    # Set rounding method to "ROUND_HALF_EVEN"
    getcontext().rounding = "ROUND_HALF_EVEN"

    try:
        return value.quantize(Decimal("0.0000"))

    except InvalidOperation as e:
        raise InvalidOperation(f"Invalid operation: {e}. Check your input: {value}")
