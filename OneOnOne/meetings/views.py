from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic.edit import FormView
from .forms import MeetingForm

class AddMeetingView(FormView):
    template_name = 'create-meeting.html'
    form_class = MeetingForm
    success_url = reverse_lazy('home')  
    
    def form_valid(self, form):
        meeting = form.save()
        return super().form_valid(form)
