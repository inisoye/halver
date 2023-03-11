from celery import shared_task
from celery.utils.log import get_task_logger

from bills.models import BillAction
from financials.models import PaystackSubscription, UserCard
from financials.utils.plans import get_participant_and_action_uuids_from_plan

logger = get_task_logger(__name__)


@shared_task
def process_action_updates_and_subscription_creation(request_data):
    """Updates the action associated with a subscription to "ongoing" and creates a db
    subscription object to record the creation locally.

    Args:
        request_data (dict): The JSON request data received from the Paystack webhook.
    """

    data = request_data.get("data")

    plan = data.get("plan")
    next_payment_date = data.get("next_payment_date")
    status = data.get("status")
    authorization_signature = data.get("authorization").get("signature")

    plan_name = plan.get("name")

    card = UserCard.objects.get(signature=authorization_signature)

    (
        participant_uuid,
        is_participant_registered,
        action_uuid,
    ) = get_participant_and_action_uuids_from_plan(plan_name)

    action = BillAction.objects.get(uuid=action_uuid)
    plan_object = action.paystack_plan
    participant = action.participant
    start_date = action.bill.first_charge_date

    action.mark_as_ongoing()

    PaystackSubscription.objects.create(
        plan=plan_object,
        participant=participant,
        status=status,
        card=card,
        action=action,
        start_date=start_date,
        next_payment_date=next_payment_date,
        complete_paystack_response=request_data,
    )
