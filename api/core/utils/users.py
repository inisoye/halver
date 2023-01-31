from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

from accounts.models import CustomUser


def get_user_by_id(user_id) -> CustomUser:
    """
    Get user by ID.

    Args:
        user_id (str): The UUID of the user to retrieve.

    Returns:
        CustomUser: The user with the specified ID.

    Raises:
        ObjectDoesNotExist: If the user with the specified ID does not exist.
    """

    User = get_user_model()

    try:
        return User.objects.get(uuid=user_id)

    except User.DoesNotExist:
        raise ObjectDoesNotExist(f"User with user ID: {user_id} not found")
