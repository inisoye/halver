from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers

from accounts.models import CustomUser


def get_user_by_id(uuid) -> CustomUser:
    """
    Get user by ID.

    Args:
        uuid (str): The UUID of the user to retrieve.

    Returns:
        CustomUser: The user with the specified ID.

    Raises:
        ObjectDoesNotExist: If the user with the specified ID does not exist.
    """

    User = get_user_model()

    try:
        return User.objects.get(uuid=uuid)

    except User.DoesNotExist:
        raise ObjectDoesNotExist(f"User with user ID: {uuid} not found")


def get_user_by_id_drf(uuid) -> CustomUser:
    """
    Get user by ID in a DRF context.

    Args:
        uuid (str): The UUID of the user to retrieve.

    Returns:
        CustomUser: The user with the specified ID.

    Raises:
        serializers.ValidationError: If the user with the specified ID does not exist.
    """
    User = get_user_model()

    try:
        user = User.objects.get(uuid=uuid)

    except User.DoesNotExist:
        raise serializers.ValidationError(
            {"uuid": f"User with user ID: {uuid} not found"}
        )

    return user
