from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Message
        fields = ["owner", "body"]
