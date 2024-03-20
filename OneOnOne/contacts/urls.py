from django.urls import path
from . import views

urlpatterns = [
    path('', views.contact_list, name='contact_list'),
    path('add/', views.add_contact, name='add_contact'),
    path('<int:contact_id>/delete', views.remove_contact, name='remove_contact'),
]
