from django.urls import path, re_path
from API.views import reportsdetails as views

urlpatterns = [
    path('fetchreportsdetails', views.fetchreportsdetails, name='fetchreportsdetails'),
]
