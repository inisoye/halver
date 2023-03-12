from celery import shared_task
from celery.utils.log import get_task_logger

from bills.models import BillAction
from bills.utils.contributions import (
    finalize_contribution,
    process_contribution_transfer,
)
from financials.models import (
    PaystackSubscription,
    PaystackTransaction,
    PaystackTransfer,
    UserCard,
)
from financials.utils.plans import extract_uuids_from_plan_description

logger = get_task_logger(__name__)


@shared_task
def process_subscription_creation(request_data):
    """Updates the action associated with a subscription to "ongoing" and
    creates a db subscription object to record the creation locally.

    Args:
        request_data (dict): The JSON request data received from the Paystack webhook.
    """

    data = request_data.get("data")

    plan = data.get("plan")
    next_payment_date = data.get("next_payment_date")
    status = data.get("status")
    subscription_code = data.get("subscription_code")
    authorization_signature = data.get("authorization").get("signature")

    plan_description = plan.get("description")

    card = UserCard.objects.get(signature=authorization_signature)

    _, _, action_uuid, _ = extract_uuids_from_plan_description(plan_description)

    action = BillAction.objects.get(uuid=action_uuid)
    plan_object = action.paystack_plan
    participant = action.participant
    start_date = action.bill.first_charge_date

    PaystackSubscription.objects.create(
        plan=plan_object,
        participant=participant,
        status=status,
        card=card,
        action=action,
        start_date=start_date,
        next_payment_date=next_payment_date,
        paystack_subscription_code=subscription_code,
        complete_paystack_response=request_data,
    )


@shared_task
def process_action_updates_and_subscription_contribution_transfer(request_data):
    """Creates a transaction object in db for the contribution and initiates a
    Paystack transfer to the bill's creditor. This task is exclusively used for
    recurring bills/subscriptions.

    Args:
        request_data (dict): The JSON request data received from the Paystack webhook.
    """

    data = request_data.get("data")

    plan = data.get("plan")

    plan_description = plan.get("description")

    _, _, action_uuid, _ = extract_uuids_from_plan_description(plan_description)

    process_contribution_transfer(
        action_id=action_uuid,
        request_data=request_data,
        transaction_type=PaystackTransaction.TransactionChoices.SUBSCRIPTION_CONTRIBUTION,  # noqa E501
    )


@shared_task
def finalize_subscription_contribution(
    request_data,
    transfer_outcome=PaystackTransfer.TransferOutcomeChoices.SUCCESSFUL,
    final_action_status=BillAction.StatusChoices.ONGOING,
):
    """Finalizes a subscription contribution by creating a BillTransaction object, a
    PaystackTransfer object, and marking the corresponding BillAction as
    ongoing - to represent the recurring bill/subscription is back on track.

    Args:
        request_data (dict): A dictionary of data received from Paystack
            webhooks containing information on a successful or failed
            transfer.
        transfer_outcome (str): A string indicating the outcome of the
            transfer, should be `PaystackTransfer.TransferOutcome.SUCCESS`
    """

    finalize_contribution(
        request_data=request_data,
        transfer_outcome=transfer_outcome,
        final_action_status=final_action_status,
    )
