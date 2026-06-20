from django.urls import path
from ge_api import views

urlpatterns = [
   
    # projects
    path('list_projects/', views.list_all_projects_view),
    path('create_project/', views.create_project_view),
    path('update_project/', views.update_project_view),
    path('delete_project/', views.delete_project_view),
    path('get_project/', views.get_project_view),
]
