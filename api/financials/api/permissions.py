from rest_framework.permissions import BasePermission


class IsCardOwner(BasePermission):
    def has_object_permission(self, request, view, obj) -> bool:
        return obj.user == request.user
