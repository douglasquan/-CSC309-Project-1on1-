from django.contrib import admin
from .models import Meeting

class MeetingAdmin(admin.ModelAdmin):
    list_display = ('host_id', 'invitee_id', 'meeting_title', 'meeting_duration', 
                    'meeting_type', 'description', 'is_active', 'is_deleted', 
                    'created_at', 'updated_at')  
    list_filter = ('meeting_type',)  # Example filters
    search_fields = ('meeting_title',)  # Example search capabilities
    ordering = ('meeting_duration',)  # Example ordering
    
admin.site.register(Meeting, MeetingAdmin)