from django.contrib import admin
from .models import Event

class EventAdmin(admin.ModelAdmin):
    list_display = ('host_id', 'invitee_id', 'finalized_timeblock_id', 
                    'event_title', 'event_duration', 'event_type', 
                    'deadline', 'description', 'is_active', 'status',
                    'created_at', 'updated_at')  
    list_filter = ('event_type',)  # Example filters
    search_fields = ('event_title',)  # Example search capabilities
    ordering = ('created_at',)  # Example ordering
    
admin.site.register(Event, EventAdmin)