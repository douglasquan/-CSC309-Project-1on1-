from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path('accounts/', include('accounts.urls'), name='accounts'),  
    path('contacts/', include('contacts.urls'), name='contacts'),  
    path('dashboard/', include('dashboard.urls'), name='dashboard'),  
    path('events/', include('events.urls'), name='events'),
]
