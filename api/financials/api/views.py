import asyncio

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import (
    DestroyAPIView,
    ListAPIView,
    RetrieveAPIView,
    RetrieveDestroyAPIView,
    UpdateAPIView,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from financials.api.permissions import IsOwner
from financials.api.serializers import (
    TransferRecipientDeleteSerializer,
    TransferRecipientListCreateSerializer,
    UserCardSerializer,
)
from financials.models import TransferRecipient, UserCard
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


class DefaultCardUpdateView(UpdateAPIView):
    """
    View for updating the default card for a user.

    Accepts PUT requests.
    """

    lookup_field = "uuid"
    permission_classes = (IsOwner,)
    queryset = UserCard.objects.all()
    serializer_class = UserCardSerializer

    def update(self) -> Response:
        """
        Sets the card with the given UUID as the default card for the current user.

        Args:
            uuid: The UUID of the card to be set as the default card.

        Returns:
            An empty response.
        """

        card = self.get_object()
        card.set_as_default()
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


class TransferRecipientListCreateAPIView(APIView):
    """
    View for managing transfer recipients.

    Accepts GET and POST requests.
    """

    permission_classes = (IsOwner,)
    serializer_class = TransferRecipientListCreateSerializer

    def get(self) -> Response:
        """
        Handles GET requests to retrieve a list of transfer recipients.

        Returns:
            A list of transfer recipient objects.
        """

        recipient_codes = self.request.user.get_recipient_codes()
        recipients = asyncio.run(
            TransferRecipientRequests.fetch_multiple(recipient_codes)
        )
        return Response(recipients, status=status.HTTP_200_OK)

    def post(self) -> Response:
        """
        Creates a new transfer recipient.

        Returns:
            A dictionary containing the details of the new transfer recipient.
        """

        serializer = TransferRecipientListCreateSerializer(data=self.request.data)

        try:
            serializer.is_valid(raise_exception=True)

            response = TransferRecipientRequests.create(**serializer.validated_data)

            if response["status"]:
                recipient = TransferRecipient.objects.create(
                    recipient_code=response["data"]["recipient_code"],
                    recipient_type=response["data"]["type"],
                    user=self.request.user,
                )

                return Response(
                    TransferRecipientListCreateSerializer(recipient).data,
                    status=status.HTTP_201_CREATED,
                )

            else:
                return Response(
                    response["message"],
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except ValidationError as e:
            return Response(
                e.detail,
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
    serializer_class = TransferRecipientDeleteSerializer

    def perform_destroy(self, instance):
        """
        Deletes a transfer recipient.

        Args:
            instance: The transfer recipient object to delete.

        Returns:
            None
        """

        response = TransferRecipientRequests.delete(instance.recipient_code)

        if response["status"]:
            instance.delete()
        else:
            raise ValidationError(response["message"])
