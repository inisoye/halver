import asyncio
import json

from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
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
from core.utils.users import get_user_by_id
from financials.api.permissions import IsOwner, IsPaystack
from financials.api.serializers import (
    PaystackTransferRecipientListSerializer,
    TransferRecipientCreateSerializer,
    TransferRecipientListSerializer,
    TransferRecipientUpdateDeleteSerializer,
    UserCardSerializer,
)
from financials.models import TransferRecipient, UserCard
from financials.tasks import process_card_creation
from financials.utils.cards import generate_add_card_paystack_payload
from financials.utils.transfer_recipients import (
    generate_paystack_transfer_recipient_payload,
    handle_complete_transfer_recipient_creation,
)
from libraries.paystack.transaction_requests import TransactionRequests
from libraries.paystack.transfer_recipient_requests import TransferRecipientRequests


class PaystackWebhookHandlerAPIView(APIView):
    """
    View for handling Paystack webhooks.

    Accepts POST requests.
    """

    permission_classes = (IsPaystack,)

    @extend_schema(responses={200: OpenApiResponse()})
    def post(self, request):
        """
        Method to handle webhook requests made by Paystack.
        """

        request_data = request.data

        event = request_data.get("event")
        data = request_data.get("data")

        print(json.dumps(request_data))

        if event == "charge.success":
            authorization = data.get("authorization")
            customer = data.get("customer")
            metadata = data.get("metadata")

            user_id = metadata.get("user_id")
            is_card_addition = metadata.get("is_card_addition") == "true"

            if is_card_addition:
                process_card_creation.delay(
                    authorization,
                    customer,
                    user_id,
                    data,
                    metadata,
                    request_data,
                )

        return Response(status=status.HTTP_200_OK)


class DefaultCardRetrieveView(RetrieveAPIView):
    """
    View for retrieving the default card for a user.

    Accepts GET requests.
    """

    permission_classes = (IsOwner,)
    queryset = UserCard.objects.all()
    serializer_class = UserCardSerializer

    def get_object(self):
        """
        Returns the default card for the current user.

        Returns:
            The default card object.
        """

        user = self.request.user
        queryset = user.cards.filter(is_default=True)
        get_object_or_404(queryset)


@extend_schema(request=None, responses={204: OpenApiResponse()})
class DefaultCardUpdateView(UpdateAPIView):
    """
    View for updating the default card for a user.

    Accepts PUT requests.
    """

    lookup_field = "uuid"
    permission_classes = (IsOwner,)
    queryset = UserCard.objects.all()
    serializer_class = UserCardSerializer
    http_method_names = ["patch"]

    def partial_update(self, request, uuid) -> Response:
        """
        Sets the card with the given UUID as the default card for the current user.

        Args:
            uuid: The UUID of the card to be set as the default card.

        Returns:
            An empty response.
        """

        card = self.get_object()
        card.set_as_default_card()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserCardAdditionTransactionAPIView(APIView):
    """
    View for handling the Paystack transaction for card addition.

    Accepts POST requests.
    """

    @extend_schema(
        responses={
            200: OpenApiResponse(description="Transaction initialized successfully."),
        },
    )
    def post(self, request) -> Response:
        """
        Initializes a Paystack transaction strictly for card addition.

        Returns:
            JSON response from Paystack.
        """

        user = self.request.user

        CARD_ADDITION_CHARGE_AMOUNT = 60

        paystack_payload = generate_add_card_paystack_payload(
            CARD_ADDITION_CHARGE_AMOUNT, user
        )

        response = TransactionRequests.initialize(**paystack_payload)

        return Response(response, status=status.HTTP_200_OK)


class UserCardListView(ListAPIView):
    """
    View for listing all cards for a user.

    Accepts GET requests.
    """

    permission_classes = (IsOwner,)
    queryset = UserCard.objects.all()
    serializer_class = UserCardSerializer

    def get_queryset(self):
        """
        Returns a queryset containing all cards for the current user.

        Returns:
            A queryset of card objects for current user.
        """
        return self.queryset.filter(user=self.request.user)


