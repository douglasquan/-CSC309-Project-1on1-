from django.conf import settings
from django.db import models
from events.models import Event
from timeblocks_events.models import Timeblock

class Availability(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_availability', null=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='available_timeblock', null=False)
    timeblock_id = models.ForeignKey(Timeblock, on_delete=models.SET_NULL, null=True, blank=True)  # Assuming it's optional and not always immediately known
    start_range = models.DateField(verbose_name="Start Date")
    end_range = models.DateField(verbose_name="End Date")

    def __str__(self):
        return f"Availability for user {self.user_id} for event {self.event_id} from {self.start_range} to {self.end_range}"
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'event', 'timeblock_id'], name='unique_availability')
        ]