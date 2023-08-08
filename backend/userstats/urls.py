from django.urls import path
from .views import *

app_name = "userstats"
urlpatterns = [
    path("expense_category", ExpenseSummaryStats.as_view(), name="expense-category"),
]
