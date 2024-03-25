from django import forms
from .models import Availability, Event, Timeblock
from django.conf import settings

class DateInput(forms.DateInput):
    input_type = 'date'
    
class AvailabilityForm(forms.ModelForm):
    class Meta:
        model = Availability
        fields = ['user', 'event', 'timeblock_id', 'start_range', 'end_range']
        widgets = {
            'start_range': DateInput(),
            'end_range': DateInput(),
        }
    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super(AvailabilityForm, self).__init__(*args, **kwargs)
        if self.user:
            self.fields['event'].queryset = Event.objects.filter(host=self.user)
