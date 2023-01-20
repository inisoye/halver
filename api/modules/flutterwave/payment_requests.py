from flutterwave.base import FlutterwaveBase


class Payments(FlutterwaveBase):
    """
    Methods for initializing a Flutterwave payment.
    """

    @classmethod
    def initialize(cls, **kwargs):
        """
        Initialize a payment to get a payment link as a response.
        Primarily intended to be used to add cards as this endpoint is not in
        rave-python package.
        Akin to Paystack initialize transaction method.

        Args:
            tx_ref: A unique reference peculiar for the transaction.
            amount: Transaction amount.
            currency: Currency to charge in. Default is "NGN".
            redirect_url: The URL to redirect the customer to after payment is done.
            payment_options: Paystack options to be exposed in user.
                Should be "card" only. Only required if disabled on dashboard.
            customer: An object containing the customer details.
                email: Email address of customer.
                name (optional): Name of customer.
                phonenumber(optional): Phone number of customer.
            meta (optional): An object containing any transaction extra information.
            customizations (optional): Customizations for the payment modal.
                title: A title for the payment
                logo: A logo, perhaps the Halver logo
                description: A description for the payment
            payment_plan (optional): Specified plan for subscriptions/recurring payments.

        Returns:
            JSON response with the payment link.
        """

        return cls().requests.post(
            "payments",
            data=kwargs,
        )
