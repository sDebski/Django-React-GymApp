from rest_framework.test import APITestCase
from django.urls import reverse
from faker import Faker


class TestSetUp(APITestCase):
    def setUp(self):
        self.register_url = reverse("users:register")
        self.login_url = reverse("users:login")
        self.faker = Faker()
        self.password = "qwe123"

        self.user_data = {
            "email": self.faker.email(),
            "first_name": self.faker.email().split("@")[0],
            "password": self.password,
            "password2": self.password,
        }
        return super().setUp()

    def tearDown(self) -> None:
        return super().tearDown()
