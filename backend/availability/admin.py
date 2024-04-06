from django.contrib import admin
from .models import Availability

class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'event_id', 'start_time', 'end_time', 'preference_type', 'is_finalized')
    list_filter = ('user_id', 'event_id', 'preference_type', 'is_finalized')
    search_fields = ('user_id__username', 'event_id__name', 'start_range', 'end_range')

admin.site.register(Availability, AvailabilityAdmin)
