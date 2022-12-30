from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api-auth/",
        include("rest_framework.urls"),
    ),
    path(
        "api/v1/",
        include("accounts.urls", namespace="accounts"),
    ),
    path(
        "api/v1/financials",
        include("financials.urls", namespace="financials"),
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
