from django.urls import path

from bills.api.views import (
    ActionResponseUpdateAPIView,
    BillListCreateAPIView,
    BillRetrieveUpdateAPIView,
    BillUnregisteredParticipantsDataTransferAPIView,
    BillUnregisteredParticipantsListAPIView,
)

app_name = "bills"

urlpatterns = [
    path(
        route="",
        view=BillListCreateAPIView.as_view(),
        name="bills-list",
    ),
    path(
        route="<uuid:uuid>/",
        view=BillRetrieveUpdateAPIView.as_view(),
        name="bill-detail",
    ),
    path(
        route="<uuid:uuid>/unregistered-participants/",
        view=BillUnregisteredParticipantsListAPIView.as_view(),
        name="bill-unregistered-participants",
    ),
    path(
        route="unregistered-participants/transfer/",
        view=BillUnregisteredParticipantsDataTransferAPIView.as_view(),
        name="bill-unregistered-participants-data-transfer",
    ),
    path(
        route="actions/<uuid:uuid>/",
        view=ActionResponseUpdateAPIView.as_view(),
        name="action-response",
    ),
]
