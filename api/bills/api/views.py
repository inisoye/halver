from rest_framework.views import APIView

from bills.api.permissions import IsCreator
from bills.api.serializers import BillCreateSerializer
from bills.models import Bill
from financials.tasks.plans import create_paystack_plans_for_recurring_bills


class BillCreateView(APIView):
    permission_classes = (IsCreator,)
    serializer_class = BillCreateSerializer

    def post(self, request):
        """Creates a new bill.

        Returns: A dictionary containing details of the newly created bill.
        """

        serializer = self.serializer_class(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        new_bill = Bill.create_bill_from_validated_data(serializer.validated_data)

        if new_bill.is_recurring:
            create_paystack_plans_for_recurring_bills.delay(new_bill)
