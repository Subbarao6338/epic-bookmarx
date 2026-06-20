from django.urls import path, re_path
from API.views import notifications as views

urlpatterns = [

    path('fetch_notifications', views.fetch_notifications, name='fetch_notifications'),
    path('update_status', views.update_status, name='update_status'),
    path('add_notifications', views.add_notifications, name='add_notifications'),
    path('getRecentActivities', views.getRecentActivities, name='getRecentActivities'),
]
