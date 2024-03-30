from django.urls import path
from .views import ContactListView, AddContactView, ContactDeleteView

urlpatterns = [
    path('', ContactListView.as_view(), name='contact_list'),
    path('add/', AddContactView.as_view(), name='add_contact'),
    path('<int:pk>/delete/', ContactDeleteView.as_view(), name='delete_contact'),
]
