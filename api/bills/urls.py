from django.urls import path

from bills.api.views import BillCreateView

app_name = "bills"


urlpatterns = [
    path(
        route="",
        view=BillCreateView.as_view(),
        name="bills-create",
    ),
]
