import asyncio

from celery import shared_task
from celery.utils.log import get_task_logger

from bills.models import Bill
from financials.utils.plans import (
    create_paystack_plan_objects,
    format_paystack_plan_payloads,
)
from libraries.paystack.plan_requests import PlanRequests

logger = get_task_logger(__name__)


@shared_task
def create_paystack_plans_for_recurring_bills(new_bill_id):
    """Creates Paystack plan objects for a new recurring bill.

    Args:
        new_bill (Bill): The new recurring bill to create Paystack plan objects for.

    Returns:
        None.
    """
    new_bill = Bill.objects.get(id=new_bill_id)

    bill_actions = new_bill.actions.all()

    # Use select_related and prefetch_related to retrieve related objects in a
    # single query to prevent n+1 issues
    bill_actions = bill_actions.select_related(
        "participant", "unregistered_participant", "bill"
    )

    paystack_plan_payloads = format_paystack_plan_payloads(bill_actions)

    paystack_plan_responses = asyncio.run(
        PlanRequests.create_multiple(paystack_plan_payloads)
    )

    create_paystack_plan_objects(
        bill_actions, paystack_plan_responses, paystack_plan_payloads
    )
