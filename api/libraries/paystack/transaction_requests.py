from libraries.paystack.base import PaystackBase


class TransactionRequests(PaystackBase):
    """Methods for querying handling Paystack transactions."""

    @classmethod
    def initialize(cls, **kwargs):
        """Initialize transaction.

        Args:
            reference: Unique transaction reference
            amount: Transaction amount (in Kobo for Naira payments)
            email: Email address of customer
            plan: Specified plan for subscriptions (optional)
            channels: Paystack channels to be exposed
            metadata: Stringified JSON object of custom data.

        Returns:
            JSON response with confirmation.
        """

        return cls().requests.post(
            "transaction/initialize",
            data=kwargs,
        )

    @classmethod
    def charge(cls, **kwargs):
        """Charge a reusable authorization.

        Args:
            authorization_code: Authorization code for the transaction
            email: Email Address of the user with the authorization code
            amount: Transaction amount (in Kobo for Naira payments)
            reference: Unique transaction reference
            metadata: Stringified JSON object of custom data.

        Returns:
            JSON data from Paystack API.
        """

        return cls().requests.post(
            "transaction/charge_authorization",
            data=kwargs,
        )

    @classmethod
    def fetch(cls, transaction_id):
        """Get a single transaction.

        Args:
            transaction_id: Transaction id (integer).

        Returns:
            A single transaction.
        """

        return cls().requests.get(
            f"transaction/{transaction_id}",
        )

    @classmethod
    def list(cls, **kwargs):
        """List transactions.

        Args:
            perPage: Records you want to retrieve per page (Integer).
            page: The page you want to retrieve (Integer).
            customer: The ID of the customer whose transactions should be retrieved.
            status: Filter transactions by status.
            amount: Filter transactions by amount.
            from: Filter transactions by start date.
            to: Filter transactions by end date.

        Returns:
            A list of transactions.
        """

        return cls().requests.get(
            "transaction",
            query_params=kwargs,
        )

    @classmethod
    def totals(cls, **kwargs):
        """Get totals.

        Args:
            No argument required.

        Returns:
            JSON data from Paystack API.
        """

        return cls().requests.get(
            "transaction/totals",
            query_params=kwargs,
        )

    @classmethod
    def verify(cls, reference):
        """Verify transactions.

        Args:
            reference: a unique value needed for transaction.

        Returns:
            JSON data showing details about a transaction's status.
        """
        return cls().requests.get(
            f"transaction/verify/{reference}",
        )
