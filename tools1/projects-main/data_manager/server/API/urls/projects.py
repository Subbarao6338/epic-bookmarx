from unicodedata import name
from django.urls import path, re_path
from API.views import projects as views

urlpatterns = [
    path('getprojectdetails', views.getprojectdetails, name='getprojectdetails'),
    path('getorganizationdetails', views.getorganizationdetails, name='getorganizationdetails'),
    path('createprojects', views.createprojects, name='createprojects'),
    path('createuser', views.createuser, name='createuser'),
    path('getuserdetails', views.getuserdetails, name='getuserdetails'),
    path('isuserexists', views.isuserexists,name= 'isuserexists'),
    path('delete_users', views.delete_users, name='delete_users'),
    path('update_projects', views.update_projects, name='update_projects'),
    path('delete_projects', views.delete_projects, name='delete_projects'),
    path('isprojectexists', views.isprojectexists,name= 'isprojectexists'),
    path('projects_config', views.projects_config,name= 'projects_config'),
    path('projects_nameslist', views.projects_nameslist,name= 'projects_nameslist'),
    path('update_projects_config', views.update_projects_config,name= 'update_projects_config'),
    path('getprojects_userbased', views.getprojects_userbased,name= 'getprojects_userbased'),
    path('getresources_projectbased', views.getresources_projectbased,name= 'getresources_projectbased'),
]

