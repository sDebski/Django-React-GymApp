from django.urls import path
from .views import *
from rest_framework_simplejwt import views as jwt_views

app_name = "users"

urlpatterns = [
    path("", UserView.as_view(), name="user-info"),
    path("register/", RegistrationView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("profile/avatar/", UserAvatarView.as_view(), name="user-avatar"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path(
        "token-refresh/",
        jwt_views.TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path("email-verify/", VerifyEmail.as_view(), name="email-verify"),
    path(
        "password-reset/<uidb64>/<token>/",
        PasswordTokenCheckView.as_view(),
        name="password-reset-confirm",
    ),
    path(
        "request-reset-email/",
        RequestPasswordResetEmailView.as_view(),
        name="request-reset-email",
    ),
    path(
        "password-reset-complete/",
        SetNewPasswordView.as_view(),
        name="password-reset-complete",
    ),
]
