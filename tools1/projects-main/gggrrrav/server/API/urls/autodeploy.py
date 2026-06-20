from unicodedata import name
from django.urls import path, re_path
from API.views import autodeploy as views

urlpatterns = [
     path('deploy', views.deploy, name='deploy'),
     path('destroy', views.destroy, name='destroy'),
     path('deploylogs', views.deploylogs, name='deploylogs'),
     path('getkubernetes_cluster', views.getkubernetes_cluster, name='getkubernetes_cluster'),
     path('create_kubernetescluster', views.create_kubernetescluster, name='create_kubernetescluster'),
     path('delete_kubernetescluster', views.delete_kubernetescluster, name='delete_kubernetescluster'),
     path('getkubernetes_projectbased', views.getkubernetes_projectbased, name='getkubernetes_projectbased'),
     path('getprovisionedresource_projectbased', views.getprovisionedresource_projectbased, name='getprovisionedresource_projectbased'),
]