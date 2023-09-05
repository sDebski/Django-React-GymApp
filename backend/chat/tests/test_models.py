from django.test import TestCase
from users.models import User
from django.utils import timezone
from ..models import Message


# models test
class MessageTest(TestCase):
    def setUp(self):
        self.user_data = {
            "normal_email": "normal_email@mail.com",
            "normal_first_name": "normal_first",
            "normal_last_name": "normal_last",
            "password": "qwe123",
        }
        User.objects.create_user(
            email=self.user_data["normal_email"],
            password=self.user_data["password"],
            first_name=self.user_data["normal_first_name"],
            last_name=self.user_data["normal_last_name"],
        )

    def test_message_creation(self):
        user = User.objects.get(email=self.user_data["normal_email"])

        message = Message.objects.create(
            owner=user,
            body="Body test",
        )

        self.assertTrue(isinstance(message, Message))
        self.assertEqual(message.owner, user)
        self.assertEqual(message.body, "Body test")
        self.assertEqual(message.receiver, None)

    def test_message_creation_with_no_body(self):
        user = User.objects.get(email=self.user_data["normal_email"])

        message = Message.objects.create(
            owner=user,
        )

        self.assertTrue(isinstance(message, Message))
        self.assertEqual(message.body, "")

    def test_message_creation_with_no_owner(self):
        message = Message.objects.create(
            body="body test",
        )

        self.assertTrue(isinstance(message, Message))
        self.assertEqual(message.owner, None)
        self.assertEqual(message.body, "body test")
