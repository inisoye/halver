from rest_framework.views import APIView

from bills.api.permissions import IsCreator
from bills.api.serializers import BillSerializer
from bills.models import Bill


class BillCreateView(APIView):
    permission_classes = (IsCreator,)
    serializer_class = BillSerializer

    def post(self, request):
        """
        Creates a new bill.

        Returns: A dictionary containing details of the newly created bill.
        """

        serializer = self.serializer_class(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        validated_data_without_contribution_index = {
            key: value
            for key, value in serializer.validated_data.items()
            if key != "participant_contribution_index"
        }
        participant_contribution_index = serializer.validated_data[
            "participant_contribution_index"
        ]

        new_bill = Bill.objects.create(**validated_data_without_contribution_index)

        new_bill.update_contributions_and_fees_for_actions(
            participant_contribution_index
        )

        if new_bill.is_recurring:
            print("is a recurring bill")
