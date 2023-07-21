import asyncio

from django.db.models import Q
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import serializers, status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from bills.api.permissions import (
    IsCreditorOrCreator,
    IsOwningParticipant,
    IsOwningParticipantOrCreditor,
    IsOwningParticipantOrCreditorOrCreator,
    IsParticipantOrCreditor,
    ParticipantHasDefaultCard,
)
from bills.api.serializers import (
    BillActionResponseUpdateSerializer,
    BillActionStatusCountSerializer,
    BillActionStatusListSerializer,
    BillArrearListSerializer,
    BillArrearResponseUpdateSerializer,
    BillCreateResponseSerializer,
    BillCreateSerializer,
    BillDetailSerializer,
    BillDetailsUpdateSerializer,
    BillListSerializer,
    BillTransactionSerializer,
    BillUnregisteredParticipantListSerializer,
    BillUnregisteredParticipantsDataTransferSerializer,
)
from bills.models import (
    Bill,
    BillAction,
    BillArrear,
    BillTransaction,
    BillUnregisteredParticipant,
)
from bills.utils.arrears import handle_arrear_contribution
from bills.utils.participants import transfer_unregistered_participant_data
from core.utils.responses import format_exception
from financials.tasks.plans import create_paystack_plans_for_recurring_bills
from financials.utils.contributions import handle_bill_contribution
from financials.utils.subscriptions import (
    format_disable_subscriptions_payloads,
    get_action_ids_to_be_ignored,
)
from libraries.paystack.subscription_requests import SubscriptionRequests


class BillListCreateAPIView(ListCreateAPIView):
    """View for listing Bills or creating new Bills.

    Accepts GET and POST requests.
    """

    permission_classes = (IsParticipantOrCreditor,)
    serializer_class = BillCreateSerializer
    create_response_serializer_class = BillCreateResponseSerializer
    list_serializer_class = BillListSerializer
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ("name",)
    ordering_fields = ("created", "name")
    ordering = ("-created",)

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

        return new_bill

    # Create method overriden to control response after bill creation:
    # https://stackoverflow.com/a/69395096
    # https://www.cdrf.co/3.14/rest_framework.generics/ListCreateAPIView.html#create
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        created_bill = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        serialized_created_bill = self.create_response_serializer_class(
            created_bill
        ).data
        return Response(
            serialized_created_bill, status=status.HTTP_201_CREATED, headers=headers
        )


class BillRetrieveUpdateAPIView(APIView):
    """View for getting or updating a single Bill object.

    Accepts GET and PATCH requests.
    """

    serializer_class = BillDetailSerializer
    update_serializer_class = BillDetailsUpdateSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsParticipantOrCreditor()]
        return [IsCreditorOrCreator()]

    def get(self, request, uuid):
        """Returns the bill details for a given Bill UUID.

        If the bill is discreet and the requester is neither the bill's creditor
        nor its creator, the discreet ("actions" and "transactions") fields are
        excluded from the response.
        """

        bill = Bill.get_bill_with_details(uuid)

        if bill is None:
            return format_exception(
                message="No bill found", status=status.HTTP_404_NOT_FOUND
            )

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

        Accepts a JSON payload of the fields to update.
        """

        bill = get_object_or_404(Bill, uuid=uuid)

        self.check_object_permissions(request, bill)

        serializer = self.update_serializer_class(bill, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        for field, value in request.data.items():
            setattr(bill, field, value)
        bill.save(update_fields=request.data.keys())

        return Response(status=status.HTTP_204_NO_CONTENT)


class BillCancellationAPIView(APIView):
    """View for cancelling a bill.

    Accepts PATCH requests.
    """

    permission_classes = (IsCreditorOrCreator,)

    def patch(self, request, uuid):
        """Cancels a bill by setting all its actions to cancelled and disabling any
        Paystack subscriptions associated with it.
        """

        bill_queryset = Bill.objects.filter(uuid=uuid).prefetch_related(
            "actions", "actions__paystack_subscription"
        )
        bill = get_object_or_404(bill_queryset)

        self.check_object_permissions(request, bill)

        if bill.status["long"] == "Bill cancelled":
            return format_exception(
                message="This bill has already been cancelled",
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not bill.is_recurring:
            bill.actions.update(status=BillAction.StatusChoices.CANCELLED)
            return Response(status=status.HTTP_204_NO_CONTENT)

        bill_actions = bill.actions.all()

        disable_subscriptions_payloads = format_disable_subscriptions_payloads(
            bill_actions
        )

        disable_subscriptions_responses = asyncio.run(
            SubscriptionRequests.disable_multiple(disable_subscriptions_payloads)
        )

        # Detect subscriptions that were not successfully disabled.
        action_ids_to_be_ignored = get_action_ids_to_be_ignored(
            disable_subscriptions_responses, bill_actions
        )

        # Cancel only actions associated with subscriptions that have been disabled.
        bill_actions.filter(~Q(id__in=action_ids_to_be_ignored)).update(
            status=BillAction.StatusChoices.CANCELLED
        )

        if action_ids_to_be_ignored:
            return format_exception(
                message=(
                    "Some subscriptions were not successfully cancelled. Try cancelling"
                    " them individually or try again later."
                ),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        else:
            return Response(
                "All subscriptions successfully cancelled", status=status.HTTP_200_OK
            )


class BillUnregisteredParticipantListAPIView(ListAPIView):
    """View for listing all unregistered participants on a bill.

    Accepts GET requests.
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = BillUnregisteredParticipantListSerializer

    def get_queryset(self):
        """Returns a queryset containing all unregistered participants on a
        particular bill."""

        bill_uuid = self.kwargs.get("uuid")

        return BillUnregisteredParticipant.objects.filter(
            bills__uuid=bill_uuid,
        )


