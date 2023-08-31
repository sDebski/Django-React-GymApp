from django.db import models
from users.models import User


# Create your models here.
class Message(models.Model):
    owner = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="owner"
    )
    receiver = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        default=None,
        blank=True,
        related_name="receiver",
    )
    body = models.CharField(max_length=512)
    created_at = models.DateTimeField(auto_now_add=True)
    delivered = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"ID: {self.id} | Owner: {self.owner.first_name_last_name} | Receiver: {self.receiver if self.receiver == None else self.receiver.first_name_last_name}"
