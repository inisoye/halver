import uuid

from celery.utils.log import get_task_logger

from bills.models import BillAction, BillTransaction
from core.utils.currency import convert_to_kobo_integer, convert_to_naira
from core.utils.dates_and_time import check_date_is_in_past, get_one_day_from_now
from core.utils.strings import extract_uuidv4s_from_string
from financials.models import PaystackTransaction, PaystackTransfer, UserCard
from financials.utils.transfers import (
    create_paystack_transfer_object,
    extract_paystack_transaction_id_from_transfer_reason,
)
from libraries.paystack.subscription_requests import SubscriptionRequests
from libraries.paystack.transaction_requests import TransactionRequests
from libraries.paystack.transfer_requests import TransferRequests

logger = get_task_logger(__name__)


def handle_one_time_contribution(
    bill_name,
    participant_name,
    action_uuid_string,
    participant_uuid_string,
    creditor_uuid_string,
    participant_card,
    amount_in_kobo,
):
    """Handle a one-time contribution by creating a Paystack charge for a
    participant's card (or authorization as it is called by Paystack).

    Args:
        bill_name (str): The name of the bill being contributed to.
        participant_name (str): The name of the participant making the contribution.
        participant_uuid_string (str): The UUID string of the participant making the
            contribution.
        creditor_uuid_string (str): The UUID string of the creditor receiving the
            contribution.
        participant_card (dict): A dictionary representing the participant's card,
            containing an authorization code and email.
        amount_in_kobo (int): The amount of the contribution in kobo (the smallest
            currency unit in Nigeria).

    Returns:
        dict: A dictionary representing the Paystack charge created for the contribution.
    """

    transaction_type = f"One time contribution to {bill_name} bill."

    metadata = {
        "full_name": participant_name,
        "action_id": action_uuid_string,
        "user_id": participant_uuid_string,
        "creditor_id": creditor_uuid_string,
        "is_contribution": True,
        "transaction_type": transaction_type,
        "custom_fields": [
            {
                "display_name": "User's Full Name",
                "variable_name": "full_name",
                "value": participant_name,
            },
            {
                "display_name": "User ID",
                "variable_name": "user_id",
                "value": participant_uuid_string,
            },
            {
                "display_name": "Transaction Type",
                "variable_name": "transaction_type",
                "value": transaction_type,
            },
        ],
    }

    charge_response = TransactionRequests.charge(
        authorization_code=participant_card.authorization_code,
        email=participant_card.email,
        amount=amount_in_kobo,
        metadata=metadata,
        channels=["card"],
    )

    return charge_response


def handle_subscription_creation(bill, participant_card, action):
    """Create a Paystack subscription for a participant based on a bill,
    participant's card details, and a triggering action.

    Args:
        bill: A Bill object.
        participant_card: A UserCard object containing the participant's card details.
        action: A BillAction object relevant to the subscription.

    Returns:
        A response object from SubscriptionRequests.create.
    """

    first_charge_date = bill.first_charge_date
    is_first_charge_date_in_past = check_date_is_in_past(first_charge_date)

    # Pick a random next payment date (within the bill) to use when first charge date
    # is already in the past.
    first_action_with_subscription = bill.actions.filter(
        paystack_subscription__isnull=False
    ).first()
    selected_next_start_date = (
        first_action_with_subscription.paystack_subscription.next_payment_date
        if first_action_with_subscription
        else None
    )

    subscription_start_date = None

    has_first_charge_date_passed_with_no_subscriptions = (
        is_first_charge_date_in_past and (not first_action_with_subscription)
    )

    if has_first_charge_date_passed_with_no_subscriptions:
        new_first_charge_date = get_one_day_from_now(
            use_day_start=True,
        )
        bill.change_first_charge_date(new_first_charge_date)
        subscription_start_date = new_first_charge_date

    else:
        subscription_start_date = (
            selected_next_start_date
            if is_first_charge_date_in_past
            else first_charge_date
        )

    response = SubscriptionRequests.create(
        customer=participant_card.email,
        plan=action.paystack_plan.plan_code,
        authorization=participant_card.authorization_code,
        start_date=str(subscription_start_date),
    )

    return response


