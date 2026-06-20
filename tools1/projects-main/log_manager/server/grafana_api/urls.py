from django.contrib import admin
from django.urls import path

# from grafana_api.views import grafana_alert_rule, grafana_contact_point, grafana_alert_list
from grafana_api.views import *

urlpatterns = [
    path('rules/', grafana_alert_rule),
    path('rules/<str:rule_folder>/', grafana_alert_rule),
     path('rules/<str:rule_folder>/<str:rule_group>/', grafana_alert_rule),
    path('alertmanager/alerts/', grafana_contact_point),
    path('alertlist/', grafana_alert_list),
    path('alertlist_home/', grafana_alert_list_home),
    path('alertsummary/', grafana_alert_summary),

    # pipeline detail
    path('getadfpipeline_success/', get_adf_pipeline_success),
    path('getadfpipeline_failure/', get_adf_pipeline_failure),
    path('getairflowpipeline_success/', get_airflow_pipeline_success),
    path('getairflowpipeline_failure/', get_airflow_pipeline_failure),
    path('alertdatasourceuid/', grafana_alert_datasource),

]
