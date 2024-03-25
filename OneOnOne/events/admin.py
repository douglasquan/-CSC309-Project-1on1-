from django.contrib import admin
from .models import Event, Availability

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

class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'event', 'timeblock_id', 'start_range', 'end_range')  # Fields to display in the list view
    list_filter = ('user', 'event')  
    search_fields = ('user__username', 'event__event_title')  


admin.site.register(Event, EventAdmin)
admin.site.register(Availability, AvailabilityAdmin)
