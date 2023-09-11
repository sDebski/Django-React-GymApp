from django.db import models
from django.conf import settings

from django.utils.translation import gettext_lazy as _

USER = settings.AUTH_USER_MODEL


def get_owner_name(owner):
    if owner is not None:
        return f"{owner.first_name.capitalize()}  {owner.last_name.capitalize()}"
    else:
        return ""


class Category(models.Model):
    name = models.CharField(_("Category name"), max_length=200)

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def __str__(self):
        return f"ID: {self.id} | {self.name}"

    class Meta:
        ordering = ["-name"]


class Exercise(models.Model):
    title = models.CharField(_("Exercise name"), max_length=200)
    owner = models.ForeignKey(
        USER, related_name="exercises", null=True, on_delete=models.SET_NULL
    )

    categories = models.ManyToManyField(
        Category,
        related_name="exercises_list",
        blank=True,
    )
    body = models.TextField(_("Exercise body"))
    likes = models.ManyToManyField(
        USER,
        related_name="exercises_likes",
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_categories(self):
        categories = list(
            cat.name for cat in self.categories.get_queryset().only("name")
        )
        return categories

    def get_likes(self):
        likes = list(
            (like.first_name, like.last_name) for like in self.likes.get_queryset()
        )
        return likes

    def get_owner_first_name_last_name(self):
        return self.owner.first_name_last_name

    def get_owner_id(self):
        return self.owner.id

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"ID: {self.id} | Exercise: {self.title} | Host: {get_owner_name(self.owner)}"


class Comment(models.Model):
    exercise = models.ForeignKey(
        Exercise, related_name="comments", on_delete=models.CASCADE
    )
    owner = models.ForeignKey(
        USER,
        related_name="exercise_comment",
        null=True,
        on_delete=models.SET_NULL,
    )
    body = models.TextField(_("Comment body"))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.body[:10]} | Host: {get_owner_name(self.owner)}"
