from celery import shared_task
from celery.utils.log import get_task_logger
from django.utils import timezone

from bills.models import BillAction

logger = get_task_logger(__name__)


@shared_task
def update_overdue_statuses():
    # Get all actions with pending statuses and deadlines in the past
    overdue_and_incomplete_actions = BillAction.objects.filter(
        bill__deadline__lt=timezone.now(), status=BillAction.StatusChoices.PENDING
    )

    # Perform bulk update for all overdue actions
    overdue_and_incomplete_actions.update(status=BillAction.StatusChoices.OVERDUE)
