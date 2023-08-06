from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


# Register your models here.
from .forms import MyUserChangeForm, MyUserCreationForm
from .models import User, Profile


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = "Profile"


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    form = MyUserChangeForm
    add_form = MyUserCreationForm

    list_display = (
        "email",
        "date_of_birth",
        "is_admin",
        "is_active",
        "is_coach",
        "first_name",
        "last_name",
        "created_at",
        "updated_at",
    )
    list_filter = ("is_active", "is_staff", "is_admin", "is_coach")
    fieldsets = (
        (
            None,
            {"fields": ("email", "password")},
        ),
        (
            "Personal info",
            {"fields": ("date_of_birth", "first_name", "last_name")},
        ),
        (
            "Permissions",
            {"fields": ("is_staff", "is_active", "is_admin", "is_coach")},
        ),
        ("Dates", {"fields": ("last_login",)}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "date_of_birth",
                    "password1",
                    "password2",
                    "first_name",
                    "last_name",
                    "is_staff",
                    "is_active",
                    "is_coach",
                ),
            },
        ),
    )
    search_fields = ("email",)
    ordering = ("email",)
    inlines = (ProfileInline,)
    filter_horizontal = ()


admin.site.register(Profile)
