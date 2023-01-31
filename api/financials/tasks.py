from celery import shared_task

from core.utils.users import get_user_by_id
from financials.utils.cards import (
    handle_card_addition_paystack_transaction_object_creation,
    handle_card_object_creation,
)


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

    new_card = handle_card_object_creation(
        authorization,
        customer,
        user,
    )

    new_transaction = handle_card_addition_paystack_transaction_object_creation(
        data,
        metadata,
        new_card,
        user,
        request_data,
    )

    # Create transfer recipient w/handle_complete_transfer_recipient_creation
    # format paystack payload and pass user as well.
    # Go on to initiate and record transfer
    # Transfer would also be checked for in webhook by calling another delayed function
