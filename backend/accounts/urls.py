from django.urls import path, include
from .views import RegisterView, ProfileView, UserUpdateView, DeleteUserView, UserDetailsView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/<int:pk>/', UserDetailsView.as_view(), name='user_details'),
    path('profile/update/', UserUpdateView.as_view(), name='update_profile'),
    path('delete/<int:pk>/', DeleteUserView.as_view(), name='delete_user'),
]
