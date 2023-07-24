from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from .tokens import account_activation_token


from .utils import get_tokens_for_user
from .serializers import (
    ExerciseSerializer,
    RegistrationSerializer,
    PasswordChangeSerializer,
)
from rest_framework import status


def activateEmail(request, user, to_email):
    mail_subject = "Activate your user account."
    message = render_to_string(
        "template_activate_account.html",
        {
            "user": user.username,
            "domain": get_current_site(request).domain,
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "token": account_activation_token.make_token(user),
            "protocol": "https" if request.is_secure() else "http",
        },
    )
    email = EmailMessage(mail_subject, message, to=[to_email])


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


# @api_view(["POST"])
# def registerUser(request):
#     print(request.method)
#     post_data = request.data
#     data = {
#         "first_name": post_data.get("firstname"),
#         "last_name": post_data.get("lastname"),
#         "email": post_data.get("email"),
#         "password": post_data.get("password"),
#     }

#     user = User.objects.get(email=data["email"])
#     if not user:
#         pass
#         # user = User.objects.create(
#         #     'first_name': data['first_name'],
#         #     'last_name': data['last_name'],
#         #     'email': data['email'],

#         # )

#     return Response({"message": "I got here!"}, status=status.HTTP_200_OK)


@api_view(["POST"])
def RegistrationView(request):
    print(request.data)
    serializer = RegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
