from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_delete


class Event(models.Model):    
    EVENT_TYPES = (
        ('in_person', 'In Person'),
        ('phone', 'Phone'),
        ('video', 'Video'),
        ('other', 'Other')
    )
    EVENT_DURATION = (
        (30, '30 minutes'),
        (60, '60 minutes'),
        (90, '90 minutes'),
        (120, '120 minutes'),
        (150, '150 minutes'),
        (180, '180 minutes'),

    )
    EVENT_STATUS = (
        ('D', 'Deleted/Canceled'),
        ('A', 'Pending Availability'),
        ('C', 'Pending Final Confirmation'),
        ('F', 'Finalized'),
    )
    
    host = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL,
        related_name='hosted_events', 
        null=True
    )
    invitee = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        related_name='invited_events',  
        null=True
    )
    
    event_title = models.CharField(max_length=255, null=False)  
    event_duration = models.IntegerField(choices=EVENT_DURATION, null=False)  
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    description = models.TextField(null=True)
    invitee_description = models.TextField(null=True)
    deadline = models.DateField(null=True)  

    finalized_start_time = models.DateTimeField(null=True)      
    finalized_end_time = models.DateTimeField(null=True)
    finalized_date = models.DateField(null=True)
    
    is_active = models.BooleanField(default=True)
    status = models.CharField(max_length=1, choices=EVENT_STATUS, default='A')  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.event_title

# Whenever a user that is a host of one or more events is deleted, the post_delete signal will trigger the update_event_on_host_deletion receiver, 
# which will set is_active to False for all events hosted by the deleted user.
@receiver(post_delete, sender=settings.AUTH_USER_MODEL)
def update_event_on_host_deletion(sender, instance, **kwargs):
    Event.objects.filter(host=instance).update(is_active=False)


