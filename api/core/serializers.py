import decimal

from rest_framework import serializers


class RoundingDecimalField(serializers.DecimalField):
    """
    A custom Decimal field that rounds values to the specified decimal places.

    This field inherits from DRF's DecimalField and provides rounding functionality.

    Args:
        max_digits (int): The maximum number of digits for the value.
        decimal_places (int): The number of decimal places for the value.
        rounding (decimal.ROUND_*, optional): The rounding mode to use
                                              (default is ROUND_HALF_UP).

    Example:
        To use this field in a serializer::

            class MySerializer(serializers.Serializer):
                my_field = RoundingDecimalField(
                    max_digits=19,
                    decimal_places=4,
                    rounding=decimal.ROUND_HALF_UP
                )
    """

    def validate_precision(self, value):
        """
        Rounding and validation of the precision of a decimal value.

        Args:
            value (decimal.Decimal): The decimal value to be rounded and validated.

        Returns:
            decimal.Decimal: The rounded and validated value.

        See also:
            https://stackoverflow.com/a/73961929
        """
        with decimal.localcontext() as ctx:
            if self.rounding:
                ctx.rounding = self.rounding
            value = round(value, self.decimal_places)
        return super().validate_precision(value)
