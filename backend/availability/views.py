
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from events.models import Event
from .models import Availability
from .serializers import AvailabilitySerializer

class CreateAvailabilityView(APIView):
    def post(self, request, event_id):
        event = get_object_or_404(Event, pk=event_id)
        serializer = AvailabilitySerializer(data=request.data)

        if serializer.is_valid():
            # Set the event before saving
            availability = serializer.save(event=event)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AllAvailabilityView(APIView):
    def get(self, request, event_id, user_id):
        event = get_object_or_404(Event, pk=event_id)
        user = get_object_or_404(User, pk=user_id)
        
        # Filter availabilities by both event and user
        availabilities = Availability.objects.filter(event=event, user=user)
        
        serializer = AvailabilitySerializer(availabilities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DeleteAvailabilityView(APIView):
    def delete(self, request, event_id, availability_id):
        get_object_or_404(Event, pk=event_id)  # Ensure the event exists
        availability = get_object_or_404(Availability, pk=availability_id, event_id=event_id)
        
        availability.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)