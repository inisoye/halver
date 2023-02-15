from libraries.paystack.base import PaystackBase


class TransferRequests(PaystackBase):
    """Methods for handling Paystack transfers."""

    @classmethod
    def initiate(cls, **kwargs):
        """Initiate a transfer.

        Args:
            source: Where should we transfer from? Only balance for now
            amount: Amount to transfer in kobo (for NGN), pesewas (for GHC)
            recipient: Code for transfer recipient
            reference: uuidv4 identifier for transfer
            reason: The reason for the transfer
            currency: Currency for transfer (defaultS TO NGN)


        Returns:
            JSON response with confirmation.
        """

        return cls().requests.post(
            "transfer",
            data=kwargs,
        )

    @classmethod
    def list(cls, **kwargs):
        """List all transfers made on integration.

        Args:
            perPage: Records you want to retrieve per page (Integer).
            page: The page you want to retrieve (Integer).
            customer: Filter by customer ID.
            from: Filter transactions by start date.
            to: Filter transactions by end date.

        Returns:
            A list of transfers.
        """

        return cls().requests.get(
            "transfer",
            query_params=kwargs,
        )

    @classmethod
    def fetch(cls, id_or_code):
        """Fetch a transfer.

        Args:
            id_or_code: An id or code for the transfer you want to retrieve.

        Returns:
            A single transfer.
        """

        return cls().requests.get(
            f"transfer/{id_or_code}",
        )

    @classmethod
    def finalize(cls, **kwargs):
        """
        Finalize a transfer.
        Note: This step is not required if OTP is disabled

        Args:
            transfer_code: Transfer code
            otp: OTP sent to business phone to verify transfer

        Returns:
            JSON response with confirmation.
        """

        return cls().requests.post(
            "transfer/finalize_transfer",
            data=kwargs,
        )

    @classmethod
    def initiate_bulk_transfer(cls, **kwargs):
        """Initiate bulk transfer.

        Args:
            currency: Currency type to use
            source: Where should we transfer from? Only "balance" works for now.
            transfers: Array of transfer objects, for example: [
                {
                    amount: Amount to transfer in kobo
                    recipient: Code for transfer recipient
                },
                {
                    amount: Amount to transfer in kobo
                    recipient: Code for transfer recipient
                }
            ]

        Returns:
            JSON response with confirmation.
        """

        return cls().requests.post(
            "transfer/bulk",
            data=kwargs,
        )

    @classmethod
    def verify(cls, reference):
        """Verify a transfer.

        Args:
            reference: The transfer reference.

        Returns:
            Details of the verified transfer.
        """

        return cls().requests.get(
            f"verify/{reference}",
        )
