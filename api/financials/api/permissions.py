import hashlib
import hmac

from django.conf import settings
from ipware import get_client_ip
from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """
    Custom permission class to check if the user making the request is
    the owner of the object.
    """

    def has_permission(self, request, view) -> bool:
        """
        Check if the user is authenticated.
        """

        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj) -> bool:
        """
        Check if the user is the owner of the object.
        """

        return obj.user == request.user


class IsPaystack(BasePermission):
    """
    Custom permission class to check if the request is from Paystack.

    The request is considered valid if:
        - The client's IP address is in the PAYSTACK_IP_WHITELIST
        - The request has a valid x-paystack-signature header
    """

    def has_permission(self, request, view) -> bool:
        """
        Check if the client's IP address is in the whitelist and if the
        x-paystack-signature header is valid.
        """

        client_ip, is_routable = get_client_ip(request)
        if (client_ip is None) or (client_ip not in settings.PAYSTACK_IP_WHITELIST):
            return False

        secret = settings.PAYSTACK_SECRET_KEY
        body = request.body

        hash = hmac.new(
            secret.encode("utf-8"),
            msg=body,
            digestmod=hashlib.sha512,
        )
        request_signature = request.headers.get("x-paystack-signature")

        if request_signature is None or not hmac.compare_digest(
            hash.hexdigest(),
            request_signature,
        ):
            return False

        return True
