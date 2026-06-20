"""
=============================================================================
COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
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
     path('is_kubernetes_cluster_exists', views.is_kubernetes_cluster_exists,name='is_kubernetes_cluster_exists'),
     path('get_project_name', views.get_project_name,name='get_project_name'),
     path('get_project_resource', views.get_project_resource,name='get_project_resource'),
     path('getvalidationforclear', views.getvalidationforclear,name='getvalidationforclear'),

]