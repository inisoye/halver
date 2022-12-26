from rest_framework import serializers

from ..models import UserCard


class UserCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCard
        fields = "__all__"
