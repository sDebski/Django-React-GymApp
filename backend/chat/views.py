from django.shortcuts import render
from rest_framework import generics, permissions, response, status, views
from .pusher import pusher_client
from .serializers import MessageSerializer
from .models import Message


# Create your views here.
class MessageAPIView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = MessageSerializer
    queryset = Message.objects.all()

    def perform_create(self, serializer):
        pusher_client.trigger(
            "chat",
            "message",
            {
                "username": self.request.user.first_name,
                "message": self.request.data["body"],
            },
        )
        return serializer.save(owner=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)
