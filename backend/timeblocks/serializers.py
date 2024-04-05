from rest_framework import serializers
from .models import AvailabilityTimeblock

class AvailabilityTimeblockSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilityTimeblock
        fields = ['id', 'event', 'user', 'start_time', 'end_time', 'date', 'preference_type', 'is_finalized']
