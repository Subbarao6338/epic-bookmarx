"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
import gzip
import json

from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view

from db_utils import af_log_parsing_utils


def hello_api(request):
    return JsonResponse(
        {'json': 'success',
         'api_version': '0.01',
         'message': "Hello API give me response"
         }
    )


def login(request):
    return JsonResponse({'api_version': '0.01', 'description': "Hello API give me response"})


def init_run_log(request):
    data = json.loads(gzip.decompress(request.body))
    response = af_log_parsing_utils.insert_init_run_log_info(data)
    if response:
        return JsonResponse(
            {
                'json': 'success',
                'api_version': '0.01'
            }
        )
    else:
        return JsonResponse(
            {
                'json': 'failed',
                'api_version': '0.01'
            }
        )


def add_task_runs(request):
    data = json.loads(gzip.decompress(request.body))
    response = af_log_parsing_utils.insert_add_task_runs_info(data)
    if response:
        return JsonResponse(
            {
                'json': 'success',
                'api_version': '0.01'
            }
        )
    else:
        return JsonResponse(
            {
                'json': 'failed',
                'api_version': '0.01'
            }
        )


def update_task_run_attempts(request):
    data = json.loads(gzip.decompress(request.body))
    response = af_log_parsing_utils.update_task_run_attempts(data)
    if response:
        return JsonResponse(
            {
                'json': 'success',
                'api_version': '0.01'
            }
        )
    else:
        return JsonResponse(
            {
                'json': 'failed',
                'api_version': '0.01'
            }
        )


def log_metrics(request):
    data = json.loads(gzip.decompress(request.body))
    response = af_log_parsing_utils.insert_metrics_info(data)
    if response:
        return JsonResponse(
            {
                'json': 'success',
                'api_version': '0.01'
            }
        )
    else:
        return JsonResponse(
            {
                'json': 'failed',
                'api_version': '0.01'
            }
        )


def save_task_run_log(request):
    data = json.loads(gzip.decompress(request.body))
    response = af_log_parsing_utils.insert_task_run_log_info(data)
    if response:
        return JsonResponse(
            {
                'json': 'success',
                'api_version': '0.01'
            }
        )
    else:
        return JsonResponse(
            {
                'json': 'failed',
                'api_version': '0.01'
            }
        )


def log_datasets(request):
    data = json.loads(gzip.decompress(request.body))
    response = af_log_parsing_utils.insert_dataset_info(data)
    if response:
        return JsonResponse(
            {
                'json': 'success',
                'api_version': '0.01'
            }
        )
    else:
        return JsonResponse(
            {
                'json': 'failed',
                'api_version': '0.01'
            }
        )


def log_targets(request):
    data = json.loads(gzip.decompress(request.body))
    response = af_log_parsing_utils.insert_targets_info(data)
    if response:
        return JsonResponse(
            {
                'json': 'success',
                'api_version': '0.01'
            }
        )
    else:
        return JsonResponse(
            {
                'json': 'failed',
                'api_version': '0.01'
            }
        )


def set_run_state(request):
    data = json.loads(gzip.decompress(request.body))
    response = af_log_parsing_utils.set_run_state(data)
    if response:
        return JsonResponse(
            {
                'json': 'success',
                'api_version': '0.01'
            }
        )
    else:
        return JsonResponse(
            {
                'json': 'failed',
                'api_version': '0.01'
            }
        )


def log_exception(request):
    return JsonResponse(
        {
            'json': 'success',
            'api_version': '0.01'
        }
    )