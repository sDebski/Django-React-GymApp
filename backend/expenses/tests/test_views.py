from .test_setup import TestSetUp
from users.models import User
from ..models import Expense


class TestViews(TestSetUp):
    def _create_user_and_login(self):
        self.client.post(self.register_url, self.user_data, format="json")
        user = User.objects.get(email=self.user_data["email"])
        user.is_active = True
        user.save()

        self.client.login(
            email=self.user_data["email"], password=self.user_data["password"]
        )

    def _create_expenses(self):
        self.client.post(self.register_url, self.user_data, format="json")
        user = User.objects.get(email=self.user_data["email"])

        Expense.objects.create(
            description=self.user_data["description"],
            owner=user,
            date=self.user_data["date"],
            amount=self.user_data["amount"],
            category=self.user_data["category"],
        )

        Expense.objects.create(
            description=self.user_data["description"] + "2",
            owner=user,
            date=self.user_data["date"],
            amount=self.user_data["amount"],
            category=self.user_data["category"],
        )

    def test_user_can_not_create_expense_when_not_logged_in(self):
        res = self.client.post(
            self.expense_url,
            {
                "description": self.user_data["description"],
                "date": self.user_data["date"],
                "amount": self.user_data["amount"],
                "category": self.user_data["category"],
            },
        )

        self.assertEqual(res.status_code, 401)

    def test_user_can_create_expense_when_logged_in(self):
        self._create_user_and_login()
        res = self.client.post(
            self.expenses_url,
            {
                "description": self.user_data["description"],
                "date": self.user_data["date"],
                "amount": self.user_data["amount"],
                "category": self.user_data["category"],
            },
        )

        self.assertEqual(res.status_code, 201)

    def test_user_can_see_created_expenses_when_logged_in(self):
        self._create_user_and_login()
        self._create_expenses()

        res = self.client.get(self.expenses_url)

        expenses = res.data["results"]
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(expenses), 2)
        self.assertEqual(expenses[0]["description"], self.user_data["description"])
        self.assertEqual(
            expenses[1]["description"],
            self.user_data["description"] + "2",
        )
