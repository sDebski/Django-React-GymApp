from django.shortcuts import render
from rest_framework import generics, permissions, response, status, views
from .pusher import pusher_client
from .serializers import MessageSerializer
from .models import Message
import datetime
import json


# Create your views here.
class MessageAPIView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = MessageSerializer
    queryset = Message.objects.all()

    def perform_create(self, serializer):
        print("tworze i wysylam wiadomosc o tresci: ", self.request.data["body"])
        now = datetime.datetime.now()
        dt_str = now.strftime("%m/%d/%Y, %H:%M:%S")
        last_name = (
            "" if self.request.user.last_name == None else self.request.user.last_name
        )
        json_obj = {
            "username": self.request.user.first_name + " " + last_name,
            "message": self.request.data["body"],
            "created_at": str(dt_str),
        }
        data = json.dumps(json_obj)

        chat = self.request.data.pop("chat")
        pusher_client.trigger(
            chat,
            "message",
            data,
        )
        return serializer.save(owner=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)
