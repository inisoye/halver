from celery import shared_task
from celery.utils.log import get_task_logger

from bills.models import BillArrear
from financials.models import PaystackSubscription

logger = get_task_logger(__name__)


@shared_task
def record_bill_arrear(request_data):
    """ """

    data = request_data.get("data")

    subscription = data.get("subscription")
    subscription_code = subscription.get("subscription_code")

    subscription_object = PaystackSubscription.objects.get(
        paystack_subscription_code=subscription_code
    ).select_related("action")

    action = subscription_object.action

    bill_arrear_object = {
        "bill": action.bill,
        "participant": action.participant,
        "contribution": action.contribution,
        "paystack_transaction_fee": action.paystack_transaction_fee,
        "paystack_transfer_fee": action.paystack_transfer_fee,
        "halver_fee": action.halver_fee,
        "total_fee": action.total_fee,
        "total_payment_due": action.total_payment_due,
    }

    BillArrear.objects.create(**bill_arrear_object)
