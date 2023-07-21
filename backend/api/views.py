from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import ExerciseSerializer
from .models import Exercise
from rest_framework import generics, status


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["firstname"] = user.first_name

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


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
def registerUser(request):
    print(request.method)
    post_data = request.data
    data = {
        "first_name": post_data.get("firstname"),
        "last_name": post_data.get("lastname"),
        "email": post_data.get("email"),
        "password": post_data.get("password"),
    }

    return Response({"message": "I got here!"}, status=status.HTTP_200_OK)
