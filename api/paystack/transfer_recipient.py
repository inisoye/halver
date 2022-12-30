"""
Methods for the Paystack Transfer Recipient feature.
"""

from .base import PaystackBase


class TransferRecipient(PaystackBase):
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
            qs=kwargs,
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
