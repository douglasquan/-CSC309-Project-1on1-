from django import forms
from .models import Timeblock
from django.core.exceptions import ValidationError

class TimeblockForm(forms.ModelForm):
    class Meta:
        model = Timeblock
        fields = ['start_time', 'end_time', 'date', 'preference_type', 'is_finalized']

    def clean(self):
        cleaned_data = super().clean()
        start_time = cleaned_data.get("start_time")
        end_time = cleaned_data.get("end_time")

        if start_time and end_time and start_time >= end_time:
            raise ValidationError("End time must be after start time.")

        return cleaned_data