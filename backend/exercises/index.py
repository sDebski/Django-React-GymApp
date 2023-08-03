from algoliasearch_django import AlgoliaIndex
from .models import Exercise
from algoliasearch_django.decorators import register


@register(Exercise)
class ExerciseIndex(AlgoliaIndex):
    fields = [
        "title",
        "body",
        "owner",
        "categories",
        "likes",
    ]
