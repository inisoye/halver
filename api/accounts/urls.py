from django.urls import include, path

from .views import GoogleLogin

app_name = "accounts"

urlpatterns = [
    path(
        "dj-rest-auth/",
        include("dj_rest_auth.urls"),
    ),
    path(
        "dj-rest-auth/registration/",
        include("dj_rest_auth.registration.urls"),
    ),
    path(
        "dj-rest-auth/google/",
        GoogleLogin.as_view(),
        name="google_login",
    ),
    path(
        "allauth/",
        include("allauth.urls"),
    ),
]
