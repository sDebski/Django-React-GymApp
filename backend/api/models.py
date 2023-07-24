from django.db import models
from django.contrib.auth.models import User, AbstractBaseUser
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.utils import timezone


class MyUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, date_of_birth, password=None):
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            date_of_birth=date_of_birth,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_coach(self, email, first_name, last_name, date_of_birth, password=None):
        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            date_of_birth=date_of_birth,
        )
        user.is_coach = True

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self, email, first_name, last_name, date_of_birth, password=None
    ):
        user = self.create_user(
            email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            date_of_birth=date_of_birth,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(
        max_length=255,
        unique=True,
    )
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    is_active = models.BooleanField(default=True)
    is_coach = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    expiry_date = models.DateTimeField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    objects = MyUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "date_of_birth"]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


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
