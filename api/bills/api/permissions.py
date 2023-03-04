from rest_framework.permissions import BasePermission

# -------------------------------------
# Bill Permissions
# -------------------------------------


class IsParticipant(BasePermission):
    """Custom permission class to check if the user making the request is a
    participant of the bill."""

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

    def has_permission(self, request, view):
        """Check if the user is authenticated."""
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """Check if the user is the creditor or creator of the bill."""
        return request.user == obj.creditor or request.user == obj.creator


class IsParticipantOrCreditor(BasePermission):
    """Custom permission class to check if the user making the request is a
    participant of the bill."""

    def has_permission(self, request, view) -> bool:
        """Check if the user is authenticated."""

        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj) -> bool:
        """Check if the user is a participant or the creditor of the bill."""

        return request.user in obj.participants.all() or request.user == obj.creditor


# -------------------------------------
# Action Permissions
# -------------------------------------


class IsRegisteredParticipant(BasePermission):
    """Permission class that checks if the user is a registered participant.

    To be considered a registered participant, the user must be authenticated
    and be included as the participant associated with the action instance to be
    updated.
    """

    def has_permission(self, request, view) -> bool:
        """Check if the user is authenticated."""

        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        """Check if the participant associated with the BillAction instance is
        registered. Also check if the participant is the person making the request.

        The participant must be associated with the BillAction instance via the
        'participant' attribute.
        """

        return bool(obj.participant) and (request.user == obj.participant)


class ParticipantHasDefaultCard(BasePermission):
    """Permission class that checks if the participant has a default card.

    To have a default card, the participant must be authenticated and have a
    'default_card' attribute that is not None.
    """

    def has_permission(self, request, view) -> bool:
        """Check if the user is authenticated."""

        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        """Check if the participant associated with the BillAction instance has
        a default card.

        The participant must be associated with the BillAction instance via the
        'participant' attribute.
        """

        participant = obj.participant
        return bool(participant.default_card)
