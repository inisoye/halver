from paystack.base import PaystackBase


class PlanRequests(PaystackBase):
    """
    Methods for querying and handling Paystack plans.
    """

    @classmethod
    def create(cls, **kwargs):
        """
        Create a plan.

        Note: Some params have been left out. Check https://paystack.com/docs/api/#plan.

        Args:
            name: Plan's name.
            amount: Amount for the plan in kobo. Kobo if currency is NGN.
                    Pesewas, if currency is GHS, and cents, if currency is ZAR
            interval: Plan's interval: daily, weekly, monthly, biannually, annually.
            description: Description of the plan.
            currency: Amount currency. Allowed values are NGN, GHS, ZAR or USD.
            invoice_limit: Number of invoices to raise during subscription to this plan.


        Returns:
            JSON response confirming creation.
        """

        return cls().requests.post(
            "plan",
            data=kwargs,
        )

    @classmethod
    def fetch(cls, plan_id_or_code):
        """
        Fetch Plan.

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
        """
        List plans.

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
    def update(cls, plan_id_or_code, **kwargs):
        """
        Update Plan.

        Note: Some params have been left out. Check https://paystack.com/docs/api/#plan.

        Args:
            plan_id_or_code: Paystack plan ID or code.

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
            f"plan/{plan_id_or_code}",
            data=kwargs,
        )
