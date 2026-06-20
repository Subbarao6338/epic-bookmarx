from unicodedata import name
from django.urls import path, re_path
from API.views import addresource as views



urlpatterns = [

    path('getprojectresource', views.getprojectresource, name='getprojectresource'),
    path('createprojectresource', views.createprojectresource, name='createprojectresource'),
    path('deleteprojectresource', views.deleteprojectresource, name='deleteprojectresource'),
    path('deleteallprojectresource', views.deleteallprojectresource, name='deleteallprojectresource'),
    

]  