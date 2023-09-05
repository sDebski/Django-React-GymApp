from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

app_name = "exercises"

router = DefaultRouter()
router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"^(?P<exercise_id>\d+)/comment", CommentViewSet, basename="comments")
router.register(r"", ExerciseViewSet, basename="exercises")

urlpatterns = [
    path("", include(router.urls)),
    path("like/<int:pk>/", LikeExerciseAPIView.as_view(), name="like-exercise"),
]
