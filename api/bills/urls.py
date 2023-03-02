from django.urls import path

from bills.api.views import (
    ActionResponseUpdateView,
    BillDetailUpdateView,
    BillListCreateView,
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
        view=BillDetailUpdateView.as_view(),
        name="bill-detail",
    ),
    path(
        route="actions/<uuid:uuid>/",
        view=ActionResponseUpdateView.as_view(),
        name="action-response",
    ),
]
