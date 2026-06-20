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
from django.shortcuts import render

# Create your views here.
from asyncio import Task
from django.http import HttpResponse, JsonResponse
import json
import gzip
from rest_framework import viewsets

from .db_utils import insert_datasets_log, insert_task_definitions, insert_task_run_log, insert_task_run_metrics,  insert_task_runs_and_attempts
from .models import DatasetLog, PipelineDefinition, PipelineRun, TaskDefinition, TaskRun, TaskRunLog, TaskRunMetric
from .serializers import DatasetLogSerializer, PipelineRunSerializer, PipelineSerializer, TaskDefinitionSerializer, TaskRunLogSerializer, TaskRunMetricSerializer, TaskRunSerializer
# Create your views here.


def _parse_json_body(raw_data):
    try:
        data = json.loads(gzip.decompress(raw_data))
    except json.JSONDecodeError:
        data = None
    return data

#########################################################################################
# TRACKING
#########################################################################################


def init_task_run_view(request):
    raw_data = request.body
    data = _parse_json_body(raw_data)

    run_uid = data["init_args"]["run_uid"]
    dag_id = data["init_args"]["af_context"]["dag_id"]
    execution_date = data["init_args"]["af_context"]["execution_date"]
    state = data['init_args']["new_run_info"]["state"]

    pipeline_defination, is_created = PipelineDefinition.objects.get_or_create(
        dag_id=dag_id
    )

    pipeline_run = PipelineRun.objects.get_or_create(
        run_uid=run_uid,
        defaults={
            'pipeline_definition_id': pipeline_defination.pk,
            'execution_date': execution_date,
            "dag_id": dag_id,
            'state': state,
            'parent_child_map': json.dumps([]),
            'upstreams_map': json.dumps([])
        }
    )

    task_definitions = data["init_args"]['task_runs_info']['task_definitions']
    task_runs = data["init_args"]['task_runs_info']['task_runs']
    af_context = data["init_args"]['task_runs_info']["af_context"]

    insert_task_definitions(task_definitions=task_definitions)
    insert_task_runs_and_attempts(task_runs=task_runs, af_context=af_context)

    return JsonResponse({"status": "success"})


def add_task_runs_view(request):
    raw_data = request.body
    data = _parse_json_body(raw_data)

    af_context = data['task_runs_info']["af_context"]
    run_uid = data['task_runs_info']["run_uid"]
    task_definitions = data['task_runs_info']['task_definitions']
    task_runs = data['task_runs_info']['task_runs']

    insert_task_definitions(task_definitions=task_definitions)
    insert_task_runs_and_attempts(task_runs=task_runs, af_context=af_context)

    pipeline_run_obj = PipelineRun.objects.get(run_uid=run_uid)
    pipeline_run_obj.parent_child_map = json.dumps(json.loads(
        pipeline_run_obj.parent_child_map) + data['task_runs_info']['parent_child_map'])
    pipeline_run_obj.upstreams_map = json.dumps(json.loads(
        pipeline_run_obj.upstreams_map) + data['task_runs_info']['upstreams_map'])
    pipeline_run_obj.save()

    return JsonResponse({"status": "success"})


def save_task_run_metrics_view(request):
    raw_data = request.body
    data = _parse_json_body(raw_data)

    metrics_info = data["metrics_info"]
    insert_task_run_metrics(task_run_metrics=metrics_info)

    return JsonResponse({"status": "success"})


def save_task_run_log_view(request):
    raw_data = request.body
    data = _parse_json_body(raw_data)

    insert_task_run_log(task_run_log=data)
    return JsonResponse({"status": "success"})


def save_dataset_log(request):
    raw_data = request.body
    data = _parse_json_body(raw_data)

    insert_datasets_log(datasets_info=data["datasets_info"])
    return JsonResponse({"status": "success"})


##############################################################################################
#                                       QUERY
##############################################################################################


