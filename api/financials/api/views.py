from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import (
    ListAPIView,
    RetrieveDestroyAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import TransferRecipient, UserCard
from .permissions import IsOwner
from .serializers import TransferRecipientSerializer, UserCardSerializer


class DefaultCardRetrieveUpdateView(RetrieveUpdateAPIView):
    permission_classes = (IsOwner,)
    queryset = UserCard.objects.all()
    serializer_class = UserCardSerializer

    def get_object(self):
        user = self.request.user.cards
        return user.cards.get(is_default=True, default=None)


class UserCardListView(ListAPIView):
    queryset = UserCard.objects.all()
    serializer_class = UserCardSerializer
    permission_classes = (IsOwner,)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class UserCardRetrieveDestroyView(RetrieveDestroyAPIView):
    queryset = UserCard.objects.all()
    serializer_class = UserCardSerializer
    permission_classes = (IsOwner,)
    lookup_field = "uid"


class TransferRecipientAPIView(APIView):
    def get(self, request):
        recipients = TransferRecipient.objects.all()
        serializer = TransferRecipientSerializer(recipients, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TransferRecipientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransferRecipientDetailAPIView(APIView):
    def get_object(self, uid: str) -> TransferRecipient:
        return get_object_or_404(TransferRecipient, uid=uid)

    def get(self, request, uid: str):
        recipient = self.get_object(uid)
        serializer = TransferRecipientSerializer(recipient)
        return Response(serializer.data)

    def delete(self, request, uid: str):
        recipient = self.get_object(uid)
        recipient.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
