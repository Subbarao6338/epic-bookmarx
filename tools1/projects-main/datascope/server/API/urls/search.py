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
from API.views import search as views

urlpatterns = [

    
     path('get_search_result', views.get_search_result, name='get_search_result'),
     path('get_full_search_result', views.get_full_search_result, name='get_full_search_result'),
     path('purview_query', views.purview_query, name='purview_query'),
     path('purview_collection', views.purview_collection, name='purview_collection'),
]
