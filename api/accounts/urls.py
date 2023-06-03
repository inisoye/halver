from django.urls import include, path

from accounts.api.views import (
    GoogleLogin,
    ProfileImageUploadAPIView,
    RegisteredContactsListAPIView,
)

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
        "accounts/profile-image/",
        ProfileImageUploadAPIView.as_view(),
        name="profile-image-upload",
    ),
    path(
        "accounts/registered-contacts/",
        RegisteredContactsListAPIView.as_view(),
        name="registered-contacts-list",
    ),
    path(
        "allauth/",
        include("allauth.urls"),
    ),
]
