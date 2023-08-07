from django.urls import path
from .views import *
from rest_framework_simplejwt import views as jwt_views

app_name = "users"

urlpatterns = [
    path("register/", RegistrationView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("change-password/", ChangePasswordView.as_view(), name="change_passwd"),
    path(
        "token-refresh/",
        jwt_views.TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path("email-verify/", VerifyEmail.as_view(), name="email_verify"),
    path(
        "password-reset/<uidb64>/<token>/",
        PasswordTokenCheckAPIView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "request-reset-email/",
        RequestPasswordResetEmailView.as_view(),
        name="request_reset_email",
    ),
    path(
        "password-reset-complete/",
        SetNewPasswordAPIView.as_view(),
        name="password_reset_complete",
    ),
]
