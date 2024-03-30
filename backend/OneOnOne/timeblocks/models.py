from django.conf import settings
from django.db import models
# from events.models import Event


class BaseTimeblock(models.Model):
    event = models.ForeignKey("events.Event", on_delete=models.SET_NULL, related_name='%(class)s_timeblocks', null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='%(class)s_user_timeblocks')
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

    class Meta:
        abstract = True

class EventTimeblock(BaseTimeblock):
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['event', 'user', 'date', 'start_time', 'end_time', 'preference_type', 'is_finalized'], name='unique_event_timeblock')
        ]

class AvailabilityTimeblock(BaseTimeblock):
    # Additional fields for AvailabilityTimeblock can be added here
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['event', 'user', 'date', 'start_time', 'end_time', 'preference_type', 'is_finalized'], name='unique_availability_timeblock')
        ]
