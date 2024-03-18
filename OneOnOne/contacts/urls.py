from django.urls import path
from .views import ContactListCreateAPIView, contact_view, contact_delete

urlpatterns = [
    path('add/', ContactListCreateAPIView.as_view(), name='contact-add'),
    path('view/', contact_view, name='contact-view'),
    path('<int:contact_id>/delete/', contact_delete, name='contact-delete'),
]