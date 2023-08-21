from django.contrib import admin
from django.urls import path, include
from django.urls import re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import handler404, handler500
from utils import views

schema_view = get_schema_view(
    openapi.Info(
        title="GymApp API",
        default_version="v1",
        description="GymApp description",
        terms_of_service="https://www.gymapp.com/policies/terms/",
        contact=openapi.Contact(email="contact@gymapp.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("", include("frontend.urls")),
    path("admin/", admin.site.urls),
    path("users/", include("users.urls", namespace="users")),
    path("social_auth/", include("social_auth.urls", namespace="social_auth")),
    path("exercises/", include("exercises.urls", namespace="exercises")),
    path("search/", include("search.urls", namespace="search")),
    path("expenses/", include("expenses.urls", namespace="expenses")),
    path("userstats/", include("userstats.urls", namespace="userstats")),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path(
        "swagger/api.json/",
        schema_view.without_ui(cache_timeout=0),
        name="schema-swagger-without-ui",
    ),
    path(
        "redoc/",
        schema_view.with_ui("redoc", cache_timeout=0),
        name="schema-redoc",
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


handler404 = "utils.views.error_404"
handler500 = "utils.views.error_500"
