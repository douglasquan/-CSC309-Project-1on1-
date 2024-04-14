from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('id', 'host', 'invitee', 'event_type', 'event_duration', 
                    'event_title', 'description', 'invitee_description', 'deadline', 
                    'finalized_start_time', 'finalized_end_time', 'finalized_date', 
                    'status', 'is_active', 'created_at', 'updated_at')
    
    list_filter = ('event_type', 'event_duration', 'status', 'is_active', 'finalized_date')
    search_fields = ('event_title', 'description', 'host__username', 'invitee__username')
    date_hierarchy = 'finalized_date'
    ordering = ('-finalized_date',)
    actions = ['mark_as_active', 'mark_as_inactive']

    def mark_as_active(self, request, queryset):
        queryset.update(is_active=True)
    mark_as_active.short_description = "Mark selected events as active"

    def mark_as_inactive(self, request, queryset):
        queryset.update(is_active=False)
    mark_as_inactive.short_description = "Mark selected events as inactive"
