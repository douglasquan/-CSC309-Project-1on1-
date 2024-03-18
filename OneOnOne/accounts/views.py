from django.shortcuts import redirect, render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from .forms import UserRegisterForm, UserLoginForm
from django.contrib.auth import login as django_login, logout as django_logout
from .forms import UserRegisterForm, UserLoginForm
from .models import User
from django.contrib.auth import authenticate  # Import the authenticate function


class RegisterView(APIView):
    def get(self, request):
        form = UserRegisterForm()
        return render(request, 'registration.html', {'form': form})
    
    def post(self, request):
        form = UserRegisterForm(request.data)
        if form.is_valid():
            user = form.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user_id': user.id,
                'email': user.email,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

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
            if user is not None:
                # JWT token creation
                refresh = RefreshToken.for_user(user)
                # Custom success message
                message = f"Welcome back, {username}! You have successfully logged in."
                return Response({
                    'message': message,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
