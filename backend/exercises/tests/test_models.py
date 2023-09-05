from django.test import TestCase
from users.models import User
from ..models import Exercise, Category


# models test
class ExerciseTest(TestCase):
    def setUp(self):
        self.user_data = {
            "normal_email": "normal_email@mail.com",
            "normal_first_name": "normal_first",
            "normal_last_name": "normal_last",
            "password": "qwe123",
            "category_name": "FBW",
            "title": "title",
        }

        User.objects.create_user(
            email=self.user_data["normal_email"],
            password=self.user_data["password"],
            first_name=self.user_data["normal_first_name"],
            last_name=self.user_data["normal_last_name"],
        )

        Category.objects.create(name=self.user_data["category_name"])

    def test_category_creation(self):
        category = Category.objects.get(id=1)
        self.assertTrue(isinstance(category, Category))
        self.assertEqual(category.name, self.user_data["category_name"])

    def test_exercise_creation_with_no_title(self):
        user = User.objects.get(email=self.user_data["normal_email"])

        exercise = Exercise.objects.create(
            owner=user,
        )
        self.assertTrue(isinstance(exercise, Exercise))
        self.assertEqual(exercise.title, "")

    def test_exercise_creation_with_category_and_like(self):
        user = User.objects.get(email=self.user_data["normal_email"])
        category = Category.objects.get(id=1)

        exercise = Exercise.objects.create(
            owner=user,
            title=self.user_data["title"],
        )

        exercise.categories.set([category])
        exercise.likes.set([user])

        self.assertTrue(isinstance(exercise, Exercise))
        self.assertEqual(exercise.owner, user)
        self.assertEqual(exercise.title, self.user_data["title"])
        self.assertEqual(len(exercise.get_categories()), 1)
        self.assertEqual(exercise.get_categories()[0], self.user_data["category_name"])
        self.assertEqual(len(exercise.get_likes()), 1)
        self.assertEqual(
            exercise.get_likes()[0],
            (self.user_data["normal_first_name"], self.user_data["normal_last_name"]),
        )
