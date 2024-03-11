from django.urls import reverse_lazy
from django.views.generic.edit import FormView
from django.views.generic.list import ListView
from .forms import EventForm
from django.http import JsonResponse
import json
from .models import Event

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
    template_name = 'all_events.html'  # Path to your template
    context_object_name = 'events'  # This is the context name in the template

    def get_queryset(self):
        """
        This method returns the list of items for this view.
        The default implementation returns the value of the queryset attribute
        if it is set, otherwise it retrieves all objects of the model's default manager.
        """
        return Event.objects.all()  # You can modify this if you need to filter the events