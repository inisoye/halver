from rest_framework.permissions import BasePermission

# -------------------------------------
# Bill Permissions
# -------------------------------------


class IsParticipant(BasePermission):
    """Custom permission class to check if the user making the request is a
    participant of the bill."""

    message = "You must be a participant in this bill to continue."

    def has_permission(self, request, view) -> bool:
        """Check if the user is authenticated."""

        if request.user.is_authenticated:
            return True

        return False

    def has_object_permission(self, request, view, obj) -> bool:
        """Check if the user is a participant of the bill."""

        return request.user in obj.participants.all()


class IsCreditor(BasePermission):
    """Custom permission class to check if the user making the request is the
    creditor of the bill."""

    message = "You must be the creditor of the bill to continue."

    def has_permission(self, request, view) -> bool:
        """Check if the user is authenticated."""

        if request.user.is_authenticated:
            return True

        return False

    def has_object_permission(self, request, view, obj) -> bool:
        """Check if the user is the creditor of the bill."""

        return request.user == obj.creditor


class IsCreator(BasePermission):
    """Custom permission class to check if the user making the request is the
    creator of the bill."""

    message = "You must be the creator of the bill to continue."

    def has_permission(self, request, view) -> bool:
        """Check if the user is authenticated."""

        if request.user.is_authenticated:
            return True

        return False

    def has_object_permission(self, request, view, obj) -> bool:
        """Check if the user is the creator of the bill."""

        return request.user == obj.creator


class IsCreditorOrCreator(BasePermission):
    """Custom permission class to check if the user making the request is either
    the creditor or creator of the bill."""

    message = "Only the creditor and creators of a bill can perform this action."

    def has_permission(self, request, view):
        """Check if the user is authenticated."""

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """Check if the user is the creditor or creator of the bill."""

        return request.user == obj.creditor or request.user == obj.creator


class IsParticipantOrCreditor(BasePermission):
    """Custom permission class to check if the user making the request is a
    participant of the bill."""

    message = "You need to be a participant or the creditor of this bill to continue."

    def has_permission(self, request, view) -> bool:
        """Check if the user is authenticated."""

        if request.user.is_authenticated:
            return True

        return False

    def has_object_permission(self, request, view, obj) -> bool:
        """Check if the user is a participant or the creditor of the bill."""

        return request.user in obj.participants.all() or request.user == obj.creditor


# -------------------------------------
# BillAction/BillArrears Permissions
# -------------------------------------


class IsOwningParticipant(BasePermission):
    """Permission class that checks if the user is a the participant that owns
    the object.

    To be considered an owning participant, the user must be authenticated
    and be included as the participant associated with the action/arrear instance to be
    updated.
    """

    message = "You need to be the owning participant to continue."

    def has_permission(self, request, view) -> bool:
        """Check if the user is authenticated."""

        if request.user.is_authenticated:
            return True

        return False

    def has_object_permission(self, request, view, obj):
        """Check if the participant associated with the BillAction/BillArrear
        instance is is the person making the request.

        The participant must be associated with the BillAction/BillArrear
        instance via the 'participant' attribute.
        """

        if not obj.participant:
            return False

        return request.user == obj.participant


class ParticipantHasDefaultCard(BasePermission):
    """Permission class that checks if the participant has a default card.

    To have a default card, the participant must be authenticated and have a
    'default_card' attribute that is not None.
    """

    message = "You need to add a default card to continue."

    def has_permission(self, request, view) -> bool:
        """Check if the user is authenticated."""

        if request.user.is_authenticated:
            return True

        return False

    def has_object_permission(self, request, view, obj):
        """Check if the participant associated with the BillAction/BillArrear
        instance has a default card.

        The participant must be associated with the BillAction/BillArrear
        instance via the 'participant' attribute.
        """

        participant = obj.participant
        return bool(participant.default_card)


class IsOwningParticipantOrCreditor(BasePermission):
    """Permission class that checks if the user is a the participant that owns
    the object or is the creditor.

    To be considered an owning participant, the user must be authenticated
    and be included as the participant associated with the action/arrear instance to be
    updated.
    """

    message = (
        "You need to be the owning participant or the creditor of this bill to"
        " continue."
    )

    def has_permission(self, request, view) -> bool:
        """Check if the user is authenticated."""

        if request.user.is_authenticated:
            return True

        return False

    def has_object_permission(self, request, view, obj):
        """Check if person making the request the participant either the
        participant or creditor associated with the BillAction/BillArrear
        instance.

        The participant must be associated with the BillAction/BillArrear
        instance via the 'participant' attribute.
        """

        if not obj.participant:
            return False

        return (request.user == obj.participant) or (request.user == obj.bill.creditor)


class IsOwningParticipantOrCreditorOrCreator(BasePermission):
    """Permission class that checks if the user is a the participant that owns
    the object, is the creditor or is the bill creator.

    To be considered an owning participant, the user must be authenticated
    and be included as the participant associated with the action/arrear instance to be
    updated.
    """

    message = (
        "You need to be either the owning participant, the creditor or the creator of"
        " this bill to continue."
    )

    def has_permission(self, request, view) -> bool:
        """Check if the user is authenticated."""

        if request.user.is_authenticated:
            return True

        return False

    def has_object_permission(self, request, view, obj):
        """Check if person making the request the participant either the
        participant or creditor associated with the BillAction/BillArrear
        instance.

        The participant must be associated with the BillAction/BillArrear
        instance via the 'participant' attribute.
        """

        if not obj.participant:
            return False

        return (
            (request.user == obj.participant)
            or (request.user == obj.bill.creditor)
            or (request.user == obj.bill.creator)
        )
