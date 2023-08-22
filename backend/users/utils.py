from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import EmailMessage
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import (
    smart_str,
    force_str,
    smart_bytes,
    DjangoUnicodeDecodeError,
)
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "first_name": str(user.first_name),
    }


def send_activation_email(request, user):
    token = RefreshToken.for_user(user).access_token
    current_site = get_current_site(request).domain
    relativeLink = reverse("users:email-verify")
    absurl = "http://" + current_site + relativeLink + "?token=" + str(token)
    redirect_url = request.data.get("redirect_url", "")
    email_body = (
        "Hi "
        + user.first_name
        + "! \nUse this link to verify your email: \n"
        + absurl
        + "&redirect_url="
        + redirect_url
    )

    data = {
        "email_body": email_body,
        "email_subject": "Verify your email",
        "to_email": user.email,
    }

    email = EmailMessage(
        subject=data["email_subject"],
        body=data["email_body"],
        to=[
            data["to_email"],
        ],
    )

    email.send(fail_silently=False)


def send_email_reset(request, user):
    current_site = get_current_site(request).domain
    uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
    token = PasswordResetTokenGenerator().make_token(user)
    relativeLink = reverse(
        "users:password-reset-confirm",
        kwargs={
            "uidb64": uidb64,
            "token": token,
        },
    )
    redirect_url = request.data.get("redirect_url", "")
    absurl = "http://" + current_site + relativeLink
    email_body = (
        "Hi,\n"
        + "Use this link to reset your password: \n"
        + absurl
        + "?redirect_url="
        + redirect_url
    )
    data = {
        "email_body": email_body,
        "email_subject": "Password reset",
        "to_email": user.email,
    }
    # print("currentsite", current_site)
    # print("uidb64", uidb64)
    # print("abs_url", absurl)
    # print("data", data)
    # print("relativeLink", relativeLink)
    # print("token", token)
    email = EmailMessage(
        subject=data["email_subject"], body=data["email_body"], to=[data["to_email"]]
    )

    email.send(fail_silently=False)
