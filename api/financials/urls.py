from django.urls import path

from financials.api.views import (
    DefaultCardRetrieveView,
    DefaultCardUpdateView,
    DefaultTransferRecipientRetrieveView,
    DefaultTransferRecipientUpdateView,
    PaystackTransferRecipientListAPIView,
    TransferRecipientListCreateAPIView,
    TransferRecipientsDestroyView,
    UserCardAdditionTransactionAPIView,
    UserCardListView,
    UserCardRetrieveDestroyView,
)

app_name = "financials"

urlpatterns = [
    path(
        route="user-cards/default-card/",
        view=DefaultCardRetrieveView.as_view(),
        name="default-card-get",
    ),
    path(
        route="user-cards/default-card/<uuid:uuid>/",
        view=DefaultCardUpdateView.as_view(),
        name="default-card-set-as",
    ),
    path(
        route="user-cards/initialize-card-addition/",
        view=UserCardAdditionTransactionAPIView.as_view(),
        name="initialize-card-addition-transaction",
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
        name="transfer-recipients-create",
    ),
    path(
        route="transfer-recipients/paystack/",
        view=PaystackTransferRecipientListAPIView.as_view(),
        name="paystack-transfer-recipients",
    ),
    path(
        route="transfer-recipients/<str:recipient_code>/",
        view=TransferRecipientsDestroyView.as_view(),
        name="transfer-recipient-delete",
    ),
    path(
        route="default-transfer-recipient/",
        view=DefaultTransferRecipientRetrieveView.as_view(),
        name="default-transfer-recipient-get",
    ),
    path(
        route="default-transfer-recipient/<uuid:uuid>/",
        view=DefaultTransferRecipientUpdateView.as_view(),
        name="default-transfer-recipient-set-as",
    ),
]
