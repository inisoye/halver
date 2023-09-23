from celery import shared_task
from celery.utils.log import get_task_logger

from libraries.notifications.base import send_push_messages

logger = get_task_logger(__name__)


@shared_task
def send_push_messages_in_background(push_parameters_list):
    """
    Celery task for sending push messages in the background.

    Args:
        push_parameters_list (list): A list of dictionaries containing push parameters
                                     for each message. Each dictionary could/should have
                                     'token', 'message', 'extra', 'title', and
                                     'subtitle' keys.
    """

    send_push_messages(push_parameters_list)
