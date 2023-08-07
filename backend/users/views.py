from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.status import *
from .models import User, Profile
from .utils import send_activation_email
from django.conf import settings
import jwt
from .serializers import EmailVerificationSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework import permissions, generics

from .serializers import *
from utils.renderers import UserRenderer

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


class RegistrationView(generics.GenericAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = (AllowAny,)
    renderer_classes = (UserRenderer,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        send_activation_email(request, user)
        msg = "User succesfuly created. Authentication email send."
        status = HTTP_201_CREATED
        return Response({"msg": msg}, status=status)


class VerifyEmail(APIView):
    serializer_class = EmailVerificationSerializer

    token_param_config = openapi.Parameter(
        "token",
        in_=openapi.IN_QUERY,
        description="Desription",
        type=openapi.TYPE_STRING,
    )

    @swagger_auto_schema(manual_parameters=[token_param_config])
    def get(self, request):
        token = request.GET.get("token")
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, options={"verify_signature": False}
            )
            user = User.objects.get(id=payload["user_id"])
            if not user.is_active:
                user.is_active = True
                user.save()
            msg = "Email successfully activated."
            status = HTTP_200_OK
            return Response({"msg": msg}, status=status)
        except jwt.ExpiredSignatureError:
            error_msg = "Activation link expired"
            status = HTTP_400_BAD_REQUEST
            return Response({"error": error_msg}, status=status)
        except jwt.exceptions.DecodeError:
            error_msg = "Invalid token"
            status = HTTP_400_BAD_REQUEST
            return Response({"error": error_msg}, status=status)
        except:
            error_msg = "Invalid data"
            status = HTTP_400_BAD_REQUEST
            return Response({"error": error_msg}, status=status)


class LoginView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        serializer = UserSerializer(user)
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh": str(token), "access": str(token.access_token)}
        return Response(data, status=HTTP_200_OK)


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=HTTP_205_RESET_CONTENT)
        except Exception as e:
            print(e)
            return Response(status=HTTP_400_BAD_REQUEST)


class UserView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user.profile


class UserAvatarView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileAvatarSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user.profile


class ChangePasswordView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PasswordChangeSerializer

    def post(self, request):
        serializer = self.serializer_class(
            context={"request": request}, data=request.data
        )
        try:
            serializer.is_valid(raise_exception=True)
            request.user.set_password(serializer.validated_data["new_password"])
            request.user.save()
            return Response(status=HTTP_204_NO_CONTENT)

        except:
            error_msg = "Error while validating data"
            status = HTTP_400_BAD_REQUEST
            return Response({"error": error_msg}, status=status)


class RequestPasswordResetEmailView(generics.GenericAPIView):
    serializer_class = ResetPasswordRequestSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = request.data.get("email", "")

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            send_email_reset(request=request, user=user)

        return Response(
            {"success": "Email with password reset has been sent."},
            status=HTTP_200_OK,
        )


class PasswordTokenCheckView(generics.GenericAPIView):
    def get(self, request, uidb64, token):
        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token=token):
                return Response(
                    {"error": "Token is not valid any more, request a new one, please"},
                    status=HTTP_400_BAD_REQUEST,
                )
            return Response(
                {
                    "success": True,
                    "message": "Credentials Valid",
                    "uidb64": uidb64,
                    "token": token,
                },
                status=HTTP_200_OK,
            )

        except DjangoUnicodeDecodeError:
            return Response(
                {"error": "Token is not valid, request a new one, please"},
                status=HTTP_400_BAD_REQUEST,
            )


class SetNewPasswordView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            {"success": True, "msg": "Password reset success"},
            status=HTTP_200_OK,
        )
