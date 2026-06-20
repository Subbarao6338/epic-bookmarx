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
from API.views import usersMgmt as views

urlpatterns = [
    path('getusers', views.getusers, name='getusers'),   
    path('get_project_details', views.get_project_details, name='get_project_details'), 
    path('get_resources_provisioned_for_user', views.get_resources_provisioned_for_user, name='get_resources_provisioned_for_user'),
]

