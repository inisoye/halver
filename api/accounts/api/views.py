from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from drf_spectacular.utils import OpenApiResponse, extend_schema
from environs import Env
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.api.serializers import (
    ExpoPushTokenSerializer,
    ProfileImageSerializer,
    RegisteredContactsSerializer,
)
from accounts.models import CustomUser
from core.utils.responses import format_exception

env = Env()
env.read_env()


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = env.str(
        "GOOGLE_OAUTH_CALLBACK_URL",
        default="default_google_oauth_callback_url",
    )
    client_class = OAuth2Client


class ProfileImageUploadAPIView(APIView):
    """API view for updating the profile image of a logged-in user.

    Accepts PATCH requests.
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = ProfileImageSerializer

    @extend_schema(request=None, responses={204: OpenApiResponse()})
    def patch(self, request):
        """Updates the requesting user's profile image if the request was
        valid."""

        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        profile_image = serializer.validated_data.get("profile_image")

        if not profile_image:
            return format_exception(
                message="Please upload an image.",
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user

        user.update_profile_image(profile_image)

        return Response(status=status.HTTP_204_NO_CONTENT)


class RegisteredContactsListAPIView(APIView):
    """Filter out a list of a person's contacts that have previously
    registered on Halver.

    Accepts POST requests.
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = RegisteredContactsSerializer

    def post(self, request):
        phone_numbers = request.data.get("phone_numbers", [])
        queryset = CustomUser.objects.only(
            "first_name",
            "last_name",
            "phone",
            "profile_image_url",
            "profile_image_hash",
            "username",
            "uuid",
        ).filter(phone__in=phone_numbers)

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class ExpoPushTokenUpdateAPIView(APIView):
    def patch(self, request):
        user = self.request.user

        existing_token = user.expo_push_token

        serializer = ExpoPushTokenSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        new_token = serializer.validated_data.get("expo_push_token")

        # Check if the new token is different from the existing one
        if new_token != existing_token:
            user.expo_push_token = new_token
            user.save()
            return Response(
                {"detail": "Expo push token updated successfully"},
                status=status.HTTP_200_OK,
            )

        return Response(status=status.HTTP_304_NOT_MODIFIED)
