from django.urls import path, re_path
from API.views import recentlyviewed as views

urlpatterns = [

    path('getRecentViewed', views.getRecentViewed, name='getRecentViewed'),
path('save_recentviewed', views.save_recentviewed, name='save_recentviewed'),


]
