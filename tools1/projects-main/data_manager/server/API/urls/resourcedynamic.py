from unicodedata import name
from django.urls import path, re_path
from API.views import resourcedynamic as views


urlpatterns = [
    path('getresource', views.getresource, name='getresource'),
    path('getresource_userbased',views.getresource_userbased,name='getresource_userbased'),
]