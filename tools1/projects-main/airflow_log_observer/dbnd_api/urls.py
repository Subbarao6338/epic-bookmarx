"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""

from django.urls import path
from dbnd_api import views

urlpatterns = [
    path('', views.hello_api),
    path('v1/auth/login', views.login),
    path('v1/tracking/init_run', views.init_run_log),
    path('v1/tracking/add_task_runs', views.add_task_runs),
    path('v1/tracking/update_task_run_attempts', views.update_task_run_attempts),
    path('v1/tracking/log_metrics', views.log_metrics),
    path('v1/tracking/save_task_run_log', views.save_task_run_log),
    path('v1/tracking/log_datasets', views.log_datasets),
    path('v1/tracking/log_targets', views.log_targets),
    path('v1/tracking/set_run_state', views.set_run_state),
    path('v1/log_exception', views.log_exception),
]
