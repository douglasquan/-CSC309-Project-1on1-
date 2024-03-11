from django.urls import reverse_lazy
from django.views.generic.edit import FormView
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.views.generic.edit import UpdateView, DeleteView
from .forms import EventForm
import json
from .models import Event
from django.shortcuts import get_object_or_404
from django.views import View
from django.http import JsonResponse, HttpResponseBadRequest


class AddEventView(FormView):
    form_class = EventForm
    template_name = 'create-meeting.html'
    success_url = reverse_lazy('home')

    def post(self, request, *args, **kwargs):
        # Determine the content type of the incoming request
        content_type = request.META.get('CONTENT_TYPE', '')

        if 'application/json' in content_type:
            # Handle JSON data
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)
            form = self.form_class(data)
        else:
            # Handle form-encoded data
            form = self.form_class(request.POST, request.FILES)

        if form.is_valid():
            self.form_valid(form)
            # For form submissions, proceed with the standard flow (e.g., redirect to success_url)
            return super().form_valid(form)
        else:
            # render the form with errors
            return self.form_invalid(form)

    def form_valid(self, form):
        # Save the form instance, then call the superclass form_valid to handle redirection
        form.save()
        return super().form_valid(form)


class AllEventsView(ListView):
    model = Event
    template_name = 'all_events.html'  
    context_object_name = 'events'  

    def get_queryset(self):
        """
        This method returns the list of items for this view.
        The default implementation returns the value of the queryset attribute
        if it is set, otherwise it retrieves all objects of the model's default manager.
        """
        return Event.objects.all()  
    
    
class EventDetailView(DetailView):
    model = Event
    template_name = 'event_detail.html'  
    context_object_name = 'event'  
    pk_url_kwarg = 'event_id'  
    
    def get_queryset(self):
        """
        If needed, override this method to customize the query.
        By default, it retrieves the object based on the primary key and the model specified.
        """
        return Event.objects.all()
    
    

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
                form = self.form_class(data, instance=self.get_object())
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


class EventDeleteView(DeleteView):
    model = Event
    pk_url_kwarg = 'event_id'  
    success_url = reverse_lazy('all_events')  
