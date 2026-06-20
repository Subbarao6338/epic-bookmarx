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

from influxdb_api.views import get_buckets_list, influxdb_query_proxy


urlpatterns = [
    path('buckets/', get_buckets_list),
    path('query/', influxdb_query_proxy),
]
