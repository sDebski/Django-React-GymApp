from django.db import models
from users.models import User


class Expense(models.Model):
    CATEGORY_OPTIONS = [
        ("GYM_MEMBERSHIP", "GYM_MEMBERSHIP"),
        ("GYM_GEAR", "GYM_GEAR"),
        ("FOOD", "FOOD"),
        ("PERSONAL_TRAINER", "PERSONAL_TRAINER"),
        ("OTHERS", "OTHERS"),
    ]

    category = models.CharField(choices=CATEGORY_OPTIONS, max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2, max_length=255)
    description = models.TextField()
    owner = models.ForeignKey(to=User, on_delete=models.CASCADE)
    date = models.DateField(null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering: ["-updated_at"]

    def __str__(self):
        return str(self.owner.first_name_last_name) + "s expenses"
