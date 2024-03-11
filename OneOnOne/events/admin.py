from django.contrib import admin
from .models import Event

class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'host_id', 'invitee_id', 'finalized_timeblock_id', 
                    'event_title', 'event_duration', 'event_type', 
                    'deadline', 'description', 'is_active', 'status',
                    'created_at', 'updated_at')  
    list_filter = ('event_type',)  
    search_fields = ('event_title',)  
    ordering = ('created_at',)  
    
admin.site.register(Event, EventAdmin)