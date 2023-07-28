import asyncio

from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiResponse, extend_schema, inline_serializer
from rest_framework import serializers, status
from rest_framework.filters import OrderingFilter
from rest_framework.generics import (
    DestroyAPIView,
    ListAPIView,
    RetrieveAPIView,
    RetrieveDestroyAPIView,
    UpdateAPIView,
)
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from core.utils.responses import format_exception
from core.utils.users import get_user_by_id_drf
from financials.api.permissions import IsOwner, IsPaystack
from financials.api.serializers import (
    FailedAndReversedPaystackTransfersSerializer,
    PaystackAccountNumberCheckSerializer,
    PaystackBankListSerializer,
    PaystackTransferRecipientListSerializer,
    PaystackTransferRetrySerializer,
    TransferRecipientCreateSerializer,
    TransferRecipientListSerializer,
    TransferRecipientUpdateDeleteSerializer,
    UserCardListSerializer,
    UserCardSerializer,
)
from financials.data.banks import all_banks
from financials.models import PaystackTransfer, TransferRecipient, UserCard
from financials.utils.cards import generate_add_card_paystack_payload
from financials.utils.paystack_webhook import handle_paystack_webhook_response
from financials.utils.transfer_recipients import (
    create_local_and_remote_transfer_recipient,
    generate_paystack_transfer_recipient_payload,
)
from libraries.paystack.bank_requests import BankRequests
from libraries.paystack.transaction_requests import TransactionRequests
from libraries.paystack.transfer_recipient_requests import TransferRecipientRequests
from libraries.paystack.transfer_requests import TransferRequests


class PaystackWebhookHandlerAPIView(APIView):
    """View for handling Paystack webhooks.

    Accepts POST requests.
    """

    permission_classes = (IsPaystack,)

    @extend_schema(responses={200: OpenApiResponse()})
    def post(self, request):
        """Method to handle webhook requests made by Paystack."""

        request_data = request.data

        handle_paystack_webhook_response(request_data)

        return Response(status=status.HTTP_200_OK)


class PaystackAccountNumberCheckAPIView(APIView):
    """View for resolving a person's account number.

    Accepts GET requests.
    """

    serializer_class = PaystackAccountNumberCheckSerializer

    def post(self, request) -> Response:
        """Validate a person's full account details.

        Returns:
            The customer's account details.
        """

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        response = BankRequests.resolve_account_number(
            account_number=serializer.validated_data.get("account_number"),
            bank_code=serializer.validated_data.get("bank_code"),
        )

        if response["status"]:
            return Response(response, status=status.HTTP_200_OK)

        else:
            return format_exception(
                message=response["message"],
                status=status.HTTP_400_BAD_REQUEST,
            )


class PaystackBanksListAPIView(APIView):
    """View for obtaining a list of all banks supported by Paystack and their logos.
    The data returned is static and should be updated periodically with helper functions.

    Accepts GET requests.
    """

    serializer_class = PaystackBankListSerializer

    def get(self, request) -> Response:
        """Handles GET requests to retrieve a list of banks.

        Returns:
            A list of bank objects.
        """

        # Serializer validation not added as data is static.
        return Response(all_banks, status=status.HTTP_200_OK)


class DefaultCardRetrieveAPIView(RetrieveAPIView):
    """View for retrieving the default card for a user.

    Accepts GET requests.
    """

    permission_classes = (IsOwner,)
    queryset = UserCard.objects.all().defer("complete_paystack_response")
    serializer_class = UserCardSerializer

    def get_object(self):
        """Returns the default card for the current user.

        Returns:
            The default card object.
        """

        user = self.request.user
        queryset = user.cards.filter(is_default=True)
        get_object_or_404(queryset)


