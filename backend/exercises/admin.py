from django.contrib import admin

from .models import Category, Exercise, Comment

admin.site.register(Category)
admin.site.register(Exercise)
admin.site.register(Comment)
