from rest_framework.test import APITestCase
from django.urls import reverse
from faker import Faker


class TestSetUp(APITestCase):
    def setUp(self):
        self.register_url = reverse("users:register")
        self.login_url = reverse("users:login")
        self.categories_url = reverse("exercises:categories-list")
        self.exercises_url = reverse("exercises:exercises-list")
        self.like_exercise_url = reverse("exercises:like-exercise", kwargs={"pk": 1})
        self.password = "qwe123"
        self.faker = Faker()

        self.user_data = {
            "email": self.faker.email(),
            "first_name": self.faker.email().split("@")[0],
            "password": self.password,
            "password2": self.password,
            "title": "test title",
            "body": "test body",
        }
        return super().setUp()

    def tearDown(self) -> None:
        return super().tearDown()
