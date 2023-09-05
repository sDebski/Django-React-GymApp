from django.test import TestCase
from users.models import User
from ..models import Expense


# models test
class ExpenseTest(TestCase):
    def setUp(self):
        self.user_data = {
            "normal_email": "normal_email@mail.com",
            "normal_first_name": "normal_first",
            "normal_last_name": "normal_last",
            "password": "qwe123",
            "category": "GYM_MEMBERSHIP",
            "amount": "10",
            "description": "test description",
            "date": "1998-12-10",
        }

        self.user = User.objects.create_user(
            email=self.user_data["normal_email"],
            password=self.user_data["password"],
            first_name=self.user_data["normal_first_name"],
            last_name=self.user_data["normal_last_name"],
        )

        Expense.objects.create(
            description=self.user_data["description"],
            owner=self.user,
            date=self.user_data["date"],
            amount=self.user_data["amount"],
            category=self.user_data["category"],
        )

    def test_expense_creation(self):
        expense = Expense.objects.get(id=1)
        self.assertTrue(isinstance(expense, Expense))
        self.assertEqual(expense.category, self.user_data["category"])
        self.assertEqual(expense.amount, int(self.user_data["amount"]))
        self.assertEqual(expense.description, self.user_data["description"])

    def test_expense_creation_with_no_data(self):
        try:
            expense = Expense.objects.create(
                description=self.user_data["description"],
                owner=self.user,
            )
        except:
            expense = None

        self.assertEqual(expense, None)
