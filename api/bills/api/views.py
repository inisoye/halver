from rest_framework.views import APIView

from bills.api.permissions import IsCreator
from bills.api.serializers import BillSerializer


class BillCreateView(APIView):
    permission_classes = (IsCreator,)
    serializer_class = BillSerializer

    def post(self):
        """
        Creates a new bill.

        Returns: A dictionary containing details of the newly created bill.
        """

        serializer = self.serializer_class(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        # Remove amount paid as it should default to zero on bill creation.
        serializer.validated_data.pop("total_amount_paid", None)
        # Pick out index for updating actions later.
        # participant_contribution_index = serializer.validated_data.pop(
        #     "participant_contribution_index", None
        # )
