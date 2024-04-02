from django import forms
from django.core.exceptions import ValidationError

from .models import Event
from accounts.models import User

class EventForm(forms.ModelForm):
    invitee_id = forms.IntegerField(required=True)
    class Meta:
        model = Event
        # fields = ['event_title', 'event_duration', 'event_type', 'description', 'deadline', 'invitee_email']
        fields = ['event_title', 'event_duration', 'event_type', 'description', 'deadline', 'status']
    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)  # Extract user from kwargs and remove it
        super(EventForm, self).__init__(*args, **kwargs)
        
        # # Set initial value for invitee_email if instance is provided and has an invitee
        # if self.instance.pk and self.instance.invitee:
        #     print(self.instance.invitee.email)
        #     self.fields['invitee_email'].initial = self.instance.invitee.email

    def clean_invitee_id(self):
        invitee_id = self.cleaned_data.get('invitee_id')
        if not User.objects.filter(id=invitee_id).exists():
            raise forms.ValidationError("No user found with this ID.")
        if self.user and self.user.id == invitee_id:
            raise forms.ValidationError("You cannot invite yourself.")
        return invitee_id

    def save(self, commit=True):
        event = super().save(commit=False)
        invitee_id = self.cleaned_data.get('invitee_id')
        event.invitee = User.objects.get(id=invitee_id)
        if commit:
            event.save()
        return event