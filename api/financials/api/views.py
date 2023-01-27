import asyncio

from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
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

from core.utils import get_user_by_id
from financials.api.permissions import IsOwner
from financials.api.serializers import (
    PaystackTransferRecipientListSerializer,
    TransferRecipientCreateSerializer,
    TransferRecipientListSerializer,
    TransferRecipientUpdateDeleteSerializer,
    UserCardSerializer,
)
from financials.models import TransferRecipient, UserCard
from financials.utils.transfer_recipients import (
    format_create_paystack_transfer_recipient_response,
    generate_paystack_transfer_recipient_payload,
    return_readable_recipient_type,
)
from libraries.paystack.transfer_recipient_requests import TransferRecipientRequests


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

        response = TransferRecipientRequests.create(**paystack_payload)

        if response["status"]:
            recipient_type = response["data"]["type"]
            readable_recipient_type = return_readable_recipient_type(recipient_type)

            formatted_paystack_response = (
                format_create_paystack_transfer_recipient_response(response)
            )

            recipient, created = TransferRecipient.objects.get_or_create(
                **formatted_paystack_response,
                user=self.request.user,
            )

            if recipient_type == TransferRecipient.RecipientChoices.CARD:
                associated_card_object = get_object_or_404(
                    UserCard,
                    authorization_code=response["data"]["details"][
                        "authorization_code"
                    ],
                )
                # Join the card model to recipient. Done here for brevity.
                recipient.associated_card = associated_card_object

            recipient.set_as_default_recipient()

            if not created:
                return Response(
                    (
                        f"This {readable_recipient_type} has been previously"
                        f" added to your account on Halver."
                    ),
                    status=status.HTTP_409_CONFLICT,
                )

            return Response(
                status=status.HTTP_201_CREATED,
            )

        else:
            return Response(
                response["message"],
                status=status.HTTP_400_BAD_REQUEST,
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
            instance.delete()
        else:
            raise ValidationError(response["message"])


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
