from django.urls import path
from .views import  AllEventsByHostView, AllEventsByInviteeView, AddEventView, EventDetailView, EventUpdateView, EventDeleteView

urlpatterns = [
    path('add/', AddEventView.as_view(), name='all_events'),
    path('all/host/<int:host_id>/', AllEventsByHostView.as_view(), name='all_events_by_host'),
    path('all/invitee/<int:invitee_id>/', AllEventsByInviteeView.as_view(), name='all_events_by_invitee'),
    path('<int:event_id>/details/', EventDetailView.as_view(), name='event_detail'),
    path('<int:event_id>/edit/', EventUpdateView.as_view(), name='update_event'),
    path('<int:event_id>/delete/', EventDeleteView.as_view(), name='event_delete'),

]