@extend_schema(request=None, responses={204: OpenApiResponse()})
class DefaultCardUpdateAPIView(UpdateAPIView):
    """View for updating the default card for a user.

    Accepts PATCH requests.
    """

    lookup_field = "uuid"
    permission_classes = (IsOwner,)
    queryset = UserCard.objects.all().defer("complete_paystack_response")
    serializer_class = UserCardSerializer
    http_method_names = ["patch"]

    def partial_update(self, request, uuid) -> Response:
        """Sets the card with the given UUID as the default card for the current
        user."""

        card = self.get_object()
        card.set_as_default_card()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserCardAdditionTransactionAPIView(APIView):
    """View for obtaining the Paystack transaction URL for a card addition.

    Accepts GET requests.
    """

    @extend_schema(
        responses={
            200: inline_serializer(
                name="UserCardAdditionResponse",
                fields={
                    "status": serializers.BooleanField(),
                    "message": serializers.CharField(),
                    "data": serializers.DictField(child=serializers.CharField()),
                },
            ),
        },
    )
    def get(self, request) -> Response:
        """Initializes a Paystack transaction strictly for card addition.

        Returns:
            JSON response from Paystack.
        """

        user = self.request.user

        CARD_ADDITION_CHARGE_AMOUNT = 60

        paystack_payload = generate_add_card_paystack_payload(
            CARD_ADDITION_CHARGE_AMOUNT, user
        )

        response = TransactionRequests.initialize(**paystack_payload)

        if response["status"]:
            return Response(response, status=status.HTTP_200_OK)

        else:
            return format_exception(
                message=response["message"],
                status=status.HTTP_400_BAD_REQUEST,
            )


class UserCardListAPIView(ListAPIView):
    """View for listing all cards for a user.

    Accepts GET requests.
    """

    permission_classes = (IsOwner,)
    queryset = UserCard.objects.all().defer("complete_paystack_response")
    serializer_class = UserCardListSerializer

    def get_queryset(self):
        """Returns a queryset containing all cards for the current user."""

        return self.queryset.filter(user=self.request.user)


class UserCardRetrieveDestroyAPIView(RetrieveDestroyAPIView):
    """View for retrieving and deleting a specific card for a user.

    Accepts GET and DELETE requests.
    """

    lookup_field = "uuid"
    permission_classes = (IsOwner,)
    queryset = UserCard.objects.all().defer("complete_paystack_response")
    serializer_class = UserCardSerializer


class PaystackTransferRecipientListAPIView(APIView):
    """View for obtaining a specified user's transfer recipients directly from
    the Paystack API. Could be used to check any user's added data.

    Accepts GET requests.
    """

    permission_classes = (IsAdminUser,)
    serializer_class = PaystackTransferRecipientListSerializer

    @extend_schema(
        parameters=[PaystackTransferRecipientListSerializer],
        responses={
            200: OpenApiResponse(description="Recipients obtained successfully."),
        },
    )
    def get(self, request) -> Response:
        """Handles GET requests to retrieve a list of transfer recipients.

        Returns:
            A list of transfer recipient objects.
        """

        serializer = self.serializer_class(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        user_id = serializer.validated_data.get("user_id")

        user = get_user_by_id_drf(user_id)

        recipient_codes = user.get_recipient_codes()
        recipients = asyncio.run(
            TransferRecipientRequests.fetch_multiple(recipient_codes)
        )
        return Response(recipients, status=status.HTTP_200_OK)


class TransferRecipientListCreateAPIView(APIView):
    """View for managing transfer recipients.

    Accepts GET and POST requests.
    """

    permission_classes = (IsOwner,)
    serializer_class = TransferRecipientListSerializer
    list_serializer_class = TransferRecipientListSerializer
    create_serializer_class = TransferRecipientCreateSerializer
    queryset = TransferRecipient.objects.select_related("associated_card").defer(
        "complete_paystack_response"
    )

    def get(self, request) -> Response:
        """Retrieves a list of all transfer recipients for the current user.

        Returns:
            A list of transfer recipients for the current user in JSON format,
            with a status code of 200.
        """

        recipients = self.queryset.filter(user=self.request.user)
        serializer = self.list_serializer_class(recipients, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            201: OpenApiResponse(),
            400: OpenApiResponse(description="Bad request (Something invalid)"),
            404: OpenApiResponse(description="Not found"),
            409: OpenApiResponse(description="Recipient has been added previously"),
        },
    )
    def post(self, request) -> Response:
        """Creates a new transfer recipient.

        Returns:
            An empty response.
        """

        serializer = self.create_serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        paystack_payload = generate_paystack_transfer_recipient_payload(
            serializer.validated_data
        )

        return create_local_and_remote_transfer_recipient(
            paystack_payload, user=self.request.user
        )


