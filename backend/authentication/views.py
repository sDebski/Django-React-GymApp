from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User
from .utils import send_email
from django.conf import settings
import jwt
from .serializers import EmailVerificationSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.views import APIView
from rest_framework import status, generics
from django.db import IntegrityError

import smtplib


from .utils import get_tokens_for_user
from .serializers import (
    ExerciseSerializer,
    RegistrationSerializer,
    PasswordChangeSerializer,
)


class getRoutes(APIView):
    def get(self, request):
        routes = [
            "/accounts/register/",
            "/accounts/login/",
            "/accounts/logout",
            "/accounts/change-passwd/",
            "/accounts/regtoken-refresh",
        ]
        return Response(routes)


class RegistrationView(generics.GenericAPIView):
    serializer_class = RegistrationSerializer

    def post(self, request):
        print(request.data)
        serializer = self.serializer_class(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            send_email(request, user)
            return Response(
                {"msg": "User succesfuly created. Authentication email send."},
                status=status.HTTP_201_CREATED,
            )
        except smtplib.SMTPException:
            user.delete()
            return Response(
                {"error": "Error while sending authentication email"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except:
            return Response(
                {"error": "Error while registering a user"},
                status=status.HTTP_400_BAD_REQUEST,
            )


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
            return Response(
                {"msg": "Email successfully activated."}, status=status.HTTP_200_OK
            )
        except jwt.ExpiredSignatureError:
            return Response(
                {"error": "Activation link expired"}, status=status.HTTP_400_BAD_REQUEST
            )
        except jwt.exceptions.DecodeError:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )


class LoginView(generics.GenericAPIView):
    def post(self, request):
        if "email" not in request.data or "password" not in request.data:
            return Response(
                {"msg": "Credentials missing"}, status=status.HTTP_400_BAD_REQUEST
            )
        email = request.data["email"]
        password = request.data["password"]
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            auth_data = get_tokens_for_user(request.user)
            return Response(
                {"msg": "Login Success", **auth_data}, status=status.HTTP_200_OK
            )
        return Response(
            {"msg": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


class LogoutView(generics.GenericAPIView):
    def post(self, request):
        logout(request)
        return Response({"msg": "Successfully Logged out"}, status=status.HTTP_200_OK)


class ChangePasswordView(generics.GenericAPIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request):
        serializer = PasswordChangeSerializer(
            context={"request": request}, data=request.data
        )
        try:
            serializer.is_valid(
                raise_exception=True
            )  # Another way to write is as in Line 17
            request.user.set_password(serializer.validated_data["new_password"])
            request.user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except:
            return Response(
                {"error": "Error while validating data"},
                status=status.HTTP_400_BAD_REQUEST,
            )
