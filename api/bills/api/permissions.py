from rest_framework.permissions import BasePermission


class IsCreator(BasePermission):
    """
    Custom permission class to check if the user making the request is
    the creator of the bill.
    """

    def has_permission(self, request, view) -> bool:
        """
        Check if the user is authenticated.
        """

        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj) -> bool:
        """
        Check if the user is the creator of the bill.
        """

        return request.user == obj.creator


class IsParticipant(BasePermission):
    """
    Custom permission class to check if the user making the request is
    a participant of the bill.
    """

    def has_permission(self, request, view) -> bool:
        """
        Check if the user is authenticated.
        """

        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj) -> bool:
        """
        Check if the user is a participant of the bill.
        """

        return request.user in obj.participants.all()


class IsCreditor(BasePermission):
    """
    Custom permission class to check if the user making the request is
    the creditor of the bill.
    """

    def has_permission(self, request, view) -> bool:
        """
        Check if the user is authenticated.
        """

        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj) -> bool:
        """
        Check if the user is the creditor of the bill.
        """

        return request.user == obj.creditor
