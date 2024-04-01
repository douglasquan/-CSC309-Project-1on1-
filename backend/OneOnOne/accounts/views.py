from django.views import View
from django.shortcuts import redirect, render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from .forms import UserRegisterForm, UserLoginForm, UserUpdateForm
from django.contrib.auth import login as django_login, logout as django_logout
from .models import User
from django.contrib.auth import authenticate  # Import the authenticate function
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from django.utils.http import url_has_allowed_host_and_scheme
from django.http import JsonResponse, HttpResponseBadRequest
import json
from .serializers import UserSerializer


class RegisterView(APIView):
    def get(self, request):
        form = UserRegisterForm()
        return render(request, 'registration.html', {'form': form})

    def post(self, request):
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user_id': user.id,
                    'email': user.email,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def get(self, request):
        form = UserLoginForm()
        return render(request, 'login.html', {'form': form})

    def post(self, request):
        form = UserLoginForm(request.data)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user:
                django_login(request, user)  # Make sure the user is logged in with Django's backend as well
                refresh = RefreshToken.for_user(user)
                next_url = request.GET.get('next')
                if next_url and url_has_allowed_host_and_scheme(url=next_url, allowed_hosts={request.get_host()}):
                    response = redirect(next_url)
                else:
                    response = redirect('profile')  # Redirect to the profile page if there's no next URL
                response.set_cookie(key='refresh_token', value=str(refresh), httponly=True)
                response.set_cookie(key='access_token', value=str(refresh.access_token), httponly=True)
                return response
            else:
                # User authentication failed, return to login with an error message
                return render(request, 'login.html', {'form': form, 'error': 'Invalid username or password'})
        else:
            return render(request, 'login.html', {'form': form})


class LogoutView(APIView):
    def get(self, request):
        django_logout(request)
        return Response({"message": "You have been logged out."}, status=status.HTTP_200_OK)


class ProfileView(LoginRequiredMixin, View):
    def get(self, request):
        return render(request, 'profile.html', {'user': request.user})


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


class DeleteUserView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = User
    success_url = reverse_lazy('login')
    template_name = 'user_confirm_delete.html'

    def test_func(self):
        return self.request.user.id == self.kwargs['pk']  # Ensures users can only delete their own accounts
