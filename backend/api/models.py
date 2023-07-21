from django.db import models
from django.contrib.auth.models import User, AbstractUser


# Create your models here.
class User(AbstractUser):
    first_name = models.CharField(max_length=200, null=True)
    last_name = models.CharField(max_length=200, null=True)
    email = models.EmailField(null=True, unique=True)
    bio = models.TextField(null=True)

    avatar = models.ImageField(null=True, default="")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self) -> str:
        return self.first_name


class Exercise(models.Model):
    DONE = "done"
    CANCELED = "canceled"
    AVAILABLE = "active"

    STATUS = (
        (DONE, ("Done - Exercise already took place.")),
        (CANCELED, ("Canceled - Exercise canceled")),
        (AVAILABLE, ("AVAILABLE - Exercises will take place ")),
    )
    name = models.CharField(max_length=32, default="Exercise")
    host = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    body = models.TextField(max_length=256)
    created = models.DateTimeField(auto_now_add=True)
    data = models.DateTimeField(auto_now_add=True)

    status = models.CharField(
        max_length=32,
        choices=STATUS,
        default=AVAILABLE,
    )

    class Meta:
        ordering = ["-created"]

    def __str__(self) -> str:
        return self.name
