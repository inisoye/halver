from django.urls import path

from bills.api.views import BillDetailUpdateView, BillListCreateView

app_name = "bills"

urlpatterns = [
    path(
        route="",
        view=BillListCreateView.as_view(),
        name="bills/",
    ),
    path(
        route="<uuid:uuid>/",
        view=BillDetailUpdateView.as_view(),
        name="bill-detail",
    ),
]
