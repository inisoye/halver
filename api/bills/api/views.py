from django.db.models import Q
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from bills.api.permissions import (
    IsCreditorOrCreator,
    IsParticipantOrCreditor,
    IsRegisteredParticipant,
    ParticipantHasDefaultCard,
)
from bills.api.serializers import (
    ActionResponseUpdateSerializer,
    BillCreateSerializer,
    BillDetailSerializer,
    BillDetailsUpdateSerializer,
    BillListSerializer,
)
from bills.models import Bill, BillAction
from bills.utils.actions import handle_bill_contribution
from core.utils.responses import format_exception
from financials.tasks.plans import create_paystack_plans_for_recurring_bills


class BillListCreateView(APIView):
    """View for listing Bills or creating new Bills.

    Accepts GET and POST requests.
    """

    permission_classes = (IsParticipantOrCreditor,)
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

    permission_classes = IsCreditorOrCreator
    serializer_class = BillDetailSerializer
    update_serializer_class = BillDetailsUpdateSerializer

    def get_permissions(self):
        """
        Returns the permission classes to be used for the request.
        """
        if self.request.method == "GET":
            permissions = [IsParticipantOrCreditor()]
        else:
            permissions = [IsCreditorOrCreator()]

        return permissions

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

        # Check object-level permissions
        self.check_object_permissions(request, bill)

        serializer = self.serializer_class(bill, context={"request": request})

        are_discreet_fields_hidden = (
            bill.is_discreet
            and bill.creator != request.user
            and bill.creditor != request.user
        )

        # TODO ensure all discreet fields are added to this list.
        if are_discreet_fields_hidden:
            DISCREET_FIELDS = ("actions", "transactions")
            serializer_data_without_discreet_fields = serializer.data.copy()

            for field in DISCREET_FIELDS:
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

        # Check object-level permissions
        self.check_object_permissions(request, bill)

        serializer = self.update_serializer_class(bill, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        for field, value in request.data.items():
            setattr(bill, field, value)
        bill.save(update_fields=request.data.keys())

        return Response(status=status.HTTP_204_NO_CONTENT)


# TODO Add logic or an additional view that converts unregistered participants to
# registered participants


class ActionResponseUpdateView(APIView):
    """ """

    permission_classes = (IsRegisteredParticipant, ParticipantHasDefaultCard)
    serializer_class = ActionResponseUpdateSerializer

    def patch(self, request, uuid):
        """ """

        action = get_object_or_404(BillAction, uuid=uuid)

        # Check object-level permissions
        self.check_object_permissions(request, action)

        serializer = self.serializer_class(action, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        has_participant_agreed = request.data.get("has_participant_agreed")

        if not has_participant_agreed:
            action.opt_out_of_bill()
            return Response(status=status.HTTP_204_NO_CONTENT)

        response = handle_bill_contribution(action)

        if response["status"]:
            return Response(response, status=status.HTTP_200_OK)

        else:
            return format_exception(
                message=response["message"],
                status=status.HTTP_400_BAD_REQUEST,
            )
