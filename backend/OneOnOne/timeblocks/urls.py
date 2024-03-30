from django.urls import path
from .views import CreateTimeblockView, TimeblockListView, TimeblockDetailView
urlpatterns = [
    # # Event timeblocks
    # path('events/<int:event_id>/timeblocks/', CreateTimeblockView.as_view(),
    #      name='create_event_timeblock'),
    # path('events/<int:event_id>/<int:user_id>/timeblocks/', TimeblockListView.as_view(),
    #      name='list_event_timeblocks'),
    # path('events/<int:event_id>/<int:user_id>/timeblocks/<int:timeblock_id>', TimeblockDetailView.as_view(),
    #      name='detail_event_timeblock'),

    # Availability timeblocks
    # path('events/<int:event_id>/availability/timeblocks/', CreateTimeblockView.as_view(),
    #      name='create_availability_timeblock'),
    # path('events/<int:event_id>/availability/<int:user_id>/timeblocks/', TimeblockListView.as_view(),
    #      name='list_availability_timeblocks'),
    # path('events/<int:event_id>/availability/<int:user_id>/timeblocks/<int:timeblock_id>',
    #      TimeblockDetailView.as_view(), name='detail_availability_timeblock'),

]
