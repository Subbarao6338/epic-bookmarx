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
from API.views import datapipeline as views

urlpatterns = [
    path('gettoken', views.generate_token, name='generate_token'),
    path('listdatapipeline', views.listdatapipeline, name='listdatapipeline'),
    path('query_debugpipelines', views.query_debugpipelines, name='query_debugpipelines'),
    path('query_pipelines', views.query_pipelines, name='query_pipelines'),

]