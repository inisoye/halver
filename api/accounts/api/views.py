import asyncio

from allauth.socialaccount.providers.apple.views import (
    AppleOAuth2Adapter,
    AppleOAuth2Client,
)
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.contrib.auth import get_user_model
from django.db.models import Q
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
from bills.models import BillAction
from core.utils.responses import format_exception
from financials.utils.subscriptions import (
    format_disable_subscriptions_payloads,
    get_action_ids_to_be_ignored,
)
from libraries.notifications.base import send_push_messages
from libraries.paystack.subscription_requests import SubscriptionRequests

env = Env()
env.read_env()


User = get_user_model()


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = env.str(
        "GOOGLE_OAUTH_CALLBACK_URL",
        default="default_google_oauth_callback_url",
    )
    client_class = OAuth2Client


class AppleLogin(SocialLoginView):
    adapter_class = AppleOAuth2Adapter
    callback_url = env.str(
        "APPLE_OAUTH_CALLBACK_URL",
        default="default_apple_oauth_callback_url",
    )
    client_class = AppleOAuth2Client


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
    """Filter out a list of a person's contacts that have previously registered
    on Halver.

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
    """API view for updating the Expo push token of a logged-in user.

    Accepts PATCH requests.
    """

    permission_classes = (IsAuthenticated,)
    serializer_class = ExpoPushTokenSerializer

    def patch(self, request):
        user = self.request.user

        existing_token = user.expo_push_token

        serializer = ExpoPushTokenSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        new_token = serializer.validated_data.get("expo_push_token")

        if new_token != existing_token:
            try:
                existing_user_with_token = User.objects.get(expo_push_token=new_token)
            except User.DoesNotExist:
                existing_user_with_token = None

            if existing_user_with_token:
                existing_user_with_token.expo_push_token = None
                existing_user_with_token.save()

            user.expo_push_token = new_token
            user.save()
            return Response(
                {"detail": "Expo push token updated successfully"},
                status=status.HTTP_200_OK,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)


class MultiplePushNotificationsAPIView(APIView):
    def post(self, request, *args, **kwargs):
        # Retrieve data from the request, which is a list of dictionaries
        push_parameters_list = request.data.get("push_parameters_list", [])

        # Send multiple push notifications
        if push_parameters_list:
            response = send_push_messages(push_parameters_list)

            if response:
                return Response({"message": "Push notifications sent successfully"})

        return Response({"message": "Invalid request"}, status=400)


class ActivateAccountAPIView(APIView):
    """Activate a user's account.

    Accepts PATCH requests
    """

    permission_classes = (IsAuthenticated,)

    def patch(self, request):
        user = self.request.user

        user.is_active = True
        user.save()

        return Response(
            {"detail": "Account activation successful"},
            status=status.HTTP_200_OK,
        )


class CloseAccountAPIView(APIView):
    """Close a user's account by rendering it as inactive, cancelling their
    subscriptions on bills and deleting their financial details.

    Accepts PATCH requests
    """

    permission_classes = (IsAuthenticated,)

    def patch(self, request):
        user = self.request.user

        user_actions = BillAction.objects.filter(
            participant=user,
            status=BillAction.StatusChoices.ONGOING,
        )

        disable_subscriptions_payloads = format_disable_subscriptions_payloads(
            user_actions
        )

        disable_subscriptions_responses = asyncio.run(
            SubscriptionRequests.disable_multiple(disable_subscriptions_payloads)
        )

        # Detect subscriptions that were not successfully disabled.
        action_ids_to_be_ignored = get_action_ids_to_be_ignored(
            disable_subscriptions_responses, user_actions
        )

        # Cancel only actions associated with subscriptions that have been disabled.
        user_actions.filter(~Q(id__in=action_ids_to_be_ignored)).update(
            status=BillAction.StatusChoices.CANCELLED
        )

        if action_ids_to_be_ignored:
            return format_exception(
                message=(
                    "We could not successfully cancel some of your subscriptions. Try"
                    " cancelling them individually or try again later."
                ),
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        user_cards = user.cards.all()
        if user_cards.exists():
            user_cards.delete()

        # Transfer recipients are not deleted from Paystack as they might be used
        # by other users as well.
        user_transfer_recipients = user.transfer_recipients.all()
        if user_transfer_recipients.exists():
            user_transfer_recipients.delete()

        user.is_active = False
        user.save()

        return Response(
            {"detail": "Account deactivation successful"},
            status=status.HTTP_200_OK,
        )
