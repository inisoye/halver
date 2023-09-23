from celery import shared_task
from celery.utils.log import get_task_logger

from bills.models import BillArrear, BillTransaction
from bills.utils.arrears import process_arrear_contribution_transfer
from core.utils.currency import convert_to_naira
from core.utils.strings import extract_uuidv4s_from_string
from financials.models import (
    PaystackSubscription,
    PaystackTransaction,
    PaystackTransfer,
    TransferRecipient,
)
from financials.utils.transfers import (
    create_paystack_transfer_object,
    extract_paystack_transaction_id_from_transfer_reason,
)
from libraries.notifications.base import send_push_messages

logger = get_task_logger(__name__)


@shared_task
def record_bill_arrear(request_data):
    """Records a bill arrear for a failed recurring contribution payment and
    sends push notifications.

    Args:
        request_data (dict): A dictionary of data received from Paystack
            webhooks containing information on a failed card charge
    """

    data = request_data.get("data")

    subscription = data.get("subscription")
    subscription_code = subscription.get("subscription_code")

    subscription_object = PaystackSubscription.objects.get(
        paystack_subscription_code=subscription_code
    ).select_related(
        "action",
        "action__bill",
        "action__bill__creditor",
        "action__participant",
    )

    action = subscription_object.action
    bill = action.bill

    participant = action.participant

    bill_arrear_object = {
        "bill": bill,
        "participant": participant,
        "action": action,
        "contribution": action.contribution,
        "paystack_transaction_fee": action.paystack_transaction_fee,
        "paystack_transfer_fee": action.paystack_transfer_fee,
        "halver_fee": action.halver_fee,
        "total_fee": action.total_fee,
        "total_payment_due": action.total_payment_due,
    }

    BillArrear.objects.create(**bill_arrear_object)

    push_parameters_list = [
        {
            "token": participant.expo_push_token,
            "title": "Recurring contribution payment error",
            "message": (
                "We tried charging your card for your contribution towards"
                f" {bill.name} but our attempt failed. You can retry your payment in"
                " the arrear section of the bill."
            ),
            "extra": {
                "action": "failed-subscription-charge",
                "bill_name": bill.name,
                "bill_id": bill.uuid,
            },
        },
        {
            "token": action.bill.creditor.expo_push_token,
            "title": "Recurring contribution payment error",
            "message": (
                f"We tried charging {participant.full_name}'s card for their"
                f" contribution towards {bill.name} but our attempt failed. We have"
                " saved this as an arrear on the bill."
            ),
            "extra": {
                "action": "failed-subscription-charge",
                "bill_name": bill.name,
                "bill_id": bill.uuid,
            },
        },
    ]

    send_push_messages(push_parameters_list)


@shared_task
def process_arrear_updates_and_arrear_contribution_transfer(request_data):
    """Processes contributions towards a bill and updates the the status of the
    arrear that triggered the contribution.

    Creates a transaction object in db for the contribution and initiates a Paystack
    transfer to the bill's creditor.

    Args:
        request_data (dict): The JSON request data received from the Paystack webhook.
    """

    data = request_data.get("data")

    metadata = data.get("metadata")

    arrear_id = metadata.get("arrear_id")

    process_arrear_contribution_transfer(
        arrear_id=arrear_id,
        request_data=request_data,
    )


@shared_task
def record_arrear_contribution_transfer_object(request_data, transfer_outcome):
    """Create or update a PaystackTransfer object with data from the
    request_data and the outcome of the transfer.

    The task is dedicated to transfers made of contributions of participants to
    contributors.

    Args:
        request_data (dict): A dictionary of data received from Paystack
            webhooks containing information on a successful or failed
            transfer.
        transfer_outcome (str): A string indicating the outcome of the
            transfer, could be `PaystackTransfer.TransferOutcome.SUCCESS` or
            `PaystackTransfer.TransferOutcome.FAILED`, for example.
    """

    data = request_data.get("data")

    reason = data.get("reason")

    arrear_id = extract_uuidv4s_from_string(reason, position=1)
    arrear = BillArrear.objects.get(uuid=arrear_id).select_related(
        "action",
        "participant",
        "bill",
        "bill__creditor",
    )

    action = arrear.action
    bill = arrear.bill

    paying_user = arrear.participant
    receiving_user = arrear.bill.creditor

    recipient_code = data.get("recipient").get("recipient_code")
    recipient = TransferRecipient.objects.get(
        recipient_code=recipient_code,
        user=receiving_user,
    )

    if transfer_outcome == PaystackTransfer.TransferOutcomeChoices.FAILED:
        arrear.mark_as_failed_transfer()

    if transfer_outcome == PaystackTransfer.TransferOutcomeChoices.REVERSED:
        arrear.mark_as_reversed_transfer()

    create_paystack_transfer_object(
        request_data=request_data,
        recipient=recipient,
        paying_user=paying_user,
        receiving_user=receiving_user,
        transfer_outcome=transfer_outcome,
        transfer_type=PaystackTransfer.TransferChoices.ARREAR_SETTLEMENT,
        action=action,
        arrear=arrear,
    )

    if (
        transfer_outcome == PaystackTransfer.TransferOutcomeChoices.FAILED
        or transfer_outcome == PaystackTransfer.TransferOutcomeChoices.REVERSED
    ):
        push_parameters_list = [
            {
                "token": paying_user.expo_push_token,
                "title": "Contribution transfer error",
                "message": (
                    "We could not successfully transfer your arrear contribution on"
                    f" {bill.name}. You can retry the transfer in the Halver app for"
                    " free."
                ),
                "extra": {
                    "action": "failed-or-reversed-transfer",
                    "bill_name": bill.name,
                    "bill_id": bill.uuid,
                },
            },
            {
                "token": receiving_user.expo_push_token,
                "title": "Contribution transfer error",
                "message": (
                    f"We could not successfully transfer {paying_user.full_name}'s"
                    f" arrear contribution on {bill.name}. You can retry the transfer"
                    " in the Halver app for free."
                ),
                "extra": {
                    "action": "failed-or-reversed-transfer",
                    "bill_name": bill.name,
                    "bill_id": bill.uuid,
                },
            },
        ]

        send_push_messages(push_parameters_list)


