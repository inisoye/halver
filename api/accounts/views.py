from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from environs import Env

env = Env()
env.read_env()


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = env.str(
        "GOOGLE_OAUTH_CALLBACK_URL",
        default="default_google_oauth_callback_url",
    )
    client_class = OAuth2Client
