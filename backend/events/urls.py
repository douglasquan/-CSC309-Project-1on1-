from django.urls import path, include
from .views import AddEventView, AllEventsView, EventDetailView, EventUpdateView, EventDeleteView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('add/', AddEventView.as_view(), name='create_event'),
    path('all/', AllEventsView.as_view(), name='all_events'),
    path('<int:event_id>/details/', EventDetailView.as_view(), name='event_detail'),
    path('<int:event_id>/edit/', EventUpdateView.as_view(), name='update_event'),
    path('<int:event_id>/delete/', EventDeleteView.as_view(), name='event_delete'),

]