class BillUnregisteredParticipantDataTransferAPIView(APIView):
    """View for converting unregistered participants to registered users.

    Accepts POST requests.
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = BillUnregisteredParticipantsDataTransferSerializer

    @extend_schema(request=None, responses={204: OpenApiResponse()})
    def post(self, request):
        """Transfers the following data associated with a particular
        unregistered participant: bills, bill actions, plans and plan failures.

        If a phone number is provided, any unregistered participant with that
        number is used. Otherwise, any unregistered participant that shares a
        phone number with the user making the request is used.
        """

        registered_user = request.user

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        unregistered_participant_phone = serializer.validated_data.get(
            "unregistered_participant_phone"
        )

        transfer_unregistered_participant_data(
            registered_user, unregistered_participant_phone
        )

        return Response(status=status.HTTP_204_NO_CONTENT)


class BillActionStatusCountAPIView(APIView):
    """Obtain the count of every status type associated with a user.

    Accepts GET requests.
    """

    serializer_class = BillActionStatusCountSerializer

    def get(self, request):
        action_status_counts = BillAction.get_action_status_counts_for_user(
            user_id=request.user.id
        )
        return Response(action_status_counts, status=status.HTTP_200_OK)


class BillActionStatusListAPIView(ListAPIView):
    """View for listing a users actions with a particular status
    These statuses would be used to show users their standing on each bill.

    Accepts GET requests.
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = BillActionStatusListSerializer
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ("bill__name",)
    ordering_fields = ("created",)
    ordering = ("-created",)

    def get_queryset(self):
        status = self.request.query_params.get("status")

        if status not in [status.value for status in BillAction.StatusChoices]:
            raise serializers.ValidationError("Invalid status value")

        return BillAction.get_action_with_bills_by_status(
            user=self.request.user, status=status
        )


class BillActionResponseUpdateAPIView(APIView):
    """View for updating the response of a participant to a bill action.

    Participants can agree or opt out of bill actions, and make contributions to
    bills they have agreed to. One-time payments and subscriptions are handled
    with Paystack's services.

    Accepts PATCH requests.
    """

    permission_classes = (IsOwningParticipant, ParticipantHasDefaultCard)
    serializer_class = BillActionResponseUpdateSerializer

    @extend_schema(
        responses={
            200: OpenApiResponse(),
            204: OpenApiResponse(),
            400: OpenApiResponse(description="Bad request (Something invalid)"),
            409: OpenApiResponse(description="Duplicate payments or subscription"),
        },
    )
    def patch(self, request, uuid):
        """Handles PATCH requests for updating the response of a participant to
        a bill action. Will make a payment or create a subscription if payload
        is well formatted.

        Accepts the UUID of the bill action to update.
        """

        actions_queryset = (
            BillAction.objects.filter(uuid=uuid)
            .select_related(
                "bill",
                "bill__creditor",
                "participant",
            )
            .prefetch_related("paystack_subscription")
        )
        action = get_object_or_404(actions_queryset)

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

        if response is None:
            return format_exception(
                "Your subscription on this bill is already active.",
                status=status.HTTP_409_CONFLICT,
            )

        if response["status"]:
            return Response(response, status=status.HTTP_200_OK)

        else:
            return format_exception(
                message=response["message"],
                status=status.HTTP_400_BAD_REQUEST,
            )


