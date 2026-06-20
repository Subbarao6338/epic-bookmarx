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

from api_services.azure_df.views import list_factories, list_pipelines, pipeline_runs

urlpatterns = [
    path('pipelines/', list_pipelines),
    path('pipeline_runs/', pipeline_runs),
]
