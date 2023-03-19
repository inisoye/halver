from django.urls import path

from bills.api.views import (
    BillActionResponseUpdateAPIView,
    BillArrearListAPIView,
    BillArrearResponseUpdateAPIView,
    BillCancellationAPIView,
    BillListCreateAPIView,
    BillRetrieveUpdateAPIView,
    BillSubscriptionCancellationAPIView,
    BillTransactionListAPIView,
    BillUnregisteredParticipantDataTransferAPIView,
    BillUnregisteredParticipantListAPIView,
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
        route="<uuid:uuid>/cancel/",
        view=BillCancellationAPIView.as_view(),
        name="bill-cancel",
    ),
    path(
        route="<uuid:uuid>/transactions/",
        view=BillTransactionListAPIView.as_view(),
        name="bill-transactions",
    ),
    path(
        route="<uuid:uuid>/arrears/",
        view=BillArrearListAPIView.as_view(),
        name="bill-arrears",
    ),
    path(
        route="<uuid:uuid>/unregistered-participants/",
        view=BillUnregisteredParticipantListAPIView.as_view(),
        name="bill-unregistered-participants",
    ),
    path(
        route="unregistered-participants/transfer/",
        view=BillUnregisteredParticipantDataTransferAPIView.as_view(),
        name="bill-unregistered-participants-data-transfer",
    ),
    path(
        route="actions/<uuid:uuid>/",
        view=BillActionResponseUpdateAPIView.as_view(),
        name="action-response",
    ),
    path(
        route="arrears/<uuid:uuid>/",
        view=BillArrearResponseUpdateAPIView.as_view(),
        name="arrear-response",
    ),
    path(
        route="actions/<uuid:uuid>/subscription/cancel/",
        view=BillSubscriptionCancellationAPIView.as_view(),
        name="subscription-cancel",
    ),
]