def handle_bill_contribution(action):
    """Handle a contribution to a bill by either creating a Paystack charge for
    a one-time payment or creating a subscription to automatically charge the
    participant's card over a given interval.

    The function is called after a valid response to a bill action is recieved.

    Args:
        action (object): An object representing the action to be taken, containing a
            bill and a participant.

    Returns:
        dict or none: A dictionary representing the Paystack charge created for the
            contribution (if the bill is not recurring) or a dictionary representing the
            subscription. If the subscription has already been created, returns None.
    """

    action_uuid_string = action.uuid.__str__()

    bill = action.bill
    bill_name = bill.name
    is_bill_recurring = bill.is_recurring

    amount = action.total_payment_due
    amount_in_kobo = convert_to_kobo_integer(amount)

    creditor = bill.creditor
    creditor_uuid_string = creditor.uuid.__str__()

    participant = action.participant
    participant_card = participant.default_card
    participant_name = participant.full_name
    participant_uuid_string = participant.uuid.__str__()

    # Handle one-time payments
    if not is_bill_recurring:
        charge_response = handle_one_time_contribution(
            bill_name=bill_name,
            action_uuid_string=action_uuid_string,
            participant_name=participant_name,
            participant_uuid_string=participant_uuid_string,
            creditor_uuid_string=creditor_uuid_string,
            participant_card=participant_card,
            amount_in_kobo=amount_in_kobo,
        )

        return charge_response

    # Handle recurring payments/subscriptions
    has_subscription_been_created_already = (
        hasattr(action, "paystack_subscription")
        and action.paystack_subscription is not None
    )

    # Handle new subscriptions
    if not has_subscription_been_created_already:
        subscription_creation_response = handle_subscription_creation(
            bill, participant_card, action
        )

        return subscription_creation_response

    # Subscription has already been created
    return None


def create_contribution_transaction_object(
    data, action, participant, request_data, transaction_type
):
    """Creates a new PaystackTransaction object for a participant payment.

    Args:
        data (dict): A dictionary containing information about the payment, including
            the amount and authorization signature. As obtained in Paystack webhook.
        action (str): The action being performed in the transaction.
        participant (CustomUser): The participant who is making the payment.
        request_data (dict): A dictionary containing the complete response from Paystack.
        transaction type: PaystackTransaction.TransactionChoices option.

    Returns:
        PaystackTransaction: The newly created PaystackTransaction object.
    """

    amount = data.get("amount")
    amount_in_naira = convert_to_naira(amount)

    authorization_signature = data.get("authorization").get("signature")
    card = UserCard.objects.get(signature=authorization_signature)

    paystack_transaction_object = {
        "amount": amount,
        "amount_in_naira": amount_in_naira,
        "card": card,
        "action": action,
        "paying_user": participant,
        "transaction_outcome": PaystackTransaction.TransactionOutcomeChoices.SUCCESSFUL,
        "transaction_type": transaction_type,
        "paystack_transaction_id": data.get("id"),
        "paystack_transaction_reference": data.get("reference"),
        "complete_paystack_response": request_data,
    }

    new_transaction = PaystackTransaction.objects.create(**paystack_transaction_object)

    return new_transaction


def initiate_contribution_transfer(
    contribution_amount,
    creditor_default_recipient_code,
    reason,
) -> None:
    """Initiates a transfer of a contribution to a creditor's default recipient
    account/card.

    Args:
        contribution_amount (float): The amount of money to be transferred.
        creditor_default_recipient_code (str): The code for the creditor's default
            recipient account/card.
        reason (str): The reason for the transfer.

    Returns:
        None
    """

    paystack_transfer_payload = {
        "source": "balance",
        "amount": contribution_amount,
        "recipient": creditor_default_recipient_code,
        "reason": reason,
        "reference": str(uuid.uuid4()),
    }

    response = TransferRequests.initiate(**paystack_transfer_payload)

    if not response["status"]:
        paystack_error = response["message"]
        logger.error(f"Error intiating Paystack transfer: {paystack_error}")


