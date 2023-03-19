import asyncio

from libraries.paystack.base import PaystackBase


class SubscriptionRequests(PaystackBase):
    """Methods for querying and handling Paystack subscriptions."""

    @classmethod
    def create(cls, **kwargs):
        """Create a subscription.

        Args:
            customer: Customer's email address or customer code
            plan: Plan code
            authorization: Customers authorization code
            start_date: The date for the first debit. (ISO 8601 format)

        Returns:
            JSON response confirming creation.
        """

        return cls().requests.post(
            "subscription",
            data=kwargs,
        )

    @classmethod
    def list(cls, **kwargs):
        """List subscriptions.

        Args:
            perPage: Records you want to retrieve per page (Integer)
            page: The page you want to retrieve (Integer)
            customer: Filter by customer ID.
            plan: Filter by plan ID.

        Returns:
            A list of subscriptions.
        """

        return cls().requests.get(
            "subscription",
            query_params=kwargs,
        )

    @classmethod
    def fetch(cls, id_or_code):
        """Fetch subscription.

        Args:
            id_or_code: Subscription ID or code.

        Returns:
            JSON data for a single subscription.
        """

        return cls().requests.get(
            f"subscription/{id_or_code}",
        )

    @classmethod
    def disable(cls, **kwargs):
        """Disable a subscription.

        Args:
            code: Subscription code.
            token: Email token.

        returns:
            A JSON confirmation of disabled subscription.
        """

        return cls().requests.post(
            "subscription/disable",
            data=kwargs,
        )

    @classmethod
    async def disable_async(cls, **kwargs):
        """Disable a subscription asynchronously. The request is sent asynchronously to
        facilitate the disable_multiple method.

        Args:
            code: Subscription code.
            token: Email token.


        returns:
            A JSON confirmation of disabled subscription.
        """

        response = await cls().requests.post_async(
            "subscription/disable",
            data=kwargs,
        )

        return response

    @classmethod
    async def disable_multiple(cls, disable_subscription_payloads):
        """Disable multiple paystack subscriptions by running the disable method multiple
        times, concurrently.

        Args:
            disable_subscription_payloads: A list of payloads to be used in disabling
                each subscription. Each item should contain the params of disable_async.

        Returns:
            A list of confirmation messages confirming disabled subscription.
        """

        # Create a list of tasks that will be run concurrently
        tasks = [
            asyncio.ensure_future(cls().disable_async(**disable_subscription_payload))
            for disable_subscription_payload in disable_subscription_payloads
        ]

        # Wait for all tasks to complete
        disabled_subscriptions = await asyncio.gather(*tasks)

        # Return the list of disabled confirmations.
        return disabled_subscriptions

    @classmethod
    def enable(cls, **kwargs):
        """Enable a subscription.

        Args:
            code: Subscription code
            token: Email token.

        returns:
            A JSON confirmation of enabled subscription.
        """

        return cls().requests.post(
            "subscription/enable",
            data=kwargs,
        )

    @classmethod
    def generate_update_link(cls, subscription_code):
        """Generate a link for users to update the card on a subscription.

        Args:
            code: Subscription code.

        Returns:
            JSON data with the "update card" link.
        """

        return cls().requests.post(
            f"subscription/{subscription_code}/manage/link/",
        )

    @classmethod
    def send_update_email(cls, subscription_code):
        """Send an email with which users can update the card on a subscription.

        Args:
            code: Subscription code.

        Returns:
           A confirmation of the email despatch.
        """

        return cls().requests.post(
            f"subscription/{subscription_code}/manage/email/",
        )
