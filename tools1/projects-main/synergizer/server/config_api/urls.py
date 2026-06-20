"""
=============================================================================
COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
emains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('metric_source/', metric_source_config),
    path('metric_source/<int:id>/', metric_source_config),
    path('metric_exporter/',metric_exporter),
    path('home_page/',home_page),
    path('', config_view),
    path('<str:config_name>/', config_view),
]
