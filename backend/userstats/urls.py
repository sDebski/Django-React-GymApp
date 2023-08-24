from django.urls import path
from .views import *

app_name = "userstats"
urlpatterns = [
    path("expense-category", ExpenseSummaryStats.as_view(), name="expense-category"),
]
