from rest_framework import generics, permissions
from .models import Timeblock
from .serializers import TimeblockSerializer

from django.shortcuts import get_object_or_404
from ..events.models import Event

class TimeblockCreateView(generics.CreateAPIView):
    queryset = Timeblock.objects.all()
    serializer_class = TimeblockSerializer
    # Assuming you're using token authentication and permissions are enabled
    # permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        event = get_object_or_404(Event, pk=event_id)
        # Assuming the request is authenticated and `request.user` is available
        user = self.request.user
        serializer.save(event=event, user=user)


class TimeblockListView(generics.ListAPIView):
    serializer_class = TimeblockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        user_id = self.kwargs.get('user_id')
        return Timeblock.objects.filter(event_id=event_id, user_id=user_id)


class TimeblockDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Timeblock.objects.all()
    serializer_class = TimeblockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        event_id = self.kwargs.get('event_id')
        user_id = self.kwargs.get('user_id')
        timeblock_id = self.kwargs.get('timeblock_id')
        return generics.get_object_or_404(Timeblock, id=timeblock_id, event_id=event_id, user_id=user_id)
