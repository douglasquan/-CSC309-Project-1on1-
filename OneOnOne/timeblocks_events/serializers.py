from rest_framework import serializers
from .models import Timeblock

class TimeblockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timeblock
        fields = ['id', 'start_time', 'end_time', 'date', 'preference_type', 'is_finalized']
