from celery import shared_task

from core.utils.users import get_user_by_id
from financials.utils.cards import (
    create_card_addition_paystack_transaction_object,
    create_card_object_from_webhook,
)
from financials.utils.transfer_recipients import create_card_recipient_from_webhook


@shared_task
def process_card_creation(
    authorization,
    customer,
    user_id,
    data,
    metadata,
    request_data,
):

    user = get_user_by_id(user_id)

    new_card = create_card_object_from_webhook(
        authorization,
        customer,
        user,
    )

    create_card_addition_paystack_transaction_object(
        data,
        metadata,
        new_card,
        user,
        request_data,
    )

    new_card_recipient = create_card_recipient_from_webhook(
        metadata,
        customer,
        authorization,
        user,
        new_card,
    )

    # Create transfer recipient w/handle_complete_transfer_recipient_creation
    # format paystack payload and pass user as well.
    # Go on to initiate and record transfer
    # Transfer would also be checked for in webhook by calling another delayed function
