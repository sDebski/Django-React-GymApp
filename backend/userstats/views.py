from django.shortcuts import render
from rest_framework.views import APIView
import datetime
from expenses.models import Expense
from rest_framework import status, response
from utils.renderers import DataRenderer


class ExpenseSummaryStats(APIView):
    renderer_classes = (DataRenderer,)

    def get_category(self, expense):
        return expense.category

    def get_amount_for_category(self, expense_list, category):
        expenses_for_category = expense_list.filter(category=category)
        amount = 0

        for expense in expenses_for_category:
            amount += expense.amount

        return {"amount": str(amount)}

    def get(self, request):
        todays_date = datetime.date.today()
        a_year_ago = todays_date - datetime.timedelta(30 * 12)
        expenses = Expense.objects.filter(
            owner=request.user,
            date__gte=a_year_ago,
            date__lte=todays_date,
        )

        final = {}
        categories = {expense.category for expense in expenses}

        for category in categories:
            print(category)
            final[category] = self.get_amount_for_category(expenses, category)

        return response.Response({"category_data": final}, status=status.HTTP_200_OK)