class UserCardRetrieveDestroyView(RetrieveDestroyAPIView):
    """
    View for retrieving and deleting a specific card for a user.

    Accepts GET and DELETE requests.
    """

    lookup_field = "uuid"
    permission_classes = (IsOwner,)
    queryset = UserCard.objects.all()
    serializer_class = UserCardSerializer


class PaystackTransferRecipientListAPIView(APIView):
    """
    View for obtaining a specified user's transfer recipients directly
    from the Paystack API. Could be used to check any user's added data.

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
        """
        Handles GET requests to retrieve a list of transfer recipients.

        Returns:
            A list of transfer recipient objects.
        """

        serializer = self.serializer_class(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        user_id = serializer.validated_data.get("user_id")

        user = get_user_by_id(user_id)

        recipient_codes = user.get_recipient_codes()
        recipients = asyncio.run(
            TransferRecipientRequests.fetch_multiple(recipient_codes)
        )
        return Response(recipients, status=status.HTTP_200_OK)


class TransferRecipientListCreateAPIView(APIView):
    """
    View for managing transfer recipients.

    Accepts GET and POST requests.
    """

    permission_classes = (IsOwner,)
    serializer_class = TransferRecipientListSerializer
    list_serializer_class = TransferRecipientListSerializer
    create_serializer_class = TransferRecipientCreateSerializer
    queryset = TransferRecipient.objects.all()

    def get(self, request) -> Response:
        """
        Retrieves a list of all transfer recipients for the current user.

        Returns:
            A list of transfer recipients for the current user in JSON format,
            with a status code of 200.
        """

        queryset = self.queryset.filter(user=self.request.user)
        serializer = self.list_serializer_class(queryset, many=True)

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
        """
        Creates a new transfer recipient.

        Returns:
            An empty response.
        """

        serializer = self.create_serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        paystack_payload = generate_paystack_transfer_recipient_payload(
            serializer.validated_data
        )

        return handle_complete_transfer_recipient_creation(
            paystack_payload, user=self.request.user
        )


class TransferRecipientsDestroyView(DestroyAPIView):
    """
    View for deleting transfer recipients.

    Accepts DELETE requests.
    """

    lookup_field = "recipient_code"
    permission_classes = (IsOwner,)
    queryset = TransferRecipient.objects.all()
    serializer_class = TransferRecipientUpdateDeleteSerializer

    def perform_destroy(self, instance):
        """
        Deletes a transfer recipient.

        Args:
            instance: The transfer recipient object to be deleted.

        Returns:
            An empty response.
        """

        response = TransferRecipientRequests.delete(instance.recipient_code)

        if response["status"]:
            instance.delete_and_set_newest_as_default()

        else:
            return format_exception(
                message=response["message"],
                status=status.HTTP_400_BAD_REQUEST,
            )


class DefaultTransferRecipientRetrieveView(RetrieveAPIView):
    """
    View for retrieving the default transfer recipient for a user.

    Accepts GET requests.
    """

    permission_classes = (IsOwner,)
    queryset = TransferRecipient.objects.all()
    serializer_class = TransferRecipientListSerializer
    http_method_names = ["get"]

    def get_object(self):
        """
        Returns the default transfer recipient for the current user.

        Returns:
            The default transfer recipient object.
        """

        user = self.request.user
        queryset = user.transfer_recipients.filter(is_default=True)
        return get_object_or_404(queryset)


@extend_schema(request=None, responses={204: OpenApiResponse()})
class DefaultTransferRecipientUpdateView(UpdateAPIView):
    """
    View for updating the default transfer recipient for a user.

    Accepts PUT requests.
    """

    lookup_field = "uuid"
    permission_classes = (IsOwner,)
    queryset = TransferRecipient.objects.all()
    serializer_class = TransferRecipientUpdateDeleteSerializer
    http_method_names = ["patch"]

    def partial_update(self, request, uuid) -> Response:
        """
        Sets the recipient with the given UUID as the default recipient
        for the current user.

        Args:
            uuid: The UUID of the recipient to be set as the default recipient.

        Returns:
            An empty response.
        """

        transfer_recipient = self.get_object()
        transfer_recipient.set_as_default_recipient()

        return Response(status=status.HTTP_204_NO_CONTENT)
