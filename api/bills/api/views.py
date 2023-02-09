from rest_framework.views import APIView

from bills.api.permissions import IsCreator
from bills.api.serializers import BillCreateSerializer
from bills.models import Bill


class BillCreateView(APIView):
    permission_classes = (IsCreator,)
    serializer_class = BillCreateSerializer

    def post(self, request):
        """
        Creates a new bill.

        Returns: A dictionary containing details of the newly created bill.
        """

        serializer = self.serializer_class(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        new_bill = Bill.create_bill_from_validated_data(serializer.validated_data)

        if new_bill.is_recurring:
            paystack_plan_payload = {
                "name": f"Paystack plan for {new_bill.name}",
                "amount": int(float(new_bill.total_amount_due)) * 100,
                "interval": new_bill.interval,
                "description": (
                    f"Paystack plan for {new_bill.name}. "
                    f"Creator's note: {new_bill.notes or 'not provided'}."
                ),
                "currency": new_bill.currency_code,
            }

            print("is a recurring bill")

    # TODO
    # This function should create paystack one paystack plan for the bill if the
    # following condition passes: if bill.is_recurring:
    # The plan should be created by sending an API call to paystack in a background job
    # After the each remote creation in a celery bg task is complete, the plans should
    # also be created locally with 'PaystackPlan.objects.create'. Ensure to avoid n+1.
    # Actions should be created for participants as usual before the plans are created.
