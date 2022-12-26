from rest_framework import viewsets

from ..models import UserCard
from .permissions import IsAdmin
from .serializers import UserCardSerializer


class UserCardViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAdmin,)
    queryset = UserCard.objects.all()
    serializer_class = UserCardSerializer
    http_method_names = ["get"]
    lookup_field = "user__id"
