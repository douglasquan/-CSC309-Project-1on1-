from django.urls import reverse_lazy
from django.views.generic.edit import FormView
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.views.generic.edit import UpdateView, DeleteView
from .forms import EventForm
import json
from .models import Event, Availability
from django.shortcuts import get_object_or_404
from django.views import View
from django.http import JsonResponse, HttpResponseBadRequest
from django.utils.decorators import method_decorator
from accounts.models import User 
from django.contrib import messages
from django.shortcuts import redirect

class AddEventView(FormView):
    form_class = EventForm
    template_name = 'create-meeting.html'
    success_url = reverse_lazy('home')

    def get_form_kwargs(self):  # pass user in the kwargs so that form can read the current user
        kwargs = super(AddEventView, self).get_form_kwargs()
        kwargs['user'] = self.request.user 
        return kwargs
    
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
        try:
            # Look up the User object based on the invitee email
            invitee_user = User.objects.get(email=form.cleaned_data['invitee_email'])
        except User.DoesNotExist:
            form.add_error('invitee_email', 'No user found with this email address')
            return self.form_invalid(form)
        
        # If a user is found, proceed with creating the event
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

# @method_decorator(csrf_exempt, name='dispatch')  # Note: Be cautious with CSRF exemption
class CreateAvailabilityView(View):

    def post(self, request, event_id):
        try:
            # Attempt to load the JSON body
            data = json.loads(request.body)

            # Validate and extract the necessary fields from the request body
            user_id = data.get('user_id')
            timeblock_id = data.get('timeblock_id')
            start_range = data.get('start_range')
            end_range = data.get('end_range')

            # Basic validation 
            if not all([user_id, timeblock_id, start_range, end_range]):
                return JsonResponse({'error': 'Missing data'}, status=400)

            # Fetch the event and user instances
            try:
                event = Event.objects.get(id=event_id)
                # user = User.objects.get(id=user_id)
            except (Event.DoesNotExist, User.DoesNotExist):
                # event = Event.objects.get(id=event_id)
                # user = User.objects.get(id=user_id)
                # print(event.id)
                # print(user.id)
                return JsonResponse({'error': 'Event or User not found '}, status=404)

            # Create the Availability instance
            availability = Availability.objects.create(
                # user=user,
                user=user_id,
                event=event,
                timeblock_id=timeblock_id,
                start_range=start_range,
                end_range=end_range
            )

            # Return a success response
            return JsonResponse({
                'message': 'Availability created successfully',
                'availability': {
                    'id': availability.id,
                    'user_id': user_id,
                    'event_id': event_id,
                    'timeblock_id': timeblock_id,
                    'start_range': start_range,
                    'end_range': end_range
                }
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
