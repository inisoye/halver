from libraries.paystack.base import PaystackBase


class BankRequests(PaystackBase):
    """
    Methods for handling and obtaining Paystack bank data.
    """

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
            JSON data from Paystack API with a list of supported banks.
        """

        return cls().requests.get(
            "bank",
            query_params=kwargs,
        )

    @classmethod
    def resolve_account_number(cls, **kwargs):
        """
        Confirm the owner of an account with it's number.

        Args:
            account_number (str): customer's account number.
            bank_code (str): customer's bank code.

        Returns:
            JSON data from Paystack API with the account holder's name.
        """

        return cls().requests.get(
            "bank/resolve",
            query_params=kwargs,
        )
