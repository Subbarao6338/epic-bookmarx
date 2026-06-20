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
from .views import get_airflow_metrics, get_airflow_metrics_v2, get_dag_list, get_dag_run_view, get_dag_source_view, get_task_instance_log_view, get_task_instances_view, get_tasks_of_dag_view
from .views import get_dag_details
from .views import get_dag_runs

urlpatterns = [
    path('metrics/', get_airflow_metrics),
    path('metrics_v2/', get_airflow_metrics_v2),

    path('dags/', get_dag_list),
    path('dags/<str:dag_id>', get_dag_details),
    path('dags/<str:dag_id>/tasks', get_tasks_of_dag_view),
    path('dag_source/<str:file_token>', get_dag_source_view),
    path('dag_detail/', get_dag_details),
    path('dag_runs/', get_dag_runs),
    path('dag_runs/<str:dag_id>/', get_dag_runs),
    path('dags/<str:dag_id>/dagRuns/<str:dag_run_id>', get_dag_run_view),
    path('dags/-/task_instances_batch/', get_task_instances_view),
    path('dags/<str:dag_id>/dag_runs/<str:dag_run_id>/task_instances/',
         get_task_instances_view),
    path('dags/<str:dag_id>/dagRuns/<str:dag_run_id>/taskInstances/<str:task_id>/logs/<int:task_try_number>/',
         get_task_instance_log_view),
]
