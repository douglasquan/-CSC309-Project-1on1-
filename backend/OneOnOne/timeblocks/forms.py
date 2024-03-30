from django import forms
from .models import EventTimeblock, AvailabilityTimeblock
from django.core.exceptions import ValidationError


class TimeblockForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        self.model_choice = kwargs.pop('model_choice', 'event')  # Default to 'event'
        super().__init__(*args, **kwargs)
        self.Meta.model = EventTimeblock if self.model_choice == 'event' else AvailabilityTimeblock
        # Re-setup the form after changing the model
        self.fields = {field.name: field.formfield() for field in self.Meta.model._meta.fields if
                       field.name in self.Meta.fields}

    class Meta:
        model = EventTimeblock  # This will be dynamically overridden
        fields = ['start_time', 'end_time', 'date', 'preference_type', 'is_finalized']

    def clean(self):
        cleaned_data = super().clean()
        start_time = cleaned_data.get("start_time")
        end_time = cleaned_data.get("end_time")

        if start_time and end_time and start_time >= end_time:
            raise ValidationError("End time must be after start time.")

        return cleaned_data