from rest_framework.permissions import BasePermission


class IsCreator(BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj) -> bool:
        return request.user == obj.creator


class IsParticipant(BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj) -> bool:
        return request.user in obj.participants.all()


class IsCreditor(BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj) -> bool:
        return request.user == obj.creditor
