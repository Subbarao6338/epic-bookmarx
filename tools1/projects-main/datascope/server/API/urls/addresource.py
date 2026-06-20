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
from API.views import addresource as views



urlpatterns = [

    path('getprojectresource', views.getprojectresource, name='getprojectresource'),
    path('createprojectresource', views.createprojectresource, name='createprojectresource'),
    path('deleteprojectresource', views.deleteprojectresource, name='deleteprojectresource'),
    path('deleteallprojectresource', views.deleteallprojectresource, name='deleteallprojectresource'),
    path('update_projectresource',views.update_projectresource, name='update_projectresource'),
    path('getconfiguredresources',views.getconfiguredresources, name='getconfiguredresources'),
    path('deleteselectedconfigresource',views.deleteselectedconfigresource, name='deleteselectedconfigresource'),

]  