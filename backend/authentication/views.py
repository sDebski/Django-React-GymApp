from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import User
from .utils import send_email
from django.conf import settings
import jwt
from .serializers import EmailVerificationSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


from .utils import get_tokens_for_user
from .serializers import (
    ExerciseSerializer,
    RegistrationSerializer,
    PasswordChangeSerializer,
)
from rest_framework import status, generics, views


@api_view(["GET"])
def getRoutes(request):
    routes = ["/api/token/", "/api/token/refresh", "/api/register"]
    return Response(routes)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getExercises(request):
    user = request.user
    exercises = user.exercise_set.all()
    serializer = ExerciseSerializer(exercises, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def RegistrationView(request):
    print(request.data)
    serializer = RegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user_data = serializer.data
        user = User.objects.get(email=user_data["email"])
        print(user)

        email_response = send_email(request, user)
        if email_response:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {"msg": "Error while sending authentication email"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmail(views.APIView):
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
        print("Token: ", token)
        try:
            print("Przed decode")
            print("Secret: ", settings.SECRET_KEY)
            payload = jwt.decode(
                token, settings.SECRET_KEY, options={"verify_signature": False}
            )
            print("Payload: ", payload)
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


@api_view(["POST"])
def LoginView(request):
    print(request.data)
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
    return Response({"msg": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def LogoutView(request):
    logout(request)
    return Response({"msg": "Successfully Logged out"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def ChangePasswordView(request):
    serializer = PasswordChangeSerializer(
        context={"request": request}, data=request.data
    )
    serializer.is_valid(raise_exception=True)  # Another way to write is as in Line 17
    request.user.set_password(serializer.validated_data["new_password"])
    request.user.save()
    return Response(status=status.HTTP_204_NO_CONTENT)
