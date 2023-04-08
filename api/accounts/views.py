from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from environs import Env
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import ProfileImageSerializer

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

    def patch(self, request):
        """Updates the requesting user's profile image if the request was
        valid."""

        serializer = self.serializer_class(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        profile_image = serializer.validated_data.get("profile_image")

        user = request.user

        user.update_profile_image(profile_image)

        return Response(status=status.HTTP_204_NO_CONTENT)
