import asyncio

from libraries.flutterwave.base import FlutterwaveBase


class TransferBeneficiariesRequests(FlutterwaveBase):
    """Methods for initializing a Flutterwave payment."""

    @classmethod
    def create(cls, **kwargs):
        """Create transfer beneficiary.

        Should be called after account number has been verified (if nuban).
        Bank codes can be obtained from the List Banks endpoint.

        Args:
            account_bank: Bank numeric code. Obtained from /get banks endpoint.
            account_number: Account number of the customer.
            beneficiary_name: The name of the beneficiary.

        Returns:
            The created transfer recipient
        """

        return cls().requests.post(
            "beneficiaries",
            data=kwargs,
        )

    @classmethod
    def list(cls, **kwargs):
        """List transfer beneficiaries.

        Args:
            page (optional) (integer): The page you want to retrieve.

        Returns:
            A list of transfer beneficiaries.
        """

        return cls().requests.get(
            "beneficiaries",
            query_params=kwargs,
        )

    @classmethod
    def delete(cls, id):
        """Delete a single transfer beneficiary.

        Args:
            id: The id for the beneficiary whose details you want to delete.

        Returns:
            A JSON deletion confirmation.
        """

        return cls().requests.delete(
            f"beneficiaries/{id}",
        )

    @classmethod
    async def fetch_async(cls, id):
        """Asynchronously get a single transfer beneficiary. The request is sent
        asynchronously to facilitate the fetch multiple method.

        Args:
            id: An ID or code for the beneficiary
            whose details you want to obtain.

        Returns:
            A single transfer beneficiary.
        """

        # Send the request asynchronously
        response = await cls().requests.get_async(
            f"beneficiaries/{id}",
        )

        # Return the response
        return response

    @classmethod
    async def fetch_multiple(cls, beneficiary_ids):
        """Get multiple, specified transfer beneficiaries by running the fetch
        method multiple times concurrently.

        Args:
            beneficiary_ids: A list of the ids for the transfer beneficiaries
            to be obtained.

        Returns:
            A list of transfer beneficiaries.
        """

        # Create a list of tasks that will be run concurrently
        tasks = [
            asyncio.ensure_future(cls().fetch_async(beneficiary_id))
            for beneficiary_id in beneficiary_ids
        ]

        # Wait for all tasks to complete
        beneficiaries = await asyncio.gather(*tasks)

        # Return the list of beneficiaries
        return beneficiaries
