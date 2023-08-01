from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import User


class MyUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = (
            "email",
            "first_name",
            "last_name",
            "date_of_birth",
        )


class MyUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = (
            "email",
            "first_name",
            "last_name",
            "date_of_birth",
            "password",
            "is_active",
            "is_coach",
            "is_admin",
        )
