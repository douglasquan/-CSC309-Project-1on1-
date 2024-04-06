from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('base.api.urls')),
    path('accounts/', include('accounts.urls'), name='accounts'),  
    path('contacts/', include('contacts.urls'), name='contacts'),  
    path('events/', include('events.urls'), name='events'),
    path('availability/', include('availability.urls'), name='availability'),
]
