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
from django.urls import path, re_path
from API.views import signin as views

urlpatterns = [
    #path('getusersdetails', views.getusersdetails, name='getusersdetails'),
    path('checkUserAuthorized', views.checkUserAuthorized, name='checkUserAuthorized'),
    path('checkUserAuthorized1', views.checkUserAuthorized1, name='checkUserAuthorized1'),
    path('updatepassword', views.updatepassword, name='updatepassword'),
]