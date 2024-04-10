from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Event
        fields = '__all__' 
