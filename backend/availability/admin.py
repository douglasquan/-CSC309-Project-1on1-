from django.contrib import admin
from .models import Availability

class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'event', 'start_time', 'end_time', 'preference_type', 'is_finalized')
    list_filter = ('user', 'event', 'preference_type', 'is_finalized')
    search_fields = ('user__username', 'event__name', 'start_range', 'end_range')

admin.site.register(Availability, AvailabilityAdmin)
