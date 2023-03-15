from django.urls import path

from bills.api.views import (
    ActionResponseUpdateView,
    BillListCreateView,
    BillRetrieveUpdateView,
    BillUnregisteredParticipantsListAPIView,
)

app_name = "bills"

urlpatterns = [
    path(
        route="",
        view=BillListCreateView.as_view(),
        name="bills-list",
    ),
    path(
        route="<uuid:uuid>/",
        view=BillRetrieveUpdateView.as_view(),
        name="bill-detail",
    ),
    path(
        route="<uuid:uuid>/unregistered-participants/",
        view=BillUnregisteredParticipantsListAPIView.as_view(),
        name="bill-unregistered-participants",
    ),
    path(
        route="actions/<uuid:uuid>/",
        view=ActionResponseUpdateView.as_view(),
        name="action-response",
    ),
]
