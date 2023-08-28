from algoliasearch_django import AlgoliaIndex
from .models import Exercise
from algoliasearch_django.decorators import register


@register(Exercise)
class ExerciseIndex(AlgoliaIndex):
    fields = [
        "title",
        "body",
        "get_owner_first_name_last_name",
        "get_categories",
        "get_likes",
        "get_owner_id",
    ]

    settings = {
        "searchableAttributes": ["body", "title", "get_owner_first_name_last_name"],
        "attributesForFaceting": [],
    }

    # tags = "get_tags_list"
