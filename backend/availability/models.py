from django.conf import settings
from django.db import models
from events.models import Event

class Availability(models.Model):
    PREFERENCE_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_availability', null=False)
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='available_timeblock', null=False)
    start_time = models.DateTimeField(null=True) 
    end_time = models.DateTimeField(null=True) 
    preference_type = models.CharField(max_length=6, choices=PREFERENCE_CHOICES, null=True)
    is_finalized = models.BooleanField(default=False)
    
    
    def __str__(self):
        # Corrected to use start_time and end_time
        return f"Availability for user {self.user_id} for event {self.event_id} from {self.start_time} to {self.end_time}"
    
