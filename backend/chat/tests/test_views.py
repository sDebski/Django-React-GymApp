from .test_setup import TestSetUp
from ..models import User


class TestViews(TestSetUp):
    def _create_user_and_login(self):
        self.client.post(self.register_url, self.user_data, format="json")
        user = User.objects.get(email=self.user_data["email"])
        user.is_active = True
        user.save()

        self.client.login(
            email=self.user_data["email"], password=self.user_data["password"]
        )

    def test_user_cannot_send_message_without_logging_in(self):
        res = self.client.post(
            self.messages_url,
            {"body": "test body", "chat": "test-chat"},
        )
        self.assertEqual(res.status_code, 401)

    def test_user_can_send_message_when_logged_in(self):
        self._create_user_and_login()
        res = self.client.post(
            self.messages_url,
            {"body": "test body", "chat": "test-chat"},
            format="json",
        )

        self.assertEqual(res.status_code, 201)

    def test_user_can_not_send_message_with_no_data(self):
        self._create_user_and_login()
        res = self.client.post(
            self.messages_url,
            {},
            format="json",
        )

        self.assertEqual(res.status_code, 400)

    def test_user_can_see_his_message_when_logged_in(self):
        self._create_user_and_login()
        self.client.post(
            self.messages_url,
            {"body": "test body x1", "chat": "test-chat"},
            format="json",
        )
        self.client.post(
            self.messages_url,
            {"body": "test body x2", "chat": "test-chat"},
            format="json",
        )

        res = self.client.get(self.messages_url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data["results"]), 2)
        # sorted by date
        self.assertEqual(res.data["results"][0]["body"], "test body x2")
