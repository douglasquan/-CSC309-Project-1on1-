from django.urls import path
from .views import AddMeetingView

urlpatterns = [
    path('add', AddMeetingView.as_view(), name='add_meeting'),
]

