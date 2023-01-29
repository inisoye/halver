from rest_framework.response import Response


def format_exception(message: str, status: int) -> Response:
    return Response({"detail": message}, status=status)
