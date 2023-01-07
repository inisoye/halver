"""
Methods for the Paystack Transfer Recipient feature.
"""

import asyncio

from paystack.base import PaystackBase


class TransferRecipientRequests(PaystackBase):
    @classmethod
    def create(cls, **kwargs):
        """
        Create transfer recipient.

        Should be called after account number has been verified (if nuban).
        Bank codes can be obtained from the List Banks endpoint.

        Args:
            type: Recipient type (nuban or authorization)
            name: A name for the recipient
            account_number: Required if type is nuban
            bank_code: Required if type is nuban.
            email: Required if type is authorization,
            authorization_code: Required if type is authorization,

            **kwargs

        Returns:
            The created transfer recipient
        """

        return cls().requests.post(
            "transferrecipient",
            data=kwargs,
        )

    @classmethod
    def list(cls, **kwargs):
        """
        List transfer recipients.

        Args:
            perPage: records you want to retrieve per page (Integer)
            page: what page you want to retrieve (Integer)

        Returns:
            A list of transfer recipients.
        """

        return cls().requests.get(
            "transferrecipient",
            query_params=kwargs,
        )

    @classmethod
    def fetch(cls, id_or_code):
        """
        Get a single transfer recipient.

        Args:
            id_or_code: An ID or code for the recipient
            whose details you want to obtain.

        Returns:
            A single transfer recipient.
        """

        return cls().requests.get(
            f"transferrecipient/{id_or_code}",
        )

    @classmethod
    def delete(cls, id_or_code):
        """
        Delete a single transfer recipient.

        Args:
            id_or_code: An ID or code for the recipient
            whose details you want to delete.

        Returns:
            A JSON deletion confirmation.
        """

        return cls().requests.delete(
            f"transferrecipient/{id_or_code}",
        )

    @classmethod
    async def fetch_async(cls, id_or_code):
        """
        Asynchronously get a single transfer recipient.
        The request is sent asynchronously to facilitate the fetch multiple method.


        Args:
            id_or_code: An ID or code for the recipient
            whose details you want to obtain.

        Returns:
            A single transfer recipient.
        """

        # Send the request asynchronously
        response = await cls().requests.get_async(
            f"transferrecipient/{id_or_code}",
        )

        # Return the response
        return response

    @classmethod
    async def fetch_multiple(cls, recipient_codes):
        """
        Get multiple, specified transfer recipients by running
        the fetch method multiple times concurrently.

        Args:
            recipient_codes: A list of the codes for transfer recipients
            to be obtained.

        Returns:
            A list of transfer recipients.
        """

        # Create a list of tasks that will be run concurrently
        tasks = [
            asyncio.ensure_future(cls().fetch_async(recipient_code))
            for recipient_code in recipient_codes
        ]

        # Wait for all tasks to complete
        recipients = await asyncio.gather(*tasks)

        # Return the list of recipients
        return recipients
