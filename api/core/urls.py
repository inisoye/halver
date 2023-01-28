from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

if not settings.DEBUG:
    handler500 = "rest_framework.exceptions.server_error"
    handler400 = "rest_framework.exceptions.bad_request"
    handler404 = "core.views.not_found"

urlpatterns = [
    path(
        "admin/",
        admin.site.urls,
    ),
    path(
        "api-auth/",
        include("rest_framework.urls"),
    ),
    path(
        "api/v1/",
        include("accounts.urls"),
    ),
    path(
        "api/v1/financials/",
        include(
            "financials.urls",
            namespace="financials",
        ),
    ),
    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="schema",
    ),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "__debug__/",
        include("debug_toolbar.urls"),
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
