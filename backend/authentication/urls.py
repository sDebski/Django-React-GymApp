from django.urls import path
from .views import *
from rest_framework_simplejwt import views as jwt_views


urlpatterns = [
    path("", getRoutes),
    path("register/", RegistrationView, name="register"),
    path("login/", LoginView, name="login"),
    path("logout/", LogoutView, name="logout"),
    path("change-password/", ChangePasswordView, name="change_passwd"),
    path(
        "token-refresh/",
        jwt_views.TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path("email-verify", VerifyEmail.as_view(), name="email_verify"),
]
