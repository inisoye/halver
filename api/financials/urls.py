from django.urls import path

from .api.views import (
    DefaultCardRetrieveUpdateView,
    UserCardListView,
    UserCardRetrieveDestroyView,
)

app_name = "financials"

urlpatterns = [
    path(
        route="default-card/",
        view=DefaultCardRetrieveUpdateView.as_view(),
        name="default-card",
    ),
    path(
        route="user-cards/",
        view=UserCardListView.as_view(),
        name="user-cards",
    ),
    path(
        route="user-cards/<uuid:uuid>/",
        view=UserCardRetrieveDestroyView.as_view(),
        name="user-card-detail",
    ),
]
