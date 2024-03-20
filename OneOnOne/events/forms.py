from django import forms
from django.contrib.auth import get_user_model
from .models import Event

User = get_user_model()

class EventForm(forms.ModelForm):
    invitee_email = forms.EmailField(required=True, help_text='Enter the email of the person you are inviting.')

    class Meta:
        model = Event
        fields = ['event_title', 'event_duration', 'event_type', 'description', 'deadline', 'invitee_email']
    
    def clean_invitee_email(self):
        email = self.cleaned_data['invitee_email']
        if not User.objects.filter(email=email).exists():
            raise forms.ValidationError("User with this email does not exist.")
        return email
