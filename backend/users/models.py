from django.db import models
from django.contrib.auth.models import User, AbstractBaseUser
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.utils.translation import gettext_lazy as _
import os
from django.conf import settings
from django.db import models
from django.template.defaultfilters import slugify


class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("User must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_admin", True)
        extra_fields.setdefault("is_coach", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_admin") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser):
    email = models.EmailField(_("email address"), unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255, null=True)
    date_of_birth = models.DateField(null=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_coach = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name"]

    def __str__(self):
        return f"{self.id} {self.email}"

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    @property
    def first_name_last_name(self):
        return f"{self.first_name} {self.last_name}"


# class Exercise(models.Model):
#     DONE = "done"
#     CANCELED = "canceled"
#     AVAILABLE = "active"

#     STATUS = (
#         (DONE, ("Done - Exercise already took place.")),
#         (CANCELED, ("Canceled - Exercise canceled")),
#         (AVAILABLE, ("AVAILABLE - Exercises will take place ")),
#     )
#     name = models.CharField(max_length=32, default="Exercise")
#     host = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
#     body = models.TextField(max_length=256)
#     created = models.DateTimeField(auto_now_add=True)
#     data = models.DateTimeField(auto_now_add=True)

#     status = models.CharField(
#         max_length=32,
#         choices=STATUS,
#         default=AVAILABLE,
#     )

#     class Meta:
#         ordering = ["-created"]

#     def __str__(self) -> str:
#         return self.name


def get_image_filename(instance, filename):
    # import pdb

    # pdb.set_trace()
    name = instance.user.email
    slug = slugify(name)
    return f"profiles/{slug}-{filename}"


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to=get_image_filename, blank=True)
    bio = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.user.email

    @property
    def filename(self):
        return os.path.basename(self.image.name)
