from API.views import data as views
from django.urls import path

urlpatterns = [
    path('deploy_data', views.deploy_data, name='deploy_data')
]
