from django.urls import path

from .api.views import DefaultCardView, UserCardRetrieveDestroyView

urlpatterns = [
    path(
        "default-cards/",
        DefaultCardView.as_view(),
        name="financials_rest_api",
    ),
    path(
        "user-cards/",
        UserCardRetrieveDestroyView.as_view(),
        name="financials_rest_api",
    ),
]
