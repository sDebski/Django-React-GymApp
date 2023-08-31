from django.urls import path
from .views import *

app_name = "userstats"
urlpatterns = [
    path(
        "expense-category/<timeperiod>/",
        ExpenseSummaryStats.as_view(),
        name="expense-category",
    ),
]
