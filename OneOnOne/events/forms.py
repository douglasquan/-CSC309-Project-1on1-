from django import forms
from .models import Event

class EventForm(forms.ModelForm):
    
    class Meta:
        model = Event
        fields = ['event_title', 'event_duration', 'event_type', 'description', 'invitee_id', 'deadline']
    
    def __init__(self, *args, **kwargs):
        super(EventForm, self).__init__(*args, **kwargs)
        self.fields['event_type'].required = False
        self.fields['description'].required = False
        self.fields['deadline'].required = False