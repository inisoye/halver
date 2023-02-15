import asyncio

from libraries.paystack.base import PaystackBase


class PlanRequests(PaystackBase):
    """Methods for querying and handling Paystack plans."""

    @classmethod
    def create(cls, **kwargs):
        """Create a plan.

        Note: Some params have been left out. Check https://paystack.com/docs/api/#plan.

        Args:
            name: Plan's name.
            amount (int): Amount for the plan in kobo. Kobo if currency is NGN.
                Pesewas, if currency is GHS, and cents, if currency is ZAR
            interval: Plan's interval: daily, weekly, monthly, biannually, annually.
            description: Description of the plan.
            currency: Amount currency. Allowed values are NGN, GHS, ZAR or USD.
            invoice_limit (optional): Number of invoices to raise during subscription
                to this plan.


        Returns:
            JSON response confirming creation.
        """

        return cls().requests.post(
            "plan",
            data=kwargs,
        )

    @classmethod
    async def create_async(cls, **kwargs):
        """Create a plan asynchronously. The request is sent
        asynchronously to facilitate the create_multiple
        method.

        Note: Some params have been left out. Check https://paystack.com/docs/api/#plan.

        Args:
            name: Plan's name.
            amount (int): Amount for the plan in kobo. Kobo if currency is NGN.
                Pesewas, if currency is GHS, and cents, if currency is ZAR
            interval: Plan's interval: daily, weekly, monthly, biannually, annually.
            description: Description of the plan.
            currency: Amount currency. Allowed values are NGN, GHS, ZAR or USD.
            invoice_limit (optional): Number of invoices to raise during subscription
                to this plan.


        Returns:
            JSON response confirming creation.
        """

        response = await cls().requests.post_async(
            "plan",
            data=kwargs,
        )

        return response

    @classmethod
    async def create_multiple(cls, plan_creation_payloads):
        """Create multiple paystack plans by running the
        create method multiple times, concurrently.

        Args:
            plan_creation_payloads: A list of payloads to be used in the creation
                of each plan. Each item should contain the params of create_async.

        Returns:
            A list of created plans.
        """

        # Create a list of tasks that will be run concurrently
        tasks = [
            asyncio.ensure_future(cls().create_async(**plan_creation_payload))
            for plan_creation_payload in plan_creation_payloads
        ]

        # Wait for all tasks to complete
        plans = await asyncio.gather(*tasks)

        # Return the list of created plans
        return plans

    @classmethod
    def fetch(cls, plan_id_or_code):
        """Fetch Plan.

        Args:
            plan_id_or_code: Paystack plan ID or code.

        Returns:
            JSON data for a single plan.
        """

        return cls().requests.get(
            f"plan/{plan_id_or_code}",
        )

    @classmethod
    def list(cls, **kwargs):
        """List plans.

        Args:
            perPage: Records you want to retrieve per page (Integer)
            page: What page you want to retrieve (Integer)
            status: Filter list by plans with specified status.
            interval: Filter list by plans with specified interval.
            amount: Filter list by plans with specified amount.
                Kobo if currency is NGN, Pesewas, if is GHS, and Cents, if ZAR.

        Returns:
            A list of plans.
        """

        return cls().requests.get(
            "plan",
            query_params=kwargs,
        )

    @classmethod
    def update(cls, id_or_code, **kwargs):
        """Update Plan.

        Note: Some params have been left out. Check https://paystack.com/docs/api/#plan.

        Args:
            id_or_code: Paystack plan ID or code.

            name: Plan's name.
            amount: Amount for the plan in kobo. Kobo if currency is NGN.
                    Pesewas, if currency is GHS, and cents, if currency is ZAR
            interval: Plan's interval: daily, weekly, monthly, biannually, annually.
            description: Description of the plan.
            currency: Amount currency. Allowed values are NGN, GHS, ZAR or USD.
            invoice_limit: Number of invoices to raise during subscription to this plan.

        Returns:
            JSON confirming update.
        """

        return cls().requests.put(
            f"plan/{id_or_code}",
            data=kwargs,
        )
