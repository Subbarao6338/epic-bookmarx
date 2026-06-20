from django.urls import path, re_path
from api import controller
from django.conf.urls import url

urlpatterns = [
    url(r'^test_api', controller.test_api, name='test_api'),
    url(r'^get_task_list', controller.get_task_list, name='get_task_list'),
    url(r'^get_task_status', controller.get_task_status, name='get_task_status'),
    url(r'^get_job_status', controller.get_job_status, name='get_job_status'),
    url(r'^create_validation_job', controller.create_validation_job, name='create_validation_job'),
    url(r'^list_validation_task', controller.list_validation_task, name='list_validation_task'),
    url(r'^get_validation_result', controller.get_validation_result, name='get_validation_result'),
]
