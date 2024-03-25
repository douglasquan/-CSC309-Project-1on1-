from django.urls import path, include
from .views import AddEventView, AllEventsView, EventDetailView, EventUpdateView, EventDeleteView
from timeblocks_events.views import CreateTimeblockView, TimeblockListView, TimeblockDetailView
from availability.views import CreateAvailabilityView, AllAvailabilityView, DeleteAvailabilityView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('', csrf_exempt(AddEventView.as_view()), name='create_event'),
    path('all/', AllEventsView.as_view(), name='all_events'),
    path('<int:event_id>/details/', EventDetailView.as_view(), name='event_detail'),
    path('<int:event_id>/edit/', EventUpdateView.as_view(), name='update_event'),
    path('<int:event_id>/delete/', EventDeleteView.as_view(), name='event_delete'),
    
    # Availability URLs
    path('<int:event_id>/availability/', CreateAvailabilityView.as_view(), name='create-availability'),
    path('<int:event_id>/availability/<int:user_id>/', AllAvailabilityView.as_view(), name='all-availability'),
    path('<int:event_id>/availability/<int:user_id>/<int:availability_id>/delete/', DeleteAvailabilityView.as_view(), name='delete-availability'),

    # Timeblock URLs
    path('<int:event_id>/timeblocks/', CreateTimeblockView.as_view(), name='create_timeblock'),
    path('<int:event_id>/<int:user_id>/timeblocks/', TimeblockListView.as_view(), name='list_timeblocks'),
    path('<int:event_id>/<int:user_id>/timeblocks/<int:timeblock_id>/', TimeblockDetailView.as_view(), name='detail_timeblock'),

]

