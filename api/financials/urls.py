from django.urls import path

from financials.api.views import (
    DefaultCardRetrieveAPIView,
    DefaultCardUpdateAPIView,
    DefaultTransferRecipientRetrieveAPIView,
    DefaultTransferRecipientUpdateAPIView,
    PaystackTransferRecipientListAPIView,
    PaystackWebhookHandlerAPIView,
    TransferRecipientListCreateAPIView,
    TransferRecipientsDestroyAPIView,
    UserCardAdditionTransactionAPIView,
    UserCardListAPIView,
    UserCardRetrieveDestroyAPIView,
)

app_name = "financials"

urlpatterns = [
    path(
        route="paystack-webhook-handler/",
        view=PaystackWebhookHandlerAPIView.as_view(),
        name="paystack-webhook-handler",
    ),
    path(
        route="default-card/",
        view=DefaultCardRetrieveAPIView.as_view(),
        name="default-card-get",
    ),
    path(
        route="default-card/<uuid:uuid>/",
        view=DefaultCardUpdateAPIView.as_view(),
        name="default-card-set-as",
    ),
    path(
        route="user-cards/initialize-card-addition/",
        view=UserCardAdditionTransactionAPIView.as_view(),
        name="initialize-card-addition-transaction",
    ),
    path(
        route="user-cards/",
        view=UserCardListAPIView.as_view(),
        name="user-cards",
    ),
    path(
        route="user-cards/<uuid:uuid>/",
        view=UserCardRetrieveDestroyAPIView.as_view(),
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
        view=TransferRecipientsDestroyAPIView.as_view(),
        name="transfer-recipient-delete",
    ),
    path(
        route="default-transfer-recipient/",
        view=DefaultTransferRecipientRetrieveAPIView.as_view(),
        name="default-transfer-recipient-get",
    ),
    path(
        route="default-transfer-recipient/<uuid:uuid>/",
        view=DefaultTransferRecipientUpdateAPIView.as_view(),
        name="default-transfer-recipient-set-as",
    ),
]
