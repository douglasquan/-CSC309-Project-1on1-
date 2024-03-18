# models.py
from django.db import models
from django.conf import settings


class Timeblock(models.Model):
    event = models.ForeignKey('events.Event', related_name='timeblocks', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    start_time = models.TimeField()
    end_time = models.TimeField()
    date = models.DateField()
    PREFERENCE_CHOICES = (
        ('low', 'Low Preference'),
        ('medium', 'Medium Preference'),
        ('high', 'High Preference'),
    )
    preference_type = models.CharField(max_length=6, choices=PREFERENCE_CHOICES)
    is_finalized = models.BooleanField()

    def __str__(self):
        return f"{self.date} from {self.start_time} to {self.end_time} ({self.preference_type})"
