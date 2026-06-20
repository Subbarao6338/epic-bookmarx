from django.contrib import admin
from django.urls import path

from influxdb_api.views import get_buckets_list, influxdb_query_proxy


urlpatterns = [
    path('buckets/', get_buckets_list),
    path('query/', influxdb_query_proxy),
]
