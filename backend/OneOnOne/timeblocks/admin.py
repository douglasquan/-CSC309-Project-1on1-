from django.contrib import admin
from .models import EventTimeblock, AvailabilityTimeblock

class EventTimeblockAdmin(admin.ModelAdmin):
    list_display = ('id', 'event', 'user', 'start_time', 'end_time', 'date', 'preference_type', 'is_finalized')
    list_filter = ('preference_type', 'is_finalized')
    search_fields = ('event__title', 'user__username', 'date')

class AvailabilityTimeblockAdmin(admin.ModelAdmin):
    list_display = ('id', 'event', 'user', 'start_time', 'end_time', 'date', 'preference_type', 'is_finalized')
    list_filter = ('preference_type', 'is_finalized')
    search_fields = ('event__title', 'user__username', 'date')

admin.site.register(EventTimeblock, EventTimeblockAdmin)
admin.site.register(AvailabilityTimeblock, AvailabilityTimeblockAdmin)
