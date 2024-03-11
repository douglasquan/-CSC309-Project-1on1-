from django.db import models
from django.conf import settings

class Event(models.Model):
    EVENT_TYPES = (
        ('in_person', 'In Person'),
        ('phone', 'Phone'),
        ('video', 'Video'),
    )
    EVENT_DURATION = (
        (15, '15 minutes'),
        (30, '30 minutes'),
        (45, '45 minutes'),
        (60, '60 minutes'),
        (90, '90 minutes'),
        (120, '120 minutes'),
    )
    EVENT_STATUS = (
        ('D', 'Deleted/Canceled'),
        ('A', 'Pending Availability'),
        ('C', 'Pending Final Confirmation'),
        ('F', 'Finalized'),
    )
    
    host_id = models.IntegerField(default=1) #required change
    invitee_id = models.IntegerField(default=1)  # required change
    finalized_timeblock_id = models.IntegerField(null=True, blank=True)  # Assuming it's optional and not always immediately known
    
    event_title = models.CharField(max_length=255, null=False)  
    event_duration = models.IntegerField(choices=EVENT_DURATION, null=False)  
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    description = models.TextField()
    deadline = models.DateField(null=True)  # Assuming you require only the date; use DateTimeField if time is also needed

    is_active = models.BooleanField(default=True)
    status = models.CharField(max_length=1, choices=EVENT_STATUS, default='A')  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.event_title
