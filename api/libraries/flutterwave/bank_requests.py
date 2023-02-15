from libraries.flutterwave.base import FlutterwaveBase


class BankRequests(FlutterwaveBase):
    """Methods for handling and obtaining Flutterwave bank data."""

    @classmethod
    def list(cls, country):
        """List banks supported by Flutterwave.

        Args:
            country (required): The country code of the Banks being queried.
            Expected values include: NG, GH, KE, UG, ZA or TZ.

        Returns:
            JSON data from Flutterwave API with a list of supported banks.
        """

        return cls().requests.get(
            f"banks/{country}",
        )

    @classmethod
    def resolve_account_details(cls, **kwargs):
        """Confirm the owner of an account with it's number.

        Args:
            account_number (str): customer's Nigerian account number.
            account_bank (str): customer's Nigerian bank code.

        Returns:
            JSON data from Flutterwave API with the account holder's name.
        """

        return cls().requests.post(
            "accounts/resolve",
            data=kwargs,
        )
