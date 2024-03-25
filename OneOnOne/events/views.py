from django.urls import reverse_lazy
from django.views.generic.edit import FormView
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.views.generic.edit import UpdateView, DeleteView
from .forms import EventForm
import json
from .models import Event
from django.views import View
from django.http import JsonResponse, HttpResponseBadRequest
from accounts.models import User 
from django.contrib import messages
from django.shortcuts import redirect
from django.db import models 

class AddEventView(FormView):
    form_class = EventForm
    template_name = 'create-meeting.html'
    success_url = reverse_lazy('home')

    def get_form_kwargs(self):
        # Pass user in the kwargs so that form can read the current user
        kwargs = super(AddEventView, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs
    
    def post(self, request, *args, **kwargs):
        content_type = request.META.get('CONTENT_TYPE', '')

        if 'application/json' in content_type:
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)
            # Pass the user to form for additional validations if necessary
            form = self.form_class(data, user=request.user)
        else:
            form = self.form_class(request.POST, request.FILES, user=request.user)

        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)
        
    def form_valid(self, form):
        invitee_email = form.cleaned_data['invitee_email'].strip()

        # Ensure the host's email is not the same as the invitee's email
        if invitee_email == self.request.user.email:
            form.add_error('invitee_email', 'You cannot invite yourself to an event.')
            return self.form_invalid(form)

        try:
            invitee_user = User.objects.get(email=invitee_email)
        except User.DoesNotExist:
            form.add_error('invitee_email', 'No user found with this email address')
            return self.form_invalid(form)
        
        event = form.save(commit=False)
        event.host = self.request.user
        event.invitee = invitee_user
        event.save()

        return super().form_valid(form)

class AllEventsView(ListView):
    model = Event
    template_name = 'all_events.html'  
    context_object_name = 'events'  

    def get_queryset(self):
        """Override to return events where the user is either the host or the invitee. """
        user = self.request.user
        return Event.objects.filter(models.Q(host=user) | models.Q(invitee=user)) 
    
    
class EventDetailView(DetailView):
    model = Event
    template_name = 'event_detail.html'  
    context_object_name = 'event'  
    pk_url_kwarg = 'event_id'  
    
    def dispatch(self, request, *args, **kwargs):
        event = self.get_object()
        if event.host != request.user and event.invitee != request.user:
            messages.error(request, "You are not authorized to view this event.")
            return redirect('all_events')  # Adjust the redirection URL as needed
        return super().dispatch(request, *args, **kwargs)
    
    

class EventUpdateView(UpdateView):
    model = Event
    form_class = EventForm
    template_name = 'event_edit.html'  
    pk_url_kwarg = 'event_id'  

    def post(self, request, *args, **kwargs):
        # Check if the incoming request is JSON data
        if request.headers.get('Content-Type') == 'application/json':
            try:
                data = json.loads(request.body)
                form = self.form_class(data, instance=self.get_object(), user=request.user)
                if form.is_valid():
                    self.object = form.save()
                    # Return a JSON response indicating success
                    return JsonResponse({'message': 'Event updated successfully', 'event': form.data}, status=200)
                else:
                    # Return a JSON response indicating form validation errors
                    return JsonResponse({'errors': form.errors}, status=400)
            except ValueError as e:
                # Return an error response if there's an issue with JSON parsing
                return HttpResponseBadRequest('Invalid JSON: {}'.format(e))
        else:
            # If not JSON, fall back to the original form handling
            return super().post(request, *args, **kwargs)

    def get_success_url(self):
        # Redirect to the event's detail view after updating
        event_id = self.object.id
        return reverse_lazy('event_detail', kwargs={'event_id': event_id})
    
    def dispatch(self, request, *args, **kwargs):
        event = self.get_object()
        if event.host != request.user and event.invitee != request.user:
            messages.error(request, "You are not authorized to edit this event.")
            return redirect('all_events')  # Adjust the redirection URL as needed
        return super().dispatch(request, *args, **kwargs)


class EventDeleteView(DeleteView):
    model = Event
    pk_url_kwarg = 'event_id'  
    success_url = reverse_lazy('all_events')  
    
    def dispatch(self, request, *args, **kwargs):
        event = self.get_object()
        if event.host != request.user:
            messages.error(request, "You are not authorized to delete this event.")
            return redirect('all_events')  # Adjust the redirection URL as needed
        return super().dispatch(request, *args, **kwargs)

