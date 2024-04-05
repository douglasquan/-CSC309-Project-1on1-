from django.urls import path
from .views import CreateAvailabilityView, AllAvailabilityView, DeleteAvailabilityView

urlpatterns = [
    path('<int:event_id>/availability/', CreateAvailabilityView.as_view(), name='create-availability'),
    path('<int:event_id>/availability/<int:user_id>/', AllAvailabilityView.as_view(), name='all-availability'),
    path('<int:event_id>/availability/<int:availability_id>/', DeleteAvailabilityView.as_view(), name='delete-availability'),
]
