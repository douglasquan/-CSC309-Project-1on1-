from django.urls import path
from .views import CreateAvailabilityView, AllAvailabilityView, DeleteAvailabilityView

urlpatterns = [
    path('add/', CreateAvailabilityView.as_view(), name='create-availability'),
    path('<int:event_id>/<int:user_id>/all/', AllAvailabilityView.as_view(), name='all-availability'),
    path('<int:event_id>/<int:availability_id>/delete/', DeleteAvailabilityView.as_view(), name='delete-availability'),
]
