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

    def _create_account(self):
        self.client.post(self.register_url, self.user_data, format="json")
        user = User.objects.get(email=self.user_data["email"])
        user.is_active = True
        user.save()

    def test_user_cannot_register_with_no_data(self):
        res = self.client.post(self.register_url)
        self.assertEqual(res.status_code, 400)

    def test_user_can_register_correctly(self):
        res = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(res.status_code, 201)

    def test_user_cannot_login_with_unverified_email(self):
        self.client.post(self.register_url, self.user_data, format="json")
        res = self.client.post(self.login_url, self.user_data, format="json")
        self.assertEqual(res.status_code, 401)

    def test_user_can_login_after_email_verification(self):
        self.client.post(self.register_url, self.user_data, format="json")
        user = User.objects.get(email=self.user_data["email"])
        user.is_active = True
        user.save()

        res = self.client.post(self.login_url, self.user_data, format="json")
        self.assertEqual(res.status_code, 200)

    def test_logged_user_can_get_his_profile_info(self):
        self._create_user_and_login()

        res = self.client.get(self.profile_url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["bio"], "")

    def test_non_logged_user_can_not_get_his_profile_info(self):
        self._create_account()
        res = self.client.get(self.profile_url)
        self.assertEqual(res.status_code, 401)

    def test_non_logged_user_can_not_get_his_account_info(self):
        self._create_user_and_login()
        res = self.client.get(self.account_url)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["first_name"], self.user_data["first_name"])
        self.assertEqual(res.data["email"], self.user_data["email"])

    def test_logout_user(self):
        self._create_user_and_login()
        res = self.client.post(self.logout_url, self.user_data)
        self.assertEqual(res.status_code, 204)

    def test_logout_not_logged_user(self):
        res = self.client.post(self.logout_url)
        self.assertEqual(res.status_code, 401)

    def test_user_password_change_and_login(self):
        self._create_user_and_login()
        password_change_res = self.client.post(self.password_change_url, self.user_data)
        self.assertEqual(password_change_res.status_code, 204)

        fail_login_res = self.client.post(self.login_url, self.user_data, format="json")
        self.assertEqual(fail_login_res.status_code, 401)

        success_login_res = self.client.post(
            self.login_url,
            {
                "email": self.user_data["email"],
                "password": self.user_data["new_password"],
            },
            format="json",
        )
        self.assertEqual(success_login_res.status_code, 200)
