from django.shortcuts import render, get_object_or_404
from rest_framework import generics, views, permissions, status, viewsets
from rest_framework.response import Response
from .models import *
from .serializers import *
from .permissions import IsCoach, IsOwnerOrReadOnly


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategoryReadSerializer
    permission_classes = (permissions.AllowAny,)


class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return ExerciseWriteSerializer

        return ExerciseReadSerializer

    def get_permissions(self):
        if self.action in ("create",):
            print("wchodze create")
            self.permission_classes = (IsCoach,)
        elif self.action in ("update", "partial_update", "destroy"):
            self.permission_classes = (IsCoach, IsOwnerOrReadOnly)

        else:
            self.permission_classes = (permissions.AllowAny,)

        return super().get_permissions()


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()

    def get_queryset(self):
        res = super().get_queryset()
        exercise_id = self.kwargs.get("exercise_id")
        return res.filter(exercise__id=exercise_id)

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return CommentWriteSerializer

        return CommentReadSerializer

    def get_permissions(self):
        if self.action in ("create",):
            self.permission_classes = (permissions.IsAuthenticated,)
        elif self.action in ("update", "partial_update", "destroy"):
            self.permission_classes = (IsOwnerOrReadOnly,)
        else:
            self.permission_classes = (permissions.AllowAny,)

        return super().get_permissions()


# Create your views here.
class LikeExerciseAPIView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, pk):
        user = request.user
        exercise = get_object_or_404(Exercise, pk=pk)

        if user in exercise.likes.all():
            exercise.likes.remove(user)

        else:
            exercise.likes.add(user)
        return Response(status=status.HTTP_200_OK)
