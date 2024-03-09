from django.db import models
from django.conf import settings

class Contact(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    removed = models.BooleanField(default=False)

    def __str__(self):
        return f"Contact for user {self.user_id}"
