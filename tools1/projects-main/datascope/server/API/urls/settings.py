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
from API.views import settings as views

urlpatterns = [

    path('createsettings', views.createsettings, name='createsettings'),
    path('getsettings', views.getsettings, name='getsettings'),
    path('updatesettings', views.updatesettings, name='updatesettings'),
    path('deletesettings', views.deletesettings, name='deletesettings'),

]