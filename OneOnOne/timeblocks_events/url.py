from django.urls import path
from . import views

urlpatterns = [
    path('<int:event_id>/timeblocks/', views.TimeblockCreateView.as_view(), name='create_timeblock'),
    path('<int:event_id>/<int:user_id>/timeblocks/', views.TimeblockListView.as_view(), name='list_timeblocks'),
    path('<int:event_id>/<int:user_id>/timeblocks/<int:timeblock_id>/', views.TimeblockDetailUpdateDeleteView.as_view(), name='detail_update_delete_timeblock'),
]