from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

app_name = "exercises"

router = DefaultRouter()
router.register(r"categories", CategoryViewSet)
router.register(r"^(?P<exercise_id>\d+)/comment", CommentViewSet)
router.register(r"", ExerciseViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("like/<int:pk>/", LikeExerciseAPIView.as_view(), name="like-exercise"),
]
