from celery.utils.log import get_task_logger
from django.utils import timezone

from bills.models import BillAction
from core.celery import app

logger = get_task_logger(__name__)


@app.task
def update_overdue_statuses():
    # Get all actions with pending statuses and deadlines in the past
    overdue_and_incomplete_actions = BillAction.objects.filter(
        bill__deadline__lt=timezone.now(), status="pending"
    )

    # Perform bulk update for all overdue actions
    overdue_and_incomplete_actions.update(status="overdue")
