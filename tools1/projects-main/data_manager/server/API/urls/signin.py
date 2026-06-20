from django.urls import path, re_path
from API.views import signin as views

urlpatterns = [
    #path('getusersdetails', views.getusersdetails, name='getusersdetails'),
    path('checkUserAuthorized', views.checkUserAuthorized, name='checkUserAuthorized'),
    path('checkUserAuthorized1', views.checkUserAuthorized1, name='checkUserAuthorized1'),
    path('updatepassword', views.updatepassword, name='updatepassword'),
]