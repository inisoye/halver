"""
Methods for handling and obtaining banks supported by Paystack.
"""

from .base import PaystackBase


class Bank(PaystackBase):
    @classmethod
    def list(cls, **kwargs):
        """
        List banks supported by Paystack.

        Args:
            No argument is required.

            country (str): The country to obtain the list of supported banks from.
            e.g country=ghana or country=nigeria

            gateway (str): The gateway type of the bank.
            It can be one of these: [emandate, digitalbankmandate]

            currency (str): Any of NGN, USD, GHS or ZAR

        Returns:
            JSON data from paystack API.
        """

        return cls().requests.get(
            "bank",
            qs=kwargs,
        )
