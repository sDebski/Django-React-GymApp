from django.db import models
from django.contrib.auth.models import User, AbstractBaseUser
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, date_of_birth, password=None):
        print("Tworze zwyklego usera")
        if not email:
            raise ValueError("User must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            date_of_birth=date_of_birth,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, password=None):
        print("Tworze super usera")
        if password is None:
            raise ValueError("Superuser must have a password.")

        user = self.create_user(
            email,
            first_name=first_name,
            last_name=None,
            date_of_birth=None,
            password=password,
        )
        user.is_admin = True
        user.is_active = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(max_length=255, unique=True, db_index=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255, null=True)
    date_of_birth = models.DateField(null=True)
    is_active = models.BooleanField(default=False)
    is_coach = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    expiry_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name"]

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
