from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj) -> bool:
        return obj.user == request.user
