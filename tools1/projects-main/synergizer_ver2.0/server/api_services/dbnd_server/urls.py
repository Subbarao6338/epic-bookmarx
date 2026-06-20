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
"""tutorial URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


from django.urls import path, re_path
from .views import *
urlpatterns = [
    # tracking
    re_path('tracking/init_run', init_task_run_view),
    re_path('tracking/add_task_runs', add_task_runs_view),
    re_path('tracking/log_metrics', save_task_run_metrics_view),
    re_path('tracking/save_task_run_log', save_task_run_log_view),
    re_path('tracking/log_datasets', save_dataset_log),
    # querying
    # pipeline
    path('airflow/pipelines', get_pipelines_view),
    path('airflow/pipelines/<str:pipeline_uid>', get_pipelines_view),
    # pipeline run
    path('airflow/pipelines/<str:pipeline_uid>/pipeline_runs',
         get_pipeline_runs_view),
    path('airflow/pipeline_runs/<str:run_uid>', get_pipeline_runs_view),
    # task definition
    path('airflow/task_definition/<str:task_definition_uid>',
         get_task_definition_view),
    # task run
    path('airflow/pipeline_runs/<str:run_uid>/task_runs', get_task_runs_view),
    path('airflow/task_runs/<str:task_run_uid>',  get_task_runs_view),
    path("airflow/pipelines/<str:dag_id>/execution_date/<str:execution_date>/task_runs/",
         get_task_runs_from_execution_date),
    # task run metrics
    path("airflow/task_runs/<str:task_run_uid>/task_run_attempts/<str:task_run_attempt_uid>/metrics/",
         get_task_run_metrics),
    # task run log
    path("airflow/task_runs/<str:task_run_uid>/task_run_attempts/<str:task_run_attempt_uid>/logs/",
         get_task_run_logs),
    # dataset logs
    path("airflow/pipeline_runs/<str:pipeline_run_id>/dataset_logs/",
         get_dataset_logs_view),
    path("airflow/dataset_operations/",
         get_dataset_operations_view)
]
