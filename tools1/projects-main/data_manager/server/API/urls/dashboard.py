from django.urls import path, re_path
from API.views import dashboard as views

urlpatterns = [

    path('dashboard_count', views.dashboardcount, name='dashboardcount'),
  
]
