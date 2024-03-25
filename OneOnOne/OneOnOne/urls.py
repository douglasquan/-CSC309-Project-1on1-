from django.contrib import admin
from django.urls import path, include
from .views import home_view  

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', home_view, name='home'),  
    path('accounts/', include('accounts.urls'), name='accounts'),  
    path('contacts/', include('contacts.urls'), name='contacts'),  
    path('events/', include('events.urls'), name='events'),
]
