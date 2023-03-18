from django.db import transaction

from bills.models import Bill, BillAction, BillUnregisteredParticipant
from financials.models import PaystackPlan, PaystackPlanFailure


@transaction.atomic
def transfer_unregistered_participant_data(
    registered_user, unregistered_participant_phone=None
):
    """
    Transfer data from an unregistered participant to a registered participant/user and
    delete the unregistered participant object.

    If `unregistered_participant_phone` is provided, transfer data only for the
    unregistered participant with the given phone number.
    If `unregistered_participant_phone` is not provided, transfer data for all
    unregistered participants who share a phone number with `registered_user`.

    Args:
        registered_user (User): The registered user object to transfer the data to.
        unregistered_participant_phone (str, optional): The phone number of the
            unregistered participant to transfer. If not provided, data for all
            unregistered participants sharing a phone number with `registered_user`
            will be transferred.

    Raises:
        BillUnregisteredParticipant.DoesNotExist: If the unregistered participant object
            does not exist.

    Returns:
        bool: True if the data transfer occured, False otherwise.
    """

    participant = registered_user

    # In this case, search for unregistered users that have the same phone number as the
    # registered user/participant.
    if unregistered_participant_phone is None:
        unregistered_participant_phone = participant.phone

    # TODO Add an index to the unregistered participant phone field.
    unregistered_participant_to_transfer = (
        BillUnregisteredParticipant.objects.get(phone=unregistered_participant_phone)
        if unregistered_participant_phone
        else None
    )

    if unregistered_participant_to_transfer:

        # Get the bills that contain the unregistered participant and exclude those
        # that already have the participant
        bills_to_transfer = Bill.objects.filter(
            unregistered_participants=unregistered_participant_to_transfer
        ).exclude(participants=participant)

        actions_to_transfer = BillAction.objects.filter(
            unregistered_participant=unregistered_participant_to_transfer,
            participant=None,
        ).exclude(bill__participants=participant)

        plans_to_transfer = PaystackPlan.objects.filter(
            unregistered_participant=unregistered_participant_to_transfer,
            participant=None,
        ).exclude(action__bill__participants=participant)

        failures_to_transfer = PaystackPlanFailure.objects.filter(
            unregistered_participant=unregistered_participant_to_transfer,
            participant=None,
        ).exclude(action__bill__participants=participant)

        # Ensure both bills and actions exist before transferring any data.
        if bills_to_transfer and actions_to_transfer:

            # Update each model with the newly registered participant and remove the
            # association with the unregistered participant object.

            # -------------------------------------
            # Transfer actions
            # -------------------------------------

            actions_to_transfer.update(
                participant=participant,
                unregistered_participant=None,
                status=BillAction.StatusChoices.PENDING,
            )

            # -------------------------------------
            # Transfer plans
            # -------------------------------------

            plans_to_transfer.update(
                participant=participant,
                unregistered_participant=None,
            )

            # -------------------------------------
            # Transfer plan failures
            # -------------------------------------

            failures_to_transfer.update(
                participant=participant,
                unregistered_participant=None,
            )

            # -------------------------------------
            # Transfer bills
            # -------------------------------------

            # The transfer of the bills is more complex than it is for the other models.
            # This is due to the fact that participants and unregistered particpants have
            # a many-to-many-relation with the bill model.

            # Adding and removing in a loop has been avoided due to n+1.

            # The approach was inspired by: https://stackoverflow.com/a/36823156/15063835
            # More details available:
            # https://www.notion.so/inisoye/Transfer-of-unregistered-participant-s-data-to-a-registered-user-f376b19d172c4de69e60170a979d5675?pvs=4

            # ! The order should be kept this way (bulk delete before bulk create).
            # ! This apparently prevents data integrity issues.

            # Use bulk_delete() to remove the unregistered participants from the bills.
            Bill.unregistered_participants.through.objects.filter(
                bill__in=bills_to_transfer,
                billunregisteredparticipant_id=unregistered_participant_to_transfer.id,
            ).delete()

            # Create a list of new participant IDs to be added to the bills.
            # The same participant is added to each bill so it is repeated.
            new_participant_ids = [participant.id] * bills_to_transfer.count()

            # Use bulk_create() to add the new participants to the bills.
            Bill.participants.through.objects.bulk_create(
                [
                    Bill.participants.through(
                        bill_id=bill.id, customuser_id=participant_id
                    )
                    for bill, participant_id in zip(
                        bills_to_transfer, new_participant_ids
                    )
                ]
            )

            # Delete the unregistered participant object.
            unregistered_participant_to_transfer.delete()

            # Return true to confirm a successful data transfer.
            return True

        else:

            # Return false if there was no data to be transferred.
            return False

    # Return false if no unregistered partipant was found.
    return False
