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
from API.views import costDetails as views

urlpatterns = [
    path('gettokens', views.generate_token, name='generate_token'),
    path('listcostDetails', views.listcostDetails, name='listcostDetails'),
    path('query_debugcostDetails', views.query_debugcostDetails, name='query_debugcostDetails'),
    path('query_costDetails', views.query_costDetails, name='query_costDetails'),
]