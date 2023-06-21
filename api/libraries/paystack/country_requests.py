from libraries.paystack.base import PaystackBase


class CountryRequests(PaystackBase):
    """Methods for handling and obtaining Paystack countries data."""

    @classmethod
    def list(cls):
        """List countries supported by Paystack.

        Args:
            No argument is required.

        Returns:
            JSON data from Paystack API with a list of supported countries.
        """

        return cls().requests.get("country")

    @classmethod
    async def list_async(cls):
        """List countries supported by Paystack.

        Args:
            No argument is required.

        Returns:
            JSON data from Paystack API with a list of supported countries.
        """

        return cls().requests.get_async("country")
