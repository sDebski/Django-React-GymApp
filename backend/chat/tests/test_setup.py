from rest_framework.test import APITestCase
from django.urls import reverse
from faker import Faker


class TestSetUp(APITestCase):
    def setUp(self):
        self.register_url = reverse("users:register")
        self.login_url = reverse("users:login")
        self.messages_url = reverse("chat:messages")
        self.faker = Faker()
        self.password = "qwe123"
        self.new_password = "qwe123123"

        self.user_data = {
            "email": self.faker.email(),
            "first_name": self.faker.email().split("@")[0],
            "password": self.password,
            "password2": self.password,
            "current_password": self.password,
            "new_password": self.new_password,
            "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkzOTQyMTE2LCJpYXQiOjE2OTM4NTU3MTYsImp0aSI6Ijk1Y2U4MDkyYTUyYjRhYWJiMThmMDE3NTUwMWNiMzIyIiwidXNlcl9pZCI6MX0.Jdu1cv6vRk6-SXxxmAvi2N4JStCr7HC5gD3gpeFuwoc",
            "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcwMTYzMTcxNiwiaWF0IjoxNjkzODU1NzE2LCJqdGkiOiIzNTAxMjMwZWVmMjI0ZTZhYTVmNjhjYzU5MDgxZWFhOSIsInVzZXJfaWQiOjF9.lGtL3h6oubnaxT-WE5Cc0NDztla0BTfHjPktBSInmwo",
        }
        return super().setUp()

    def tearDown(self) -> None:
        return super().tearDown()
