from django.urls import path
from .views import CreateTimeblockView, TimeblockListView, TimeblockDetailView
urlpatterns = [
    path('events/<int:event_id>/timeblocks/', CreateTimeblockView.as_view(), name='create_timeblock'),
    path('events/<int:event_id>/<int:user_id>/timeblocks/', TimeblockListView.as_view(), name='list_all_timeblock'),
    path('events/<int:event_id>/<int:user_id>/timeblocks/<int:timeblock_id>', TimeblockDetailView.as_view(), name='detail_timeblock'),

]
