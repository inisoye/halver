import datetime

from celery import periodic_task
from django.db import transaction

from bills.models import Action

# TODO Add flower to track all tasks across application


@periodic_task(
    run_every=datetime.timedelta(hours=12),
    default_retry_delay=3600,
    max_retries=2,
)
@transaction.atomic
def check_and_update_actions_and_bill_participants():
    try:
        # Get all actions with a bill due date that is past today and with statuses
        # that are not already marked as completed
        overdue_and_incomplete_actions = Action.objects.filter(
            bill__due_date__lt=datetime.date.today(), status__ne="completed"
        )

        # Update the status of each overdue action to "overdue"
        for action in overdue_and_incomplete_actions:
            # Retrieve a fresh copy of the action and bill participant objects
            action = Action.objects.get(pk=action.pk)
            bill_participant = action.bill_participant

            action.status = "overdue"
            action.save()

            # Update the status of the bill participant to "overdue"
            bill_participant.status = "overdue"
            bill_participant.save()

    except Exception as e:
        # Retry the task if it fails due to a network error or other
        # resource availability error
        check_and_update_actions_and_bill_participants.retry(exc=e)
