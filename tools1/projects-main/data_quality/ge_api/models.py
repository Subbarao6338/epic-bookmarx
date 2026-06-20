from django.db import models
from datetime import datetime

# Create your models here.

# class User(models.Model):
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)


class Datasource(models.Model):
    user_id = models.CharField(max_length=40, default='123')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=40, choices=[(
        'batch', 'batch_data'), ('stream', 'stream_data')])
    source = models.CharField(max_length=100)
    credentials = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class DataProfile(models.Model):
    datasource_id = models.ForeignKey(to=Datasource, on_delete=models.CASCADE)
    dataset = models.CharField(max_length=100)
    ref_datasets = models.TextField()
    fields = models.TextField()
    total_records = models.IntegerField()
    report = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class DQDimension(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(default='No description available')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class RuleModel(models.Model):
    dq_dimension_id = models.ForeignKey(
        to=DQDimension, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    json = models.TextField(default="")
    example = models.TextField(default="")
    default_threshold = models.FloatField(default=1)
    description = models.TextField(default="No description available")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Project(models.Model):
    datasource_id = models.ForeignKey(to=Datasource, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    dataset = models.CharField(max_length=100)
    ref_datasets = models.TextField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class CDE(models.Model):
    project_id = models.ForeignKey(to=Project, on_delete=models.CASCADE)
    field_name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Rule(models.Model):
    cde_id = models.ForeignKey(to=CDE, on_delete=models.CASCADE)
    rule_model_id = models.ForeignKey(to=RuleModel, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    json = models.TextField(default="")
    threshold = models.FloatField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Execution(models.Model):
    project_id = models.ForeignKey(to=Project, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=[(
        'in-progress', 'Progress'), ('completed', 'Completed')])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Result(models.Model):
    execution_id = models.ForeignKey(
        to=Execution, on_delete=models.CASCADE, default='123')
    rule_id = models.ForeignKey(to=Rule, on_delete=models.CASCADE)
    total_records = models.IntegerField(default=0)
    records_passed = models.IntegerField(default=0)
    records_failed = models.IntegerField(default=0)
    p_records_passed = models.FloatField(default=0)
    p_records_failed = models.FloatField(default=0)
    result_status = models.BooleanField()
    json_result = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


########################## Temporary ##########################

class ResultV1(models.Model):
    datasource_name = models.CharField(max_length=100)
    dataset_name = models.CharField(max_length=100)
    cde_name = models.CharField(max_length=100, default='none')
    expectation_suite_name = models.CharField(max_length=100)
    run_name = models.CharField(max_length=100)
    expectation_name = models.CharField(max_length=100)
    expectation_config = models.TextField(default='')
    dq_dimension = models.CharField(max_length=100)
    result_status = models.BooleanField()
    result_json = models.TextField(default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Report(models.Model):
    tenant_id = models.CharField(max_length=40, null=True)
    execution_start = models.DateTimeField(default=datetime.now)
    execution_end = models.DateTimeField(null=True)
    datasource_name = models.CharField(max_length=100)
    rule_name = models.CharField(max_length=100)
    run_name = models.CharField(max_length=100, null=True)
    checkpoint_name = models.CharField(max_length=100, null=True)
    source_dataset = models.CharField(max_length=100, null=True)
    target_dataset = models.CharField(max_length=100)
    rows_processed = models.IntegerField(default=0)
    rows_passed = models.IntegerField(default=0)
    rows_failed = models.IntegerField(default=0)
    results = models.TextField(null=True)
    statistics = models.TextField(null=True)
    success = models.BooleanField(null=True)
    complete_result_url = models.URLField(max_length=200, null=True)
