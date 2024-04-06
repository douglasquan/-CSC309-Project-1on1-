from django.conf import settings
from django.db import models
from events.models import Event

class Availability(models.Model):
    PREFERENCE_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_availability', null=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='available_timeblock', null=False)
    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)
    preference_type = models.CharField(max_length=6, choices=PREFERENCE_CHOICES, null=True)
    is_finalized = models.BooleanField(default=False)
    
    
    def __str__(self):
        return f"Availability for user {self.user} for event {self.event} from {self.start_range} to {self.end_range}"
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'event'], name='unique_availability')
        ]