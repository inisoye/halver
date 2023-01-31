# import datetime

# from celery.decorators import periodic_task
# from django.db import transaction

# from bills.models import Action

# TODO Add flower to track all tasks across application


# @transaction.atomic
# @periodic_task(
#     run_every=datetime.timedelta(hours=12),
#     default_retry_delay=3600,
#     max_retries=2,
# )
# def update_overdue_statuses():
#     try:
#         # Get all actions with pending statuses and deadlines in the past
#         overdue_and_incomplete_actions = Action.objects.filter(
#             bill__deadline__lt=datetime.date.today(), status="pending"
#         )

#         # Perform bulk update for all overdue actions
#         overdue_and_incomplete_actions.update(status="overdue")

#     except Exception as e:
#         # Retry the task if it fails due to a network error or other
#         # resource availability error
#         update_overdue_statuses.retry(exc=e)