# TODO This should be carried out in a transaction. With select_for_updates
@shared_task
def finalize_arrear_contribution(
    request_data,
    transfer_outcome=PaystackTransfer.TransferOutcomeChoices.SUCCESSFUL,
):
    """Finalizes a contribution by creating a BillTransaction object, a
    PaystackTransfer object, and marking the corresponding BillAction as
    completed or ongoing, depending on the provided `action_status` showing
    it as one-time or recurring contribution.

    Args:
        request_data (dict): A dictionary of data received from Paystack
            webhooks containing information on a successful or failed
            transfer.
        transfer_outcome (str): A string indicating the outcome of the
            transfer, should be `PaystackTransfer.TransferOutcome.SUCCESS`.
    """

    data = request_data.get("data")

    reason = data.get("reason")

    # The final contribution is the amount transferred to the creditor.
    amount = data.get("amount")

    arrear_id = extract_uuidv4s_from_string(reason, position=1)
    arrear = BillArrear.objects.get(uuid=arrear_id).select_related(
        "action",
        "participant",
        "bill",
        "bill__creditor",
    )
    bill = arrear.bill
    action = arrear.action
    receiving_user = arrear.bill.creditor

    arrear.mark_as_completed()
    action.mark_as_ongoing()

    recipient_code = data.get("recipient").get("recipient_code")
    recipient = TransferRecipient.objects.get(
        recipient_code=recipient_code,
        user=receiving_user,
    )

    paystack_transfer_object = create_paystack_transfer_object(
        request_data=request_data,
        recipient=recipient,
        paying_user=arrear.participant,
        receiving_user=receiving_user,
        transfer_outcome=transfer_outcome,
        transfer_type=PaystackTransfer.TransferChoices.ARREAR_SETTLEMENT,
        action=action,
        arrear=arrear,
        reason=reason,
    )

    # Obtain Paystack ID of transaction that triggered this contribution
    paystack_transaction_id = extract_paystack_transaction_id_from_transfer_reason(
        reason
    )

    # Used to obtain the amount paid in transaction
    paystack_transaction_object = PaystackTransaction.objects.select_related(
        "paying_user"
    ).get(paystack_transaction_id=paystack_transaction_id)
    paying_user = paystack_transaction_object.paying_user

    bill_transaction_object = {
        "bill": bill,
        "contribution": convert_to_naira(amount),
        "paying_user": paying_user,
        "receiving_user": receiving_user,
        "transaction_type": BillTransaction.TypeChoices.ARREAR,
        "total_payment": paystack_transaction_object.amount_in_naira,
        "action": action,
        "arrear": arrear,
        "paystack_transaction": paystack_transaction_object,
        "paystack_transfer": paystack_transfer_object,
    }

    BillTransaction.objects.create(**bill_transaction_object)

    # Handle notifications after all other operations
    participants_push_parameters_list = [
        {
            "token": participant.expo_push_token,
            "title": f"💳 New arrear contribution on {bill.name}",
            "message": f"{paying_user.full_name} has just made a contribution.",
            "extra": {
                "action": "open-bill",
                "bill_name": bill.name,
                "bill_id": bill.uuid,
            },
        }
        for participant in bill.participants.all()
        if participant.expo_push_token and participant.uuid != paying_user.uuid
    ]

    receiving_user_push_parameters_list = [
        {
            "token": receiving_user.expo_push_token,
            "title": f"💳 New arrear contribution on {bill.name}",
            "message": f"{paying_user.full_name} has just made a contribution.",
            "extra": {
                "action": "open-bill",
                "bill_name": bill.name,
                "bill_id": bill.uuid,
            },
        },
    ]

    paying_user_push_parameters_list = [
        {
            "token": paying_user.expo_push_token,
            "title": "💳 Contrubution successful",
            "message": f"Your contribution towards {bill.name} was successful.",
            "extra": {
                "action": "open-bill",
                "bill_name": bill.name,
                "bill_id": bill.uuid,
            },
        },
    ]

    send_push_messages(
        [
            *participants_push_parameters_list,
            *receiving_user_push_parameters_list,
            *paying_user_push_parameters_list,
        ]
    )
