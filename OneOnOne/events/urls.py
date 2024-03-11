from django.urls import path
from .views import AddEventView, AllEventsView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('', csrf_exempt(AddEventView.as_view()), name='create_event'),
    path('all/', AllEventsView.as_view(), name='all_events'),

]

