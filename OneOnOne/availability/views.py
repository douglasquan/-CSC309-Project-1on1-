
from django.urls import reverse_lazy
import json

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from .models import Availability
from django.views import View
from django.http import JsonResponse
from accounts.models import User 
from events.models import Event
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponseNotFound,HttpResponseForbidden, HttpResponseNotAllowed
from django.views.generic.edit import FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import AvailabilityForm
from django.db import IntegrityError

@method_decorator(csrf_exempt, name='dispatch')
class CreateAvailabilityView(LoginRequiredMixin, FormView):
    form_class = AvailabilityForm
    template_name = 'create_availability.html'  
    success_url = reverse_lazy('home')

    def get_form_kwargs(self):
        kwargs = super(CreateAvailabilityView, self).get_form_kwargs()
        kwargs['user'] = self.request.user  # Pass the current user to the form
        kwargs['event'] = get_object_or_404(Event, pk=self.kwargs['event_id'])  # Get the event based on URL
        return kwargs

    def post(self, request, *args, **kwargs):
        
        if request.META.get('CONTENT_TYPE', '').startswith('application/json'):
            try:
                data = json.loads(request.body)
                data['timeblock_id'] = data.pop('timeslot_id', None)  # Rename key to match your model/form fields
                form = self.form_class(data, user=request.user, event=get_object_or_404(Event, pk=kwargs['event_id']))
            except ValueError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)
        else:
            form = self.form_class(request.POST, request.FILES, user=request.user)
            try:
                form.save()
            except IntegrityError:
                form.add_error(None, 'An availability with these details already exists.') 
                return self.form_invalid(form)  
            
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        form.save()
        if self.request.META.get('CONTENT_TYPE', '').startswith('application/json'):
            return JsonResponse({'message': 'Availability created successfully'}, status=200)
        else:
            return super().form_valid(form)

    def form_invalid(self, form):
        errors = form.errors.as_json()
        if self.request.META.get('CONTENT_TYPE', '').startswith('application/json'):
            return JsonResponse({'errors': json.loads(errors)}, status=400)
        else:
            return super().form_invalid(form)

@method_decorator(csrf_exempt, name='dispatch')
class AllAvailabilityView(View):
    def get(self, request, event_id, user_id):
        # Ensure the event and user exist, 404 if not
        event = get_object_or_404(Event, id=event_id)
        user = get_object_or_404(User, id=user_id)

        print(event)
        print(user)
        # Filter availabilities for the given event and user
        availabilities = Availability.objects.filter(event=event, user=user)
        
        # Prepare the data for JSON response 
        data = [{
            "id": availability.id,
            "start_range": availability.start_range,
            "end_range": availability.end_range,
            "event_id": availability.event.id,
            "user_id": availability.user.id
        } for availability in availabilities]
        
        return JsonResponse(data, safe=False)  # safe=False is needed to allow non-dict objects


@method_decorator(csrf_exempt, name='dispatch')
class DeleteAvailabilityView(LoginRequiredMixin, View):
    def delete(self, request, availability_id, *args, **kwargs):
        try:
            # Fetch the availability instance by ID
            availability = Availability.objects.get(pk=availability_id)

            # Check if the current user is authorized to delete this availability
            if availability.user != request.user:
                return HttpResponseForbidden('You are not authorized to delete this availability.')

            # Perform the delete operation
            availability.delete()
            return JsonResponse({'message': 'Availability deleted successfully.'})
        
        except Availability.DoesNotExist:
            return HttpResponseNotFound('The specified availability does not exist.')

    def dispatch(self, request, *args, **kwargs):
        if request.method.lower() == 'delete':
            return super().dispatch(request, *args, **kwargs)
        else:
            return HttpResponseNotAllowed(['DELETE'])