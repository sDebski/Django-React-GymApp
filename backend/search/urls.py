from django.urls import path
from .views import *

app_name = "search"

urlpatterns = [
    path("", SearchHelloView.as_view(), name="search-hello"),
    path("exercises/", SearchExercisesListView.as_view(), name="search-exercises"),
    path("users/", SearchUsersListView.as_view(), name="search-users"),
    path("public/", SerachPublicAPIKeysView.as_view(), name="search-public"),
]
