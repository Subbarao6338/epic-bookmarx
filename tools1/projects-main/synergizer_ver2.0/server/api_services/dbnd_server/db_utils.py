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
import json
from .models import DatasetLog, TaskRun, TaskDefinition, TaskRunAttempt, TaskRunLog, TaskRunMetric


def insert_task_definitions(task_definitions: list = []):
    task_definitions_items = []
    for task_definition in task_definitions:
        task_definition_obj = TaskDefinition(
            task_definition_uid=task_definition['task_definition_uid'],
            name=task_definition['name'],
            type=task_definition['type'],
            source=task_definition['source'],
        )
        task_definitions_items.append(task_definition_obj)

    task_deinition_objs = TaskDefinition.objects.bulk_create(
        task_definitions_items, ignore_conflicts=True)
    return task_deinition_objs


def insert_task_runs_and_attempts(task_runs: list = [], af_context: dict = {}):
    task_run_items = []
    task_run_attempt_items = []
    for task_run in task_runs:
        task_run_obj = TaskRun(
            task_run_uid=task_run['task_run_uid'],
            task_definition_id=task_run['task_definition_uid'],
            pipeline_run_id=task_run['run_uid'],
            name=task_run["name"],
            is_root=task_run['is_root'],
            is_skipped=task_run['is_skipped'],
            try_number=af_context["try_number"],
            task_run_attempt_uid=task_run["task_run_attempt_uid"],
            execution_date=task_run["execution_date"],
            state=task_run['state'],
            task_run_params=json.dumps(task_run['task_run_params']),
        )

        task_run_attempt_obj = TaskRunAttempt(
            task_run_attempt_uid=task_run["task_run_attempt_uid"],
            task_run_id=task_run['task_run_uid'],
            attempt_number=af_context["try_number"],
            start_date=task_run["execution_date"],
            state=task_run['state'],
        )

        task_run_items.append(task_run_obj)
        task_run_attempt_items.append(task_run_attempt_obj)

    task_run_objs = TaskRun.objects.bulk_create(
        task_run_items, ignore_conflicts=True)
    task_run_attempt_objs = TaskRunAttempt.objects.bulk_create(
        task_run_attempt_items, ignore_conflicts=True)
    return (task_run_objs, task_run_attempt_objs)


def insert_task_run_metrics(task_run_metrics: list = []):
    task_run_metric_items = []
    for task_run_metric in task_run_metrics:
        metric = task_run_metric["metric"]
        task_run_metric_obj = TaskRunMetric(
            task_run_attempt_id=task_run_metric["task_run_attempt_uid"],
            source=metric["source"],
            key=metric["key"],
            value_int=metric["value_int"],
            value_float=metric["value_float"],
            value=metric["value"],
            value_str=metric["value_str"],
            value_json=json.dumps(metric["value_json"]),
            timestamp=metric["timestamp"],
        )
        task_run_metric_items.append(task_run_metric_obj)

    task_run_metric_objs = TaskRunMetric.objects.bulk_create(
        task_run_metric_items, ignore_conflicts=True)
    return task_run_metric_objs


def insert_task_run_log(task_run_log: dict = {}):
    task_run_log_obj = TaskRunLog.objects.create(
        task_run_attempt_id=task_run_log["task_run_attempt_uid"],
        log_body=task_run_log["log_body"],
        local_log_path=task_run_log["local_log_path"])

    return task_run_log_obj


def insert_datasets_log(datasets_info: list = []):
    dataset_log_items = []
    for dataset_log in datasets_info:
        dataset_log_obj = DatasetLog(
            pipeline_run_id=dataset_log["run_uid"],
            task_run_id=dataset_log["task_run_uid"],
            task_run_attempt_id=dataset_log["task_run_attempt_uid"],
            operation_type=dataset_log["operation_type"],
            operation_status=dataset_log["operation_status"],
            operation_error=dataset_log["operation_error"],
            task_run_name=dataset_log["task_run_name"],
            value_preview=dataset_log["value_preview"],
            with_partition=dataset_log["with_partition"],
            data_dimensions=json.dumps(dataset_log["data_dimensions"]),
            data_schema=json.dumps(dataset_log["data_schema"]),
            query=dataset_log['query'],
            dataset_uri=dataset_log["dataset_uri"],
            columns_stats=json.dumps(dataset_log["columns_stats"]),
            operation_path=dataset_log["operation_path"],
            operation_source=dataset_log["operation_source"],
            timestamp=dataset_log["timestamp"]
        )
        dataset_log_items.append(dataset_log_obj)
    dataset_log_objs = DatasetLog.objects.bulk_create(
        dataset_log_items, ignore_conflicts=True)
    return dataset_log_objs
