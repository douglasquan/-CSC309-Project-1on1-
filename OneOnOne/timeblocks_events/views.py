from django.shortcuts import get_object_or_404
from django.views import View
from django.http import JsonResponse, HttpResponseBadRequest, Http404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import Timeblock
from events.models import Event
from accounts.models import User
import json
from django.urls import reverse_lazy
from django.views.generic.edit import FormView
from .forms import TimeblockForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.db import IntegrityError
from django.conf import settings

@method_decorator(csrf_exempt, name='dispatch')
class CreateTimeblockView(LoginRequiredMixin, FormView):
    template_name = 'create_timeblock.html'
    form_class = TimeblockForm
    success_url = reverse_lazy('home')
    login_url = '/accounts/login/'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['event_id'] = self.kwargs['event_id']
        return context

    def post(self, request, *args, **kwargs):
        # Check the content type of the request
        if request.content_type == 'application/json':
            # Parse the JSON body of the request
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)
            form = self.form_class(data)
        else:
            # Handle form data
            form = self.form_class(request.POST, request.FILES)

        self.object = None  # This line may be necessary if your FormView is set up to deal with model objects.
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        # Try to fetch the Event instance by the provided event_id
        event_id = self.kwargs.get('event_id')
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            # If handling JSON, return a JSON response indicating the error
            if self.request.content_type == 'application/json':
                return JsonResponse({'error': 'Event with provided ID does not exist.'}, status=404)
            # If handling form data, add an error to the form and render form_invalid
            else:
                form.add_error(None, 'Event with provided ID does not exist.')
                return self.form_invalid(form)

        # If the Event exists, proceed with saving the Timeblock
        timeblock = form.save(commit=False)
        timeblock.event = event  # Use the retrieved event
        timeblock.user = self.request.user
        try:
            timeblock.save()
        except IntegrityError:
            # Handle potential IntegrityError (e.g., from database constraints)
            error_message = 'A timeblock with these parameters already exists.'
            if self.request.content_type == 'application/json':
                return JsonResponse({'error': error_message}, status=400)
            else:
                form.add_error(None, error_message)
                return self.form_invalid(form)

        return super().form_valid(form)

    def form_invalid(self, form):
        # For JSON requests, return JSON response
        if self.request.content_type == 'application/json':
            return JsonResponse({'errors': form.errors}, status=400)
        # For form data requests, proceed as usual
        messages.error(self.request, "Error creating the timeblock. Please check the form for errors.")
        return super().form_invalid(form)


@method_decorator(csrf_exempt, name='dispatch')
class TimeblockListView(View):
    template_name = 'timeblock_list.html'
    def get(self, request, event_id, user_id):
        # Check if the Event and User exist, return JSON error if not
        try:
            event = get_object_or_404(Event, id=event_id)
            user = get_object_or_404(User, id=user_id)
        except Http404 as e:
            return JsonResponse({'error': str(e)}, status=404)

        # Filter timeblocks for the event and user
        timeblocks = Timeblock.objects.filter(event=event, user=user)
        timeblocks_data = [{
            "id": timeblock.id,
            "start_time": str(timeblock.start_time),
            "end_time": str(timeblock.end_time),
            "date": str(timeblock.date),
            "preference_type": timeblock.preference_type,
            "is_finalized": timeblock.is_finalized,
        } for timeblock in timeblocks]

        return JsonResponse(timeblocks_data, safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class TimeblockDetailView(View):
    def get(self, request, event_id, user_id, timeblock_id):
        # Attempt to retrieve the Timeblock with all specified criteria: event_id, user_id, and timeblock_id
        try:
            timeblock = get_object_or_404(Timeblock, id=timeblock_id, event__id=event_id, user__id=user_id)
        except Http404 as e:
            return JsonResponse({'error': str(e)}, status=404)

        # If the Timeblock exists, return its details
        return JsonResponse({
            "id": timeblock.id,
            "start_time": timeblock.start_time.strftime('%H:%M'),
            "end_time": timeblock.end_time.strftime('%H:%M'),
            "date": timeblock.date.isoformat(),
            "preference_type": timeblock.preference_type,
            "is_finalized": timeblock.is_finalized,
        })

    def delete(self, request, event_id, user_id, timeblock_id):
        # Fetch the Timeblock once with all criteria: event_id, user_id, and timeblock_id
        try:
            timeblock = get_object_or_404(Timeblock, id=timeblock_id, event__id=event_id, user__id=user_id)
            timeblock.delete()  # Delete the fetched Timeblock
            return JsonResponse({"message": "Timeblock deleted successfully"})
        except Http404 as e:
            return JsonResponse({'error': str(e)}, status=404)
