from django.contrib import admin
from .models import Timeblock

class TimeblockAdmin(admin.ModelAdmin):
    list_display = ('event', 'user', 'start_time', 'end_time', 'date', 'preference_type', 'is_finalized')
    list_filter = ('preference_type', 'is_finalized')
    search_fields = ('event__title', 'user__username', 'date')

admin.site.register(Timeblock, TimeblockAdmin)
