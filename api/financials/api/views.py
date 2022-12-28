from django.shortcuts import get_object_or_404
from rest_framework import generics, status, views
from rest_framework.response import Response

from ..models import UserCard
from .permissions import IsCardOwner
from .serializers import UserCardSerializer


class DefaultCardView(views.APIView):
    permission_classes = (IsCardOwner,)

    def get(self, request) -> Response:
        user = request.user
        default_card = user.cards.get(is_default=True, default=None)
        serializer = UserCardSerializer(default_card)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, _request, uid) -> Response:
        card = get_object_or_404(UserCard, uid=uid)
        card.set_as_default_card()
        serializer = UserCardSerializer(card)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserCardRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    queryset = UserCard.objects.all()
    serializer_class = UserCardSerializer
    permission_classes = (IsCardOwner,)

    # Ensure get request returns only a list of cards owned by a user.
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
