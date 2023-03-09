from django.http import HttpResponseNotFound
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
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
from bills.utils.contributions import handle_bill_contribution
from core.utils.responses import format_exception
from financials.tasks.plans import create_paystack_plans_for_recurring_bills


class BillListCreateView(ListCreateAPIView):
    """View for listing Bills or creating new Bills.

    Accepts GET and POST requests.
    """

    permission_classes = (IsParticipantOrCreditor,)
    serializer_class = BillCreateSerializer
    list_serializer_class = BillListSerializer

    def get_queryset(self):
        return Bill.get_users_bills_with_status_info(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "GET":
            return self.list_serializer_class

        return self.serializer_class

    def perform_create(self, serializer):
        new_bill = Bill.create_bill_from_validated_data(
            serializer.validated_data, creator=self.request.user
        )

        # If the bill is recurring, Paystack plans will also be created for each action.
        if new_bill.is_recurring:
            create_paystack_plans_for_recurring_bills.delay(new_bill.id)


class BillDetailUpdateView(APIView):
    """View for getting or updating a single Bill object.

    Accepts GET and PATCH requests.
    """

    serializer_class = BillDetailSerializer
    update_serializer_class = BillDetailsUpdateSerializer

    def get_permissions(self):
        if self.request.method == "PATCH":
            return [IsCreditorOrCreator()]
        return [IsParticipantOrCreditor()]

    def get_serializer_class(self):
        if self.request.method == "PATCH":
            return self.update_serializer_class
        return self.serializer_class

    def get(self, request, uuid):
        """Returns the bill details for a given Bill UUID.

        If the bill is discreet and the requester is neither the bill's
        creditor nor its creator, the discreet ("actions" and "transactions") fields are
        excluded from the response.
        """

        bill = Bill.get_bill_with_details(uuid)

        if bill is None:
            # Handle the case where the bill with the given uuid does not exist.
            return HttpResponseNotFound()

        # Check object-level permissions
        self.check_object_permissions(request, bill)

        serializer = self.serializer_class(bill, context={"request": request})

        are_discreet_fields_hidden = (
            bill.is_discreet
            and bill.creator != request.user
            and bill.creditor != request.user
        )

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
        """

        bill = get_object_or_404(Bill, uuid=uuid)

        # Check object-level permissions
        self.check_object_permissions(request, bill)

        serializer = self.serializer_class(bill, data=request.data, partial=True)
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

        actions_queryset = BillAction.objects.select_related(
            "bill", "bill__creditor", "participant"
        ).filter(uuid=uuid)
        action = get_object_or_404(actions_queryset)

        # Check object-level permissions
        self.check_object_permissions(request, action)

        serializer = self.serializer_class(action, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        has_participant_agreed = request.data.get("has_participant_agreed")
        if not has_participant_agreed:
            action.opt_out_of_bill()
            return Response(status=status.HTTP_204_NO_CONTENT)

        has_paid_before = action.paystack_transactions.exists()
        if has_paid_before:
            return format_exception(
                "A payment has already been made by you on this bill.",
                status=status.HTTP_409_CONFLICT,
            )

        response = handle_bill_contribution(action)

        if response["status"]:
            return Response(response, status=status.HTTP_200_OK)

        else:
            return format_exception(
                message=response["message"],
                status=status.HTTP_400_BAD_REQUEST,
            )
