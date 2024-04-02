from django.contrib import admin
from .models import Availability
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'event', 'timeblock_id', 'start_range', 'end_range')  
    list_filter = ('user', 'event')  
    search_fields = ('user__username', 'event__event_title')  


admin.site.register(Availability, AvailabilityAdmin)