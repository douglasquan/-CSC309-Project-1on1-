from django.contrib import admin
from .models import Event

class EventAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'host', 'invitee',  
        'finalized_timeblock_id', 
        'event_title', 'event_duration', 'event_type', 
        'deadline', 'description', 'is_active', 'status',
        'created_at', 'updated_at'
    )  
    list_filter = ('event_type',)  
    search_fields = ('event_title', 'host__username', 'invitee__username')  # Assuming you want to search by host and invitee usernames
    ordering = ('created_at',)  

admin.site.register(Event, EventAdmin)
