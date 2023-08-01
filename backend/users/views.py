from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.status import *
from .models import User, Profile
from .utils import send_email
from django.conf import settings
import jwt
from .serializers import EmailVerificationSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework import permissions, serializers, generics

from .utils import get_tokens_for_user
from .serializers import *


class getRoutes(APIView):
    def get(self, request):
        routes = [
            "/accounts/register/",
            "/accounts/login/",
            "/accounts/logout",
            "/accounts/change-passwd/",
            "/accounts/token-refresh",
        ]
        return Response(routes)


class RegistrationView(generics.GenericAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        # try:
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # try:
        print("wchodze do wysylania")
        send_email(request, user)
        msg = "User succesfuly created. Authentication email send."
        status = HTTP_201_CREATED
        return Response({"msg": msg}, status=status)
        # except:
        #     error_msg = "Error while registering a user"
        #     status = HTTP_400_BAD_REQUEST
        #     return Response({"error": error_msg}, status=status)


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
        try:
            serializer = self.serializer_class(data=self.request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data
            serializer = UserSerializer(user)
            token = RefreshToken.for_user(user)
            data = serializer.data
            print(data)
            data["tokens"] = {"refresh": str(token), "access": str(token.access_token)}
            return Response(data, status=HTTP_200_OK)
        except:
            error_msg = "Invalid credentials"
            return Response({"error": error_msg}, status=HTTP_400_BAD_REQUEST)


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


class UserView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserProfileView(generics.GenericAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user.profile


class UserAvatarAPIView(generics.GenericAPIView):
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
