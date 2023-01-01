from django.urls import path

from .api.views import (
    DefaultCardRetrieveView,
    DefaultCardUpdateView,
    TransferRecipientListCreateAPIView,
    TransferRecipientsDestroyView,
    UserCardListView,
    UserCardRetrieveDestroyView,
)

app_name = "financials"

urlpatterns = [
    path(
        route="default-card/",
        view=DefaultCardRetrieveView.as_view(),
        name="default-card",
    ),
    path(
        route="default-card/<uuid:uuid>/",
        view=DefaultCardUpdateView.as_view(),
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
    path(
        route="transfer-recipients/",
        view=TransferRecipientListCreateAPIView.as_view(),
        name="transfer-recipients",
    ),
    path(
        route="transfer-recipients/<str:recipient_code>",
        view=TransferRecipientsDestroyView.as_view(),
        name="transfer-recipients-delete",
    ),
]
