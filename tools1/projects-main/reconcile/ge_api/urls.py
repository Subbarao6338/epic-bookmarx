from django.urls import path
from ge_api import views

urlpatterns = [
   
    # projects
    path('list_projects/', views.list_all_projects_view),
    path('list_active_projects/', views.list_active_projects_view),
    path('create_project/', views.create_project_view),
    path('update_project/', views.update_project_view),
    path('delete_project/', views.delete_project_view),
    path('get_project/', views.get_project_view),

    # suites
    path('list_suites/', views.list_all_suites_view),
    path('create_suite/', views.create_suite_view),
    path('update_suite/', views.update_suite_view),
    path('delete_suite/', views.delete_suite_view),
    path('get_suite/', views.get_suite_view),

    # test groups
    path('list_testgroups/', views.list_all_projects_view),
    path('create_testgroup/', views.create_project_view),
    path('update_testgroup/', views.update_project_view),
    path('delete_testgroup/', views.delete_project_view),
    path('get_testgroup/', views.get_project_view),
]
