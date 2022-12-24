# Detect and log errors from allauth
# https://stackoverflow.com/a/50979859/15063835

from pprint import pprint

from allauth.socialaccount.adapter import DefaultSocialAccountAdapter


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def authentication_error(
        self, request, provider_id, error, exception, extra_context
    ):
        pprint(
            {
                "provider_id": provider_id,
                "error": error.__str__(),
                "exception": exception.__str__(),
                "extra_context": extra_context,
            },
        )