def get_pipelines_view(request, pipeline_uid=None):
    if pipeline_uid:
        pipelines = PipelineDefinition.objects.filter(
            id=pipeline_uid)

        serializer = PipelineSerializer(pipelines, many=True)
        return JsonResponse({"pipelines": serializer.data})

    pipelines = PipelineDefinition.objects.all()
    serializer = PipelineSerializer(pipelines, many=True)
    return JsonResponse({"pipelines": serializer.data})


def get_pipeline_runs_view(request, pipeline_uid=None, run_uid=None):

    if pipeline_uid and run_uid:
        pipeline_runs = PipelineRun.objects.filter(
            pipeline_definition_id=pipeline_uid, run_uid=run_uid)
        serializer = PipelineRunSerializer(pipeline_runs, many=True)
        return JsonResponse({"pipeline_runs":  serializer.data})

    if pipeline_uid:
        pipeline_runs = PipelineRun.objects.filter(
            pipeline_definition_id=pipeline_uid)
        serializer = PipelineRunSerializer(pipeline_runs, many=True)
        return JsonResponse({"pipeline_runs":  serializer.data})

    if run_uid:
        pipeline_runs = PipelineRun.objects.filter(
            run_uid=run_uid)
        serializer = PipelineRunSerializer(pipeline_runs, many=True)
        return JsonResponse({"pipeline_runs":  serializer.data})


def get_task_definition_view(request, task_definition_uid):
    task_definition = TaskDefinition.objects.get(
        task_definition_uid=task_definition_uid)
    serializer = TaskDefinitionSerializer(task_definition)
    return JsonResponse({"task_definition": serializer.data})


def get_task_runs_view(request, run_uid=None, task_run_uid=None):
    if run_uid:
        task_runs = TaskRun.objects.filter(run_uid=run_uid)
        serializer = TaskRunSerializer(task_runs, many=True)
        return JsonResponse({"task_runs": serializer.data})

    if task_run_uid:
        task_runs = TaskRun.objects.filter(task_run_uid=task_run_uid)
        serializer = TaskRunSerializer(task_runs, many=True)
        return JsonResponse({"task_runs": serializer.data})


def get_task_runs_from_execution_date(request, dag_id, execution_date):
    if dag_id and execution_date:
        task_runs = TaskRun.objects.filter(
            pipeline_run__dag_id=dag_id,
            pipeline_run__execution_date=execution_date
        )
        serializer = TaskRunSerializer(task_runs, many=True)
        return JsonResponse({"task_runs": serializer.data})


def get_task_run_metrics(request, task_run_uid, task_run_attempt_uid):
    task_run_metrics = TaskRunMetric.objects.filter(
        task_run_attempt_id=task_run_attempt_uid)
    serializer = TaskRunMetricSerializer(task_run_metrics, many=True)
    return JsonResponse({"task_run_metrics": serializer.data}, json_dumps_params={"indent": 2})


def get_task_run_logs(request, task_run_uid, task_run_attempt_uid):
    task_run_log = TaskRunLog.objects.filter(
        task_run_attempt_id=task_run_attempt_uid)
    serializer = TaskRunLogSerializer(task_run_log, many=True)
    return JsonResponse({"task_run_log": serializer.data}, json_dumps_params={"indent": 2})


def get_dataset_logs_view(request, pipeline_run_id):
    datset_logs = DatasetLog.objects.filter(pipeline_run_id=pipeline_run_id)
    serializer = DatasetLogSerializer(datset_logs, many=True)
    return JsonResponse({"dataset_logs": serializer.data}, json_dumps_params={"indent": 2})


def get_dataset_operations_view(request):
    task_run_name = request.GET.get("task_run_name")
    operation_path = request.GET.get("operation_path")
    datset_logs = DatasetLog.objects.filter(task_run_name=task_run_name,
                                            operation_path=operation_path)
    serializer = DatasetLogSerializer(datset_logs, many=True)
    return JsonResponse({"dataset_logs": serializer.data}, json_dumps_params={"indent": 2})
