from django.db import models
from django.conf import settings

class Contact(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='contact_owner', null=True)
    contact = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='contact_person', null=True)
    added_at = models.DateTimeField(auto_now_add=True)
    removed = models.BooleanField(default=False)

    def __str__(self):
        if self.owner.username and self.contact.username:
            return f"{self.owner.username}'s contact: {self.contact.username}"
        
