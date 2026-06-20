from API.views import software as views
from django.urls import path

urlpatterns = [
    path('deploy_software', views.deploy_software, name='deploy_software')
]
