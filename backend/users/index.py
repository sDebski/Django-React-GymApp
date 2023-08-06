from algoliasearch_django import AlgoliaIndex
from .models import User
from algoliasearch_django.decorators import register


@register(User)
class UserIndex(AlgoliaIndex):
    should_index = "is_coach"

    fields = [
        "first_name",
        "last_name",
    ]

    settings = {"searchableAttributes": ["first_name", "last_name"]}
