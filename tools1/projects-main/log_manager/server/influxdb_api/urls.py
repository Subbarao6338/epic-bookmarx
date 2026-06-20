from django.contrib import admin
from django.urls import path

from influxdb_api.views import get_buckets_list, influxdb_query_proxy, influxdb_sync_logs, metric_forecast, query_logs, fluentd_logs,fluentd_sync_logs


urlpatterns = [
    path('buckets/', get_buckets_list),
    path('query/', influxdb_query_proxy),
    path('sync_logs/', influxdb_sync_logs),
    path('query_logs/', query_logs),
    path('metric_forecast/', metric_forecast),
    path('fluentd_logs/',fluentd_logs),
    path('fluentd_sync_logs/',fluentd_sync_logs)
]
