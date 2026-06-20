from unicodedata import name
from django.urls import path, re_path
from API.views import usersMgmt as views

urlpatterns = [
    path('getusers', views.getusers, name='getusers'),   
]

