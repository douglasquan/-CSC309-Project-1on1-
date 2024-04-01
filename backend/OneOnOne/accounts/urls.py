from django.urls import path, include
from .views import RegisterView, LoginView, LogoutView, ProfileView, UserUpdateView, DeleteUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/update/', UserUpdateView.as_view(), name='update_profile'),
    path('delete/<int:pk>/', DeleteUserView.as_view(), name='delete_user'),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
]
