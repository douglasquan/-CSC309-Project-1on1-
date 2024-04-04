from django.views import View
from django.shortcuts import redirect, render
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .forms import UserUpdateForm
from .serializers import UserSerializer
import json

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=201)
        return Response(serializer.errors, status=400)


class ProfileView(LoginRequiredMixin, View):
    def get(self, request):
        return render(request, 'profile.html', {'user': request.user})


class UserDetailsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        user_id = kwargs.get('pk')
        user = get_object_or_404(User, pk=user_id)
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data)
    
    
class DeleteUserView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = User
    success_url = reverse_lazy('login')
    template_name = 'user_confirm_delete.html'

    def test_func(self):
        return self.request.user.id == self.kwargs['pk']  # Ensures users can only delete their own accounts
    
    
class UserUpdateView(LoginRequiredMixin, UpdateView):
    model = User
    form_class = UserUpdateForm
    template_name = 'update.html'
    success_url = reverse_lazy('profile')  # Redirect to the profile page after a successful update

    def get_object(self):
        # Ensure the user can only update their own profile
        return self.request.user

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()  # Get the user object to be updated
        if request.META.get('CONTENT_TYPE') == 'application/json':
            # Handle JSON data
            try:
                data = json.loads(request.body)
                form = self.form_class(data, instance=self.object)
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
        form.save()
        return super().form_valid(form)

    def form_invalid(self, form):
        if self.request.META.get('CONTENT_TYPE') == 'application/json':
            # For JSON requests
            return JsonResponse({'errors': form.errors}, status=400)
        else:
            # For form submissions
            return super().form_invalid(form)


