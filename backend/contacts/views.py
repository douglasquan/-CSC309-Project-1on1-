from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.list import ListView
from django.views.generic.edit import FormView, DeleteView
from django.urls import reverse_lazy
from .models import Contact
from .forms import AddContactForm
from django.shortcuts import redirect
from django.contrib import messages  
from accounts.models import User
from django.http import JsonResponse, HttpResponseBadRequest
import json

class ContactListView(LoginRequiredMixin, ListView):
    model = Contact
    template_name = 'contact_list.html'
    context_object_name = 'contacts'

    def get_queryset(self):
        return Contact.objects.filter(owner=self.request.user).select_related('contact')


class AddContactView(LoginRequiredMixin, FormView):
    template_name = 'add_contact.html'
    form_class = AddContactForm
    success_url = reverse_lazy('contact_list')

    def post(self, request, *args, **kwargs):
        if request.META.get('CONTENT_TYPE') == 'application/json':
            # Handle JSON data
            try:
                data = json.loads(request.body)
                form = self.form_class(data)
            except ValueError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)
        else:
            # Handle form data
            form = self.get_form()

        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        email = form.cleaned_data['email'].strip()
        if email == self.request.user.email:
            messages.error(self.request, "You cannot add yourself as a contact.")
            return self.form_invalid(form)        
        try:
            contact_user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(self.request, "No user found with the email provided.")
            return self.form_invalid(form)
        
        if Contact.objects.filter(owner=self.request.user, contact=contact_user).exists():
            messages.error(self.request, "This user is already in your contact list.")
            return self.form_invalid(form)
        else:
            Contact.objects.create(owner=self.request.user, contact=contact_user)
            messages.success(self.request, "Contact added successfully.")
            return super().form_valid(form)

    def form_invalid(self, form):
        if self.request.META.get('CONTENT_TYPE') == 'application/json':
            return JsonResponse({'errors': "unsuccessful"}, status=400)
        else:
            return super().form_invalid(form)

class ContactDeleteView(LoginRequiredMixin, DeleteView):
    model = Contact
    template_name = 'delete_contact.html'
    success_url = reverse_lazy('contact_list')

    def get_queryset(self):
        return Contact.objects.filter(owner=self.request.user)

    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()
        success_url = self.get_success_url()
        self.object.delete()
        return redirect(success_url)