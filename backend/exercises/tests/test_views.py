from .test_setup import TestSetUp
from users.models import User
from ..models import Exercise


class TestViews(TestSetUp):
    def _create_user_coach_and_login(self):
        self.client.post(self.register_url, self.user_data, format="json")
        user = User.objects.get(email=self.user_data["email"])
        user.is_active = True
        user.is_coach = True
        user.save()

        self.client.login(
            email=self.user_data["email"], password=self.user_data["password"]
        )

    def _create_exercise(self):
        self.client.post(self.register_url, self.user_data, format="json")
        user = User.objects.get(email=self.user_data["email"])

        Exercise.objects.create(
            owner=user,
            title=self.user_data["title"],
        )

    def _create_normal_user_and_login(self):
        self.client.post(self.register_url, self.user_data, format="json")
        user = User.objects.get(email=self.user_data["email"])
        user.is_active = True
        user.save()

        self.client.login(
            email=self.user_data["email"], password=self.user_data["password"]
        )

    def test_user_can_not_create_exercise_when_not_logged_in(self):
        res = self.client.post(
            self.exercises_url,
            {
                "title": self.user_data["title"],
                "body": self.user_data["body"],
            },
        )

        self.assertEqual(res.status_code, 401)

    def test_user_can_not_create_exercise_when_not_coach(self):
        self._create_normal_user_and_login()

        res = self.client.post(
            self.exercises_url,
            {
                "title": self.user_data["title"],
                "body": self.user_data["body"],
            },
        )

        self.assertEqual(res.status_code, 403)

    def test_user_can_create_exercise_when_caoch(self):
        self._create_user_coach_and_login()

        res = self.client.post(
            self.exercises_url,
            {
                "title": self.user_data["title"],
                "body": self.user_data["body"],
            },
            format="json",
        )

        self.assertEqual(res.status_code, 201)

    def test_user_can_not_create_exercise_with_no_data(self):
        self._create_user_coach_and_login()

        res = self.client.post(
            self.exercises_url,
            {},
            format="json",
        )

        self.assertEqual(res.status_code, 400)

    def test_user_can_see_exercises(self):
        self._create_user_coach_and_login()

        self.client.post(
            self.exercises_url,
            {"title": self.user_data["title"], "body": self.user_data["body"]},
            format="json",
        )

        self.client.post(
            self.exercises_url,
            {"title": self.user_data["title"], "body": self.user_data["body"]},
            format="json",
        )

        res = self.client.get(
            self.exercises_url,
        )

        exercises = res.data["results"]
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(exercises), 2)
        self.assertEqual(exercises[0]["title"], self.user_data["title"])
        self.assertEqual(exercises[0]["body"], self.user_data["body"])

    def test_logged_user_can_like_exercise(self):
        self._create_exercise()
        self._create_normal_user_and_login()

        res_before_like = self.client.get(
            self.exercises_url,
        )
        exercise_before_like = res_before_like.data["results"][0]
        self.assertEqual(len(exercise_before_like["likes"]), 0)

        self.client.get(self.like_exercise_url)

        res_after_like = self.client.get(
            self.exercises_url,
        )

        exercise_after_like = res_after_like.data["results"][0]
        self.assertEqual(len(exercise_after_like["likes"]), 1)

    def test_not_logged_user_can_not_like_exercise(self):
        self._create_exercise()
        res = self.client.get(self.like_exercise_url)
        self.assertEqual(res.status_code, 401)
