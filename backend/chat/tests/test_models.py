from django.test import TestCase
from users.models import User
from django.utils import timezone


# models test
class UserTest(TestCase):
    def setUp(self):
        self.user_data = {
            "normal_email": "normal_email@mail.com",
            "normal_first_name": "normal_first",
            "normal_last_name": "normal_last",
            "super_email": "super_email@mail.com",
            "super_first_name": "super_first",
            "super_last_name": "super_last",
            "password": "qwe123",
        }
        User.objects.create_user(
            email=self.user_data["normal_email"],
            password=self.user_data["password"],
            first_name=self.user_data["normal_first_name"],
            last_name=self.user_data["normal_last_name"],
        )
        User.objects.create_superuser(
            email=self.user_data["super_email"],
            password=self.user_data["password"],
            first_name=self.user_data["super_first_name"],
            last_name=self.user_data["super_last_name"],
        )

    def test_normal_user_creation(self):
        user = User.objects.get(email=self.user_data["normal_email"])
        self.assertTrue(isinstance(user, User))
        self.assertEqual(user.first_name, self.user_data["normal_first_name"])

    def test_super_user_creation(self):
        user = User.objects.get(email=self.user_data["super_email"])
        self.assertTrue(isinstance(user, User))
        self.assertEqual(user.first_name, self.user_data["super_first_name"])
        self.assertEqual(user.is_active, True)
        self.assertEqual(user.is_coach, True)
        self.assertEqual(user.is_admin, True)
