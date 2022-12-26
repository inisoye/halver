from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response

from accounts.admin import CustomUser


def return_ok_response(data=None, status=status.HTTP_200_OK) -> Response:
    response = {"status": "ok", "result": data}
    return Response(response, status=status)


def return_bad_request_exception(data, status=status.HTTP_400_BAD_REQUEST) -> Response:
    response = {"status": "bad request", "result": data}
    return Response(response, status=status)


def get_user(user_id) -> CustomUser | None:
    User = get_user_model()
    try:
        return User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return None
