from rest_framework.test import APITestCase
from django.urls import reverse
from faker import Faker


class TestSetUp(APITestCase):
    def setUp(self):
        self.register_url = reverse("users:register")
        self.login_url = reverse("users:login")
        self.expenses_url = reverse("expenses:expenses")
        self.expense_url = reverse("expenses:expense", kwargs={"id": 1})
        self.faker = Faker()
        self.password = "qwe123"
        self.new_password = "qwe123123"

        self.user_data = {
            "email": self.faker.email(),
            "first_name": self.faker.email().split("@")[0],
            "password": self.password,
            "password2": self.password,
            "category": "GYM_MEMBERSHIP",
            "amount": "10",
            "description": "test description",
            "date": "1998-12-10",
        }
        return super().setUp()

    def tearDown(self) -> None:
        return super().tearDown()
