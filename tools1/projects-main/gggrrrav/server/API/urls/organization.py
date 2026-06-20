from unicodedata import name
from django.urls import path, re_path
from API.views import organization as views


urlpatterns = [
   path('getorganizationdetails', views.getorganizationdetails, name='getorganizationdetails'),
   path('createorganization', views.createorganization, name='createorganization'),
   path('delete_organization', views.delete_organization, name='delete_organization'),
   path('update_organization', views.update_organization, name='update_organization'),
   path('isorganizationexists', views.isorganizationexists,name= 'isorganizationexists'),
 ]