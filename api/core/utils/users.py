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


def get_users_by_ids_drf(uuids):
    """
    Get multiple users by IDs in a DRF context.

    Args:
        uuids (list): List of UUIDs of the users to retrieve.

    Returns:
        CustomUser: The users with the specified IDs.

    Raises:
        serializers.ValidationError: If any of the users with the specified IDs do not
        exist.
    """
    User = get_user_model()

    users = User.objects.filter(uuid__in=uuids)

    if not users.exists():
        raise serializers.ValidationError(
            {"uuid": f"None of the users with IDs {uuids} were found"}
        )

    return users
