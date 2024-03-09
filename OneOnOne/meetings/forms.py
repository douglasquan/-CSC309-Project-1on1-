from django import forms
from .models import Meeting

class MeetingForm(forms.ModelForm):
    
    class Meta:
        model = Meeting
        fields = ['meeting_title', 'meeting_duration', 'meeting_type', 'description', 'invitee_id']
    
    def __init__(self, *args, **kwargs):
        super(MeetingForm, self).__init__(*args, **kwargs)
        self.fields['meeting_type'].required = False
        self.fields['description'].required = False