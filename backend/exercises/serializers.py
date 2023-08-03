from rest_framework import serializers

from .models import *


class CategoryReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ExerciseReadSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(read_only=True, source="owner.first_name_last_name")
    categories = serializers.SerializerMethodField(read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Exercise
        fields = "__all__"

    def get_categories(self, obj):
        categories = list(
            cat.name for cat in obj.categories.get_queryset().only("name")
        )
        return categories

    def get_likes(self, obj):
        likes = list(
            (like.first_name, like.last_name) for like in obj.likes.get_queryset()
        )
        return likes


class ExerciseWriteSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Exercise
        fields = [
            "owner",
            "title",
            "body",
            "categories",
        ]


class CommentReadSerializer(serializers.Serializer):
    owner = serializers.CharField(read_only=True, source="owner.first_name_last_name")

    class Meta:
        model = Comment
        fields = "__all__"


class CommentWriteSerializer(serializers.Serializer):
    author = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Comment
        fields = "__all__"
