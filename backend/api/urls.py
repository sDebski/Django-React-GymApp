from django.urls import path
from .views import *
from rest_framework_simplejwt import views as jwt_views
from django.contrib.auth import views as auth_views


urlpatterns = [
    path("", getRoutes),
    path("accounts/register/", RegistrationView, name="register"),
    path("accounts/login/", LoginView, name="login"),
    path("accounts/logout/", LogoutView, name="logout"),
    path("accounts/change-password/", ChangePasswordView, name="change_passwd"),
    path(
        "accounts/token-refresh/",
        jwt_views.TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path(
        "accounts/reset_password/",
        auth_views.PasswordResetView.as_view(),
        name="reset_password",
    ),
    path(
        "accounts/reset_password_done/",
        auth_views.PasswordResetDoneView.as_view(),
        name="password_reset_done",
    ),
    path(
        "accounts/reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "accounts/reset_password_complete/",
        auth_views.PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
    path("exercises/", getExercises),
]
