"""
Methods for querying handling Paystack subscriptions.
"""

from paystack.base import PaystackBase


class Subscription(PaystackBase):
    @classmethod
    def create(cls, **kwargs):
        """
        Create subscription.

        Args:
            customer: Customer's email address or customer code
            plan: Plan code
            authorization: customers authorization code
            start_date:  the date for the first debit. (ISO 8601 format)

        Returns:
            JSON response confirming creation.
        """

        return cls().requests.post(
            "subscription",
            data=kwargs,
        )

    @classmethod
    def list(cls, **kwargs):
        """
        List subscriptions.

        Args:
            perPage: records you want to retrieve per page (Integer)
            page: what page you want to retrieve (Integer)

        Returns:
            A list of subscriptions.
        """

        return cls().requests.get(
            "subscription",
            query_params=kwargs,
        )

    @classmethod
    def fetch(cls, subscription_id):
        """
        Fetch subscription.

        Args:
            subscription_id: subscription id.

        Returns:
            JSON data for a single subscription.
        """

        return cls().requests.get(
            f"subscription/{subscription_id}",
        )

    @classmethod
    def disable(cls, **kwargs):
        """
        Disables subscription

        Args:
            code: Subscription code
            token: Email token

        returns:
            A JSON confirmation of disable request.
        """

        return cls().requests.post(
            "subscription/disable",
            data=kwargs,
        )

    @classmethod
    def enable(cls, **kwargs):
        """
        Enables subscription

        Args:
            code: Subscription code
            token: Email token

        returns:
            A JSON confirmation of enable request.
        """

        return cls().requests.post(
            "subscription/enable",
            data=kwargs,
        )

    @classmethod
    def generate_update_link(cls, subscription_code):
        """
        Fetch subscription.

        Args:
            code: Subscription code

        Returns:
            JSON data with the "update card" link.
        """

        return cls().requests.post(
            f"subscription/{subscription_code}/manage/link/",
        )

    @classmethod
    def send_update_email(cls, subscription_code):
        """
        Fetch subscription.

        Args:
            code: Subscription code

        Returns:
           A confirmation of the email despatch.
        """

        return cls().requests.post(
            f"subscription/{subscription_code}/manage/email/",
        )
