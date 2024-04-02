from django import forms
from .models import Availability, Event
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
        self.event = kwargs.pop('event', None)
        super(AvailabilityForm, self).__init__(*args, **kwargs)
        if self.user:
            self.fields['event'].queryset = Event.objects.filter(id=self.event.id if self.event else None)
            self.fields['event'].initial = self.event.id if self.event else None
            self.fields['event'].disabled = True  # Optional: prevent tampering

        # Remove 'user' field to prevent it from being displayed or tampered with
        self.fields.pop('user', None)

    def save(self, commit=True):
        instance = super(AvailabilityForm, self).save(commit=False)
        # Set the instance's user to the user provided in __init__
        instance.user = self.user
        if commit:
            instance.save()
        return instance