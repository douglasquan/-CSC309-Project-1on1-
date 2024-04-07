from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings

from .models import Event
from .serializers import EventSerializer

class AddEventView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    
    def perform_create(self, serializer):
        serializer.save(host=self.request.user)
        
class AllEventsByHostView(APIView):
    """
    View to list all events by a specific host.
    """
    def get(self, request, host_id, format=None):
        host = get_object_or_404(settings.AUTH_USER_MODEL, pk=host_id)
        events = Event.objects.filter(host=host, is_active=True)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

class AllEventsByInviteeView(APIView):
    """
    View to list all events by a specific invitee.
    """
    def get(self, request, invitee_id, format=None):
        invitee = get_object_or_404(settings.AUTH_USER_MODEL, pk=invitee_id)
        events = Event.objects.filter(invitee=invitee, is_active=True)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
    

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'event_id'

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, id=self.kwargs.get("event_id"))
        return obj

class EventUpdateView(generics.UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'event_id'


class EventDeleteView(generics.DestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'event_id'