from django.shortcuts import get_object_or_404
from rest_framework import generics
from .models import Event
from .serializers import EventSerializer

class AddEventView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    
    def perform_create(self, serializer):
        serializer.save(host=self.request.user)
        
class AllEventsView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

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