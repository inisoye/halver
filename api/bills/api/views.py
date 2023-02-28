from django.db.models import Q
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from bills.api.permissions import IsCreator, IsCreditor, IsParticipant
from bills.api.serializers import (
    BillCreateSerializer,
    BillDetailSerializer,
    BillDetailsUpdateSerializer,
    BillListSerializer,
)
from bills.models import Bill
from financials.tasks.plans import create_paystack_plans_for_recurring_bills


class BillListCreateView(APIView):
    """View for listing Bills or creating new Bills.

    Accepts GET and POST requests.
    """

    permission_classes = (IsParticipant,)
    serializer_class = BillCreateSerializer
    list_serializer_class = BillListSerializer

    def get(self, request):
        """Retrieves a list of bills for which the current user is a
        participant.

        Args:
            request (rest_framework.request.Request): The HTTP request object.

        Returns:
            Response: A Response object containing a serialized list of Bill
                objects for which the current user is a participant.
        """

        bills = Bill.objects.filter(
            Q(participants=request.user) | Q(creditor=request.user)
        )

        serializer = self.list_serializer_class(
            bills, many=True, context={"request": request}
        )
        return Response(serializer.data)

    @extend_schema(request=None, responses={201: OpenApiResponse()})
    def post(self, request):
        """Creates a new bill and associated actions. If the bill is recurring,
        Paystack plans will also be created for each action.

        Args:
            request (rest_framework.request.Request): The HTTP request object.

        Raises:
            ValidationError: If the serializer data is invalid.

        Returns:
            Response: An empty response with status code 201 (Created) for a
                successful POST request.
        """

        # The request is passed in context to make it possible to obtain the bill's
        # creator, in the serializer.
        # (check the validate_participants_and_unregistered_participants helper).
        serializer = self.serializer_class(
            data=self.request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        new_bill = Bill.create_bill_from_validated_data(
            serializer.validated_data, creator=request.user
        )

        if new_bill.is_recurring:
            create_paystack_plans_for_recurring_bills.delay(new_bill.id)

        return Response(status=status.HTTP_201_CREATED)


class BillDetailUpdateView(APIView):
    """View for getting or updating a single Bill object.

    Accepts GET and PATCH requests.
    """

    serializer_class = BillDetailSerializer
    update_serializer_class = BillDetailsUpdateSerializer

    def get_permissions(self):
        """
        Returns the permission classes to be used for the request.
        """
        if self.request.method == "GET":
            return (IsParticipant(),)
        return (IsCreator(), IsCreditor())

    def get(self, request, uuid):
        """Returns the bill details for a given Bill UUID.

        If the bill is discreet and the requester is neither the bill's
        creditor nor its creator, the discreet ("actions" and "transactions") fields are
        excluded from the response.

        Args:
            request (rest_framework.request.Request): The HTTP request object.
            uuid (str): The UUID of the Bill object to retrieve.

        Raises:
            Http404: If no Bill object with the given UUID exists.

        Returns:
            Response: A Response object containing the serialized Bill object.
        """

        bill = get_object_or_404(Bill, uuid=uuid)

        serializer = self.serializer_class(bill, context={"request": request})

        are_discreet_fields_hidden = (
            bill.is_discreet
            and bill.creator != request.user
            and bill.creditor != request.user
        )

        if are_discreet_fields_hidden:
            discreet_fields = ("actions", "transactions")
            serializer_data_without_discreet_fields = serializer.data.copy()

            for field in discreet_fields:
                serializer_data_without_discreet_fields.pop(field, None)

            return Response(
                serializer_data_without_discreet_fields, status=status.HTTP_200_OK
            )

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(request=None, responses={204: OpenApiResponse()})
    def patch(self, request, uuid):
        """Updates the specified fields in the Bill object with the provided
        UUID.

        Accepts a JSON payload of the fields to update.

        Args:
            request (rest_framework.request.Request): The HTTP request object.
            uuid (str): The UUID of the Bill object to update.

        Raises:
            Http404: If no Bill object with the given UUID exists.

        Returns:
            Response: An empty response with status code 204 (No Content) for a
                successful PATCH request.
        """

        bill = get_object_or_404(Bill, uuid=uuid)

        serializer = self.update_serializer_class(bill, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        for field, value in request.data.items():
            setattr(bill, field, value)
        bill.save(update_fields=request.data.keys())

        return Response(status=status.HTTP_204_NO_CONTENT)
