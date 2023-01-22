from libraries.flutterwave.base import FlutterwaveBase


class TokenizedCharges(FlutterwaveBase):
    """
    Methods for initializing a Flutterwave payment.
    """

    @classmethod
    def charge(cls, **kwargs):
        """
        Initiate a tokenized transaction. Charges a saved card.
        Akin to Paystack's charge authorization method.

        Args:
            token: The card token (obtained from card saved to DB).
            email: The email address of the customer.
            currency: The currency the transaction should be charged in.
            amount: The amount to be charged.
            tx_ref: A unique reference peculiar for the transaction
            first_name (optional): First name of the customer
            last_name (optional): Last name of the customer


        Returns:
            JSON response with the payment link.
        """

        return cls().requests.post(
            "tokenized-charges",
            data=kwargs,
        )