def process_contribution_transfer(action_id, request_data, transaction_type):
    """Common function to process contributions and initiate Paystack transfers.
    Used for one-time and subscription contribution transfers.

    Creates a transaction object in db for the contribution and initiates a Paystack
    transfer to the bill's creditor.

    Args:
        action_id (str): The UUID of the BillAction object.
        request_data (dict): The JSON request data received from the Paystack webhook.
        transaction_type (str): The type of transaction to be recorded in the
            PaystackTransaction object.
    """

    action = BillAction.objects.select_related(
        "participant", "bill", "bill__creditor"
    ).get(uuid=action_id)

    action.mark_as_pending_transfer()

    contribution_amount = action.contribution
    contribution_amount_in_kobo = convert_to_kobo_integer(contribution_amount)

    participant = action.participant
    participant_name = participant.full_name

    bill = action.bill
    bill_name = bill.name
    is_bill_recurring = bill.is_recurring

    creditor = bill.creditor
    creditor_name = creditor.full_name
    creditor_default_recipient_code = creditor.default_transfer_recipient.recipient_code

    data = request_data.get("data")

    # Update next payment date on subscription object for recurring bills
    if is_bill_recurring:
        subscription_object = action.paystack_subscription
        subscription_code = subscription_object.paystack_subscription_code

        paystack_subscription_response = SubscriptionRequests.fetch(subscription_code)
        next_payment_date = paystack_subscription_response.get("data").get(
            "next_payment_date"
        )

        subscription_object.change_next_payment_date(next_payment_date)

    create_contribution_transaction_object(
        data=data,
        action=action,
        participant=participant,
        request_data=request_data,
        transaction_type=transaction_type,
    )

    # Use this to get specific transaction when recording bill transaction in db.
    # Check finalize_contribution method
    paystack_transaction_id = data.get("id")

    # ! Be careful not to change "transfer_reason" string format without a good reason.
    # ! The subscription flow is heavily dependent on the uuids in it.
    transfer_reason = (
        f"{transaction_type.label} transfer for action with ID: {action_id} from"
        f" {participant_name} to {creditor_name}, on bill: {bill_name}. Paystack"
        f" transaction id: {paystack_transaction_id}."
    )

    initiate_contribution_transfer(
        contribution_amount=contribution_amount_in_kobo,
        creditor_default_recipient_code=creditor_default_recipient_code,
        reason=transfer_reason,
    )


def finalize_contribution(request_data, transfer_outcome, final_action_status):
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
        action_status (str): A string indicating what status value the action
            should be updated to. Could be `BillAction.StatusChoices.COMPLETED` or`
            BillAction.StatusChoices.ONGOING`, for example.
    """

    data = request_data.get("data")

    reason = data.get("reason")

    # The final contribution is the amount transferred to the creditor.
    amount = data.get("amount")

    action_id = extract_uuidv4s_from_string(reason, position=1)
    action = BillAction.objects.get(uuid=action_id)

    # The action is effectively complete or ongoing as the transfer has been successful.
    if final_action_status == BillAction.StatusChoices.COMPLETED:
        action.mark_as_completed()

    elif final_action_status == BillAction.StatusChoices.ONGOING:
        action.mark_as_ongoing()

    paystack_transfer_object = create_paystack_transfer_object(
        request_data=request_data,
        transfer_outcome=transfer_outcome,
        transfer_type=PaystackTransfer.TransferChoices.CREDITOR_SETTLEMENT,
        action=action,
    )

    # Obtain Paystack ID of transaction that triggered this contribution
    paystack_transaction_id = extract_paystack_transaction_id_from_transfer_reason(
        reason
    )

    # Used to obtain the amount paid in transaction
    paystack_transaction_object = PaystackTransaction.objects.get(
        paystack_transaction_id=paystack_transaction_id
    )

    bill_transaction_object = {
        "bill": action.bill,
        "contribution": convert_to_naira(amount),
        "total_payment": paystack_transaction_object.amount_in_naira,
        "action": action,
        "paystack_transaction": paystack_transaction_object,
        "paystack_transfer": paystack_transfer_object,
    }

    BillTransaction.objects.create(**bill_transaction_object)