class BillArrearResponseUpdateAPIView(APIView):
    """View for updating the response of a participant to a bill arrear.

    The view is called when a participant responds to an arrear they owe.
    They will normally make a one-time payment to remove the arrear.

    Arrears can be forgiven by the creditor of a bill. For this to happen, a new_status
    must be passed with the request.

    Accepts PATCH requests.
    """

    permission_classes = (IsOwningParticipantOrCreditor, ParticipantHasDefaultCard)
    serializer_class = BillArrearResponseUpdateSerializer

    @extend_schema(
        responses={
            200: OpenApiResponse(),
            400: OpenApiResponse(description="Bad request (Something invalid)"),
            403: OpenApiResponse(
                description="Only creditors are allowed to forgive bill arrears."
            ),
        },
    )
    def patch(self, request, uuid):
        """Handles PATCH requests for updating the response of a participant or
        creditor to a bill arrear. Will make a one-time payment if payload is
        well formatted.

        Accepts the UUID of the bill arrear to update.
        """

        arrears_queryset = BillArrear.objects.filter(uuid=uuid).select_related(
            "bill",
            "bill__creditor",
            "participant",
        )
        arrear = get_object_or_404(arrears_queryset)

        self.check_object_permissions(request, arrear)

        serializer = self.serializer_class(arrear, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        is_request_from_creditor = request.user == arrear.bill.creditor
        is_forgiveness = request.data.get("is_forgiveness")

        if is_forgiveness and not is_request_from_creditor:
            return format_exception(
                "Only creditors are allowed to forgive bill arrears.",
                status=status.HTTP_403_FORBIDDEN,
            )

        if is_forgiveness and is_request_from_creditor:
            return arrear.mark_as_forgiven()

        response = handle_arrear_contribution(arrear)

        if response["status"]:
            return Response(response, status=status.HTTP_200_OK)

        else:
            return format_exception(
                message=response["message"],
                status=status.HTTP_400_BAD_REQUEST,
            )


class BillSubscriptionCancellationAPIView(APIView):
    """Used to opt a user out of a recurring bill.

    Accepts PATCH requests.
    """

    permission_classes = (IsOwningParticipantOrCreditorOrCreator,)

    @extend_schema(
        responses={
            204: OpenApiResponse(),
            400: OpenApiResponse(description="Bad request (Something invalid)"),
            403: OpenApiResponse(
                description=(
                    "This service is for cancelling recurring bills or bill"
                    " subscriptions only."
                )
            ),
        },
    )
    def patch(self, request, uuid):
        """Disables the Paystack subscription associated with a particular
        participant and sets the partcipants action as "opted out".

        Accepts the UUID of the bill action to update.
        """

        actions_queryset = (
            BillAction.objects.filter(uuid=uuid)
            .select_related("bill")
            .prefetch_related("paystack_subscription")
        )
        action = get_object_or_404(actions_queryset)

        self.check_object_permissions(request, action)

        bill = action.bill

        if not bill.is_recurring:
            return format_exception(
                (
                    "This service is for cancelling recurring bills or bill"
                    " subscriptions only."
                ),
                status=status.HTTP_403_FORBIDDEN,
            )

        paystack_subscription = action.paystack_subscription
        paystack_subscription_code = paystack_subscription.paystack_subscription_code
        paystack_email_token = paystack_subscription.paystack_email_token

        # Make API call
        response = SubscriptionRequests.disable(
            code=paystack_subscription_code,
            token=paystack_email_token,
        )

        if response["status"]:
            action.opt_out_of_bill()
            return Response(status=status.HTTP_204_NO_CONTENT)

        else:
            return format_exception(
                message=response["message"],
                status=status.HTTP_400_BAD_REQUEST,
            )


class BillTransactionListAPIView(ListAPIView):
    """View for listing complete (Halver) transactions on a bill.

    Accepts GET requests.
    """

    permission_classes = (IsParticipantOrCreditor,)
    serializer_class = BillTransactionSerializer
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = (
        "bill__name",
        "paying_user__first_name",
        "paying_user__last_name",
        "receiving_user__first_name",
        "receiving_user__last_name",
    )
    ordering_fields = ("created",)
    ordering = ("-created",)

    def get_queryset(self):
        """Returns a queryset containing all complete transactions on a
        particular bill."""

        bill_uuid = self.kwargs.get("uuid")

        return BillTransaction.get_bill_transactions(bill_uuid)


class UserBillTransactionListAPIView(ListAPIView):
    """View for listing (Halver) transactions completed (or received) by a user.

    Accepts GET requests.
    """

    serializer_class = BillTransactionSerializer
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = (
        "bill__name",
        "paying_user__first_name",
        "paying_user__last_name",
        "paying_user__username",
        "receiving_user__first_name",
        "receiving_user__last_name",
        "receiving_user__username",
    )
    ordering_fields = ("created",)
    ordering = ("-created",)

    def get_queryset(self):
        """Returns a queryset containing all transactions completed (or received) by
        a user"""

        return BillTransaction.get_bill_transactions_for_user(self.request.user)


class BillArrearListAPIView(ListAPIView):
    """View for listing arrears on a bill.

    Accepts GET requests.
    """

    permission_classes = (IsParticipantOrCreditor,)
    serializer_class = BillArrearListSerializer
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = (
        "bill__name",
        "participant__first_name",
        "participant__last_name",
        "participant__username",
    )
    ordering_fields = ("created",)
    ordering = ("-created",)

    def get_queryset(self):
        """Returns a queryset containing all arrears on a particular bill."""

        bill_uuid = self.kwargs.get("uuid")
        return BillArrear.get_unsettled_arrears_on_bill(bill_uuid)
