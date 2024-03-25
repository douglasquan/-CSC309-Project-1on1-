from django.conf import settings
from django.db import models
from events.models import Event


class Timeblock(models.Model):
    event = models.ForeignKey(Event, on_delete=models.SET_NULL, related_name='timeblocks', null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_timeblocks')
    start_time = models.TimeField()
    end_time = models.TimeField()
    date = models.DateField()
    PREFERENCE_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    preference_type = models.CharField(max_length=6, choices=PREFERENCE_CHOICES)
    is_finalized = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.date} from {self.start_time} to {self.end_time} ({self.preference_type})"

    class Meta:
        # cannot create the same timeblock with the same event_id and user_id
        constraints = [
            models.UniqueConstraint(fields=['event', 'user', 'date', 'start_time', 'end_time', 'preference_type', 'is_finalized'], name='unique_timeblock')
        ]


