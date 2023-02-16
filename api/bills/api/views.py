from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from bills.api.permissions import IsCreator, IsCreditor
from bills.api.serializers import BillCreateSerializer, BillDetailsUpdateSerializer
from bills.models import Bill
from financials.tasks.plans import create_paystack_plans_for_recurring_bills


class BillCreateView(APIView):
    permission_classes = (IsCreator,)
    serializer_class = BillCreateSerializer
    queryset = Bill.objects.all()

    def post(self, request):
        """Creates a new bill and all its actions. If the bill recurs, paystack
        plans would be created for each action as well.

        Returns:
            An empty response.
        """

        serializer = self.serializer_class(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        new_bill = Bill.create_bill_from_validated_data(serializer.validated_data)

        if new_bill.is_recurring:
            create_paystack_plans_for_recurring_bills.delay(new_bill)

        return Response(status=status.HTTP_201_CREATED)


class BillDetailsUpdateView(APIView):
    """View for updating specific fields on Bill object. These fields ("name",
    "notes", "evidence", "is_discreet", "deadline") have been collectively
    called bill details.

    Accepts PATCH requests.
    """

    permission_classes = (IsCreator, IsCreditor)
    serializer_class = BillDetailsUpdateSerializer

    def patch(self, request, uuid):
        """Updates any of the following fields in the Bill with the provided
        UUID: "name", "notes", "evidence", "is_discreet", "deadline".

        Args:
            uuid: The UUID of the bill to be updated.

        Returns:
            An empty response.
        """

        bill = get_object_or_404(Bill, uuid=uuid)

        serializer = BillDetailsUpdateSerializer(bill, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        for field, value in request.data.items():
            setattr(bill, field, value)
        bill.save(update_fields=request.data.keys())

        return Response(status=status.HTTP_204_NO_CONTENT)
