from django.contrib import admin
from .models import Contact

class ContactAdmin(admin.ModelAdmin):
    list_display = ('id', 'owner', 'contact', 'added_at', 'removed')  
    ordering = ('added_at',)  
    

admin.site.register(Contact, ContactAdmin)