class TransferRecipientsDestroyAPIView(DestroyAPIView):
    """View for deleting transfer recipients.

    Accepts DELETE requests.
    """

    lookup_field = "recipient_code"
    permission_classes = (IsOwner,)
    queryset = TransferRecipient.objects.all().defer("complete_paystack_response")
    serializer_class = TransferRecipientUpdateDeleteSerializer

    def perform_destroy(self, instance):
        """Deletes a transfer recipient."""

        response = TransferRecipientRequests.delete(instance.recipient_code)

        if response["status"]:
            instance.delete_and_set_newest_as_default()

        else:
            return format_exception(
                message=response["message"],
                status=status.HTTP_400_BAD_REQUEST,
            )


class DefaultTransferRecipientRetrieveAPIView(RetrieveAPIView):
    """View for retrieving the default transfer recipient for a user.

    Accepts GET requests.
    """

    permission_classes = (IsOwner,)
    queryset = TransferRecipient.objects.all().defer("complete_paystack_response")
    serializer_class = TransferRecipientListSerializer
    http_method_names = ["get"]

    def get_object(self):
        """Returns the default transfer recipient for the current user."""

        user = self.request.user
        queryset = user.transfer_recipients.filter(is_default=True)
        return get_object_or_404(queryset)


@extend_schema(request=None, responses={204: OpenApiResponse()})
class DefaultTransferRecipientUpdateAPIView(UpdateAPIView):
    """View for updating the default transfer recipient for a user.

    Accepts PATCH requests.
    """

    lookup_field = "uuid"
    permission_classes = (IsOwner,)
    queryset = TransferRecipient.objects.all().defer("complete_paystack_response")
    serializer_class = TransferRecipientUpdateDeleteSerializer
    http_method_names = ["patch"]

    def partial_update(self, request, uuid) -> Response:
        """Sets the recipient with the given UUID as the default recipient for
        the current user."""

        transfer_recipient = self.get_object()
        transfer_recipient.set_as_default_recipient()

        return Response(status=status.HTTP_204_NO_CONTENT)


class FailedAndReversedPaystackTransfersListAPIView(ListAPIView):
    """View for listing failed and reversed transfers made by a user.

    Accepts GET requests.
    """

    serializer_class = FailedAndReversedPaystackTransfersSerializer
    filter_backends = (OrderingFilter,)
    ordering_fields = ("created",)
    ordering = ("-created",)

    def get_queryset(self):
        return PaystackTransfer.get_failed_and_reversed_transfers(self.request.user)


class PaystackTransferRetryAPIView(APIView):
    """View for retrying failed and reversed transfers.

    Accepts GET and POST requests.
    """

    serializer_class = PaystackTransferRetrySerializer

    def post(self, request) -> Response:
        """Retries a failed or reversed transfer.

        Returns:
            A response indicating the status of the retry.
        """

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        paystack_transfer_reference = serializer.validated_data.get(
            "paystack_transfer_reference"
        )

        paystack_transfer_payload = {
            "source": "balance",
            "amount": serializer.validated_data.get("amount"),
            "recipient": serializer.validated_data.get("recipient_code"),
            "reason": serializer.validated_data.get("reason"),
            "reference": paystack_transfer_reference,
        }

        response = TransferRequests.initiate(**paystack_transfer_payload)

        if response["status"]:
            retried_transfer = PaystackTransfer.objects.get(
                paystack_transfer_reference=paystack_transfer_reference
            )
            retried_transfer.mark_as_retried()

            return Response(response, status=status.HTTP_200_OK)

        else:
            return format_exception(
                message=response["message"],
                status=status.HTTP_400_BAD_REQUEST,
            )
