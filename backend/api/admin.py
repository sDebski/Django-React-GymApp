from django.contrib import admin

# Register your models here.

from .models import Exercise, User

admin.site.register(Exercise)
admin.site.register(User)
