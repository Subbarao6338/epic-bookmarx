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
from django.db import models
from datetime import datetime
from django.utils import timezone
# Create your models here.


class PipelineDefinition(models.Model):
    id = models.AutoField(primary_key=True)
    dag_id = models.CharField(max_length=200, unique=True)
    run_count = models.IntegerField(default=0)
    success_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
    source_env = models.CharField(max_length=40, default='airflow')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PipelineRun(models.Model):
    run_uid = models.UUIDField(primary_key=True)
    pipeline_definition = models.ForeignKey(
        to=PipelineDefinition, on_delete=models.CASCADE, related_name="pipeline_run")
    dag_id = models.CharField(max_length=200, null=True)
    execution_date = models.DateTimeField()
    state = models.CharField(max_length=20)
    parent_child_map = models.TextField()
    upstreams_map = models.TextField()


class TaskDefinition(models.Model):
    task_definition_uid = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20)
    source = models.TextField(null=True)


class TaskRun(models.Model):
    task_run_uid = models.UUIDField(primary_key=True)
    task_definition = models.ForeignKey(
        to=TaskDefinition, on_delete=models.CASCADE, related_name="task_run")
    pipeline_run = models.ForeignKey(
        to=PipelineRun, on_delete=models.CASCADE, related_name="task_run")
    name = models.CharField(max_length=200, null=True)
    is_root = models.BooleanField(default=False)
    is_skipped = models.BooleanField(default=False)
    try_number = models.IntegerField(default=1)
    task_run_attempt_uid = models.UUIDField(null=True)
    execution_date = models.DateTimeField(null=True)
    start_date = models.DateTimeField(null=True)
    end_date = models.DateTimeField(null=True)
    state = models.CharField(max_length=20)
    task_run_params = models.TextField()


class TaskRunAttempt(models.Model):
    task_run_attempt_uid = models.UUIDField(primary_key=True)
    task_run = models.ForeignKey(
        to=TaskRun, on_delete=models.CASCADE, related_name="task_run_attempt")
    attempt_number = models.IntegerField(default=1, null=True)
    start_date = models.DateTimeField(null=True)
    end_date = models.DateTimeField(null=True)
    timestamp = models.DateTimeField(null=True)
    state = models.CharField(max_length=20)


class TaskRunMetric(models.Model):
    id = models.AutoField(primary_key=True)
    task_run_attempt = models.ForeignKey(
        to=TaskRunAttempt, on_delete=models.CASCADE, related_name="task_run_metric")
    source = models.CharField(max_length=200, null=True)
    key = models.CharField(max_length=200, null=True)
    value_int = models.IntegerField(null=True)
    value_float = models.FloatField(null=True)
    value = models.TextField(null=True)
    value_str = models.TextField(null=True)
    value_json = models.TextField(null=True)
    timestamp = models.DateTimeField(null=True)


class TaskRunLog(models.Model):
    id = models.AutoField(primary_key=True)
    task_run_attempt = models.ForeignKey(
        to=TaskRunAttempt,  on_delete=models.CASCADE, related_name="task_run_log")
    log_body = models.TextField()
    local_log_path = models.TextField(null=True)


class DatasetLog(models.Model):
    id = models.AutoField(primary_key=True)
    pipeline_run = models.ForeignKey(
        to=PipelineRun, on_delete=models.CASCADE, related_name='dataset_log')
    task_run = models.ForeignKey(
        to=TaskRun, on_delete=models.CASCADE, related_name="dataset_log")
    task_run_attempt = models.ForeignKey(
        to=TaskRunAttempt, on_delete=models.CASCADE, related_name="dataset_log")
    operation_type = models.CharField(max_length=20)
    operation_status = models.CharField(max_length=20)
    operation_error = models.TextField(null=True)
    task_run_name = models.CharField(max_length=200)
    value_preview = models.TextField(null=True)
    with_partition = models.CharField(max_length=200, null=True)
    data_dimensions = models.TextField()
    data_schema = models.TextField()
    query = models.TextField(null=True)
    dataset_uri = models.CharField(max_length=200, null=True)
    columns_stats = models.TextField(null=True)
    operation_path = models.CharField(max_length=100)
    operation_source = models.CharField(max_length=100, null=True)
    timestamp = models.DateTimeField()
