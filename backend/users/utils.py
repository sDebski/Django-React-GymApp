from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import EmailMessage
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "first_name": str(user.first_name),
    }


def send_email(request, user):
    token = RefreshToken.for_user(user).access_token
    print(token)
    current_site = get_current_site(request).domain
    print(current_site)
    relativeLink = reverse("users:email_verify")
    absurl = "http://" + current_site + relativeLink + "?token=" + str(token)

    email_body = (
        "Hi " + user.first_name + "! \nUse this link to verify your email: \n" + absurl
    )

    data = {
        "email_body": email_body,
        "email_subject": "Verify your email",
        "to_email": user.email,
    }

    email = EmailMessage(
        subject=data["email_subject"], body=data["email_body"], to=[data["to_email"]]
    )

    email.send(fail_silently=False)
