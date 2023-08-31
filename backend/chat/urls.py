from django.urls import path
from . import views

app_name = "chat"
urlpatterns = [
    path("messages/", views.MessageAPIView.as_view(), name="messages"),
]
