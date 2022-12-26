from django.urls import include, path
from rest_framework import routers

from .api.viewsets import UserCardViewSet

router = routers.DefaultRouter()
router.register("user-card", UserCardViewSet, basename="card")

urlpatterns = [
    path("", include(router.urls)),
]
