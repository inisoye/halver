from django.db import transaction

from bills.models import Bill, BillAction, BillUnregisteredParticipant
from financials.models import PaystackPlan, PaystackPlanFailure


@transaction.atomic
def transfer_unregistered_participant_data(
    registered_user, unregistered_participant_phone=None
):
    """
    Transfer data from an unregistered participant to a registered participant/user and
    delete the unregistered participant object. If the `unregistered_participant_phone`
    argument is not provided, all unregistered participants that have a registered user's
    phone number will be used.

    Args:
        registered_user (User): The registered user object to transfer the data to.
        unregistered_participant_phone (str, optional): The phone number of the
            unregistered participant object.

    Raises:
        BillUnregisteredParticipant.DoesNotExist: If the unregistered participant object
            does not exist.
    """

    participant = registered_user

    # In this case, search for unregistered users that have the same phone number as the
    # registered user/participant.
    if unregistered_participant_phone is None:
        unregistered_participant_phone = participant.phone

    unregistered_participant = BillUnregisteredParticipant.get(
        phone=unregistered_participant_phone
    )

    # Update each model with the newly registered participant and remove the association
    # with the unregistered participant object.
    BillAction.objects.filter(unregistered_participant=unregistered_participant).update(
        participant=participant,
        unregistered_participant=None,
    )
    Bill.objects.filter(unregistered_participant=unregistered_participant).update(
        participant=participant,
        unregistered_participant=None,
    )
    PaystackPlan.objects.filter(
        unregistered_participant=unregistered_participant
    ).update(
        participant=participant,
        unregistered_participant=None,
    )
    PaystackPlanFailure.objects.filter(
        unregistered_participant=unregistered_participant
    ).update(
        participant=participant,
        unregistered_participant=None,
    )

    # Delete the unregistered participant object.
    unregistered_participant.delete()
