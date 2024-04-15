from django.urls import path, include
from django.contrib.auth import views as auth_views
from .views import RegisterView, ProfileView, UserUpdateView, DeleteUserView, UserDetailsView, PasswordResetView, CheckUsernameView, CheckEmailView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('check_username/<str:username>/', CheckUsernameView.as_view(), name='check_username'),
    path('check_email/', CheckEmailView.as_view(), name='check_email'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/<int:pk>/', UserDetailsView.as_view(), name='user_details'),
    path('profile/update/', UserUpdateView.as_view(), name='update_profile'),
    path('delete/<int:pk>/', DeleteUserView.as_view(), name='delete_user'),
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]
