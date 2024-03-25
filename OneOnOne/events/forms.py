from django import forms
from .models import Event
from accounts.models import User

class EventForm(forms.ModelForm):
    invitee_email = forms.EmailField(required=True, help_text='Enter the email of the person you are inviting.')

    class Meta:
        model = Event
        fields = ['event_title', 'event_duration', 'event_type', 'description', 'deadline', 'invitee_email']
    
    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)  # Extract user from kwargs and remove it
        super(EventForm, self).__init__(*args, **kwargs)
        
        # Set initial value for invitee_email if instance is provided and has an invitee
        if self.instance.pk and self.instance.invitee:
            self.fields['invitee_email'].initial = self.instance.invitee.email

    def clean_invitee_email(self):
        email = self.cleaned_data['invitee_email']
        if not User.objects.filter(email=email).exists():
            raise forms.ValidationError("User with this email does not exist.")
        if self.user and self.user.email == email:
            raise forms.ValidationError("You cannot invite yourself.")
        return email
    
    def save(self, commit=True):
        event = super().save(commit=False)
        invitee_email = self.cleaned_data.get('invitee_email')
        if invitee_email:
            event.invitee = User.objects.get(email=invitee_email)
        if commit:
            event.save()
            self.save_m2m()  # Call save_m2m if there are many-to-many fields to save
        return event