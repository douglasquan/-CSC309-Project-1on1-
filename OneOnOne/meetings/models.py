from django.db import models
from django.conf import settings

class Meeting(models.Model):
    MEETING_TYPES = (
        ('in_person', 'In Person'),
        ('phone', 'Phone'),
        ('video', 'Video'),
    )
    MEETING_DURATION = (
        (15, '15 minutes'),
        (30, '30 minutes'),
        (45, '45 minutes'),
        (60, '60 minutes'),
        (90, '90 minutes'),
        (120, '120 minutes'),
    )
    
    host_id = models.IntegerField(default=1) #required change
    invitee_id = models.IntegerField()  # required change
    meeting_title = models.CharField(max_length=255)
    meeting_duration = models.IntegerField(choices=MEETING_DURATION)
    meeting_type = models.CharField(max_length=50, choices=MEETING_TYPES)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.meeting_title
