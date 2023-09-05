from django.contrib.auth import authenticate
from users.models import User
from rest_framework.exceptions import AuthenticationFailed
from decouple import config


def register_social_user(provider, user_id, email, name):
    filtered_user_by_email = User.objects.filter(email=email)

    if filtered_user_by_email.exists():
        if provider == filtered_user_by_email[0].auth_provider:
            registered_user = authenticate(
                email=email, password=config("SOCIAL_SECRET")
            )

            return {
                "user": {
                    "email": registered_user.email,
                    "first_name": registered_user.first_name,
                    "date_of_birth": "",
                    "is_coach": "false",
                },
                "tokens": registered_user.tokens(),
            }

        else:
            raise AuthenticationFailed(
                detail="Please continue your login using "
                + filtered_user_by_email[0].auth_provider
            )

    else:
        user = {
            "first_name": name,
            "email": email,
            "password": config("SOCIAL_SECRET"),
        }
        user = User.objects.create_user(**user)
        user.is_active = True
        user.auth_provider = provider
        user.save()

        new_user = authenticate(email=email, password=config("SOCIAL_SECRET"))
        return {
            "user": {
                "email": new_user.email,
                "first_name": new_user.first_name,
                "date_of_birth": "",
                "is_coach": "false",
            },
            "tokens": new_user.tokens(),
        }
