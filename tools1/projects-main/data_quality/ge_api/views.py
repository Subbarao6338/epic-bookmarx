from datetime import datetime
import uuid
from django.shortcuts import render
from django_celery_beat.models import PeriodicTask, IntervalSchedule
from xmlrpc.client import ResponseError
from pydantic import Json
from db_utils.db_connection import execute_get_query
import json
from django.http.response import JsonResponse
from ge_api.models import Report, ResultV1
from ruamel import yaml
from ge_utils import datasource, data_context, expectations, checkpoint, validation, streamdata_utils
from ge_utils.data_profiling import profile_data_asset, get_columns_list
from db_utils import datasource as datasource_db_utilities 
from db_utils import expectation as expectation_db_utilities
from db_utils import checkpoint as checkpoint_db_utilities
from db_utils import validation as validation_db_utilities
from db_utils import stream_validation as stream_db_utilities
from db_utils import wizard as wizard_db_utilities

### DATASOURCE
def list_datasources_view(request):
    datasource_list = datasource_db_utilities.get_datasource_list()
    return JsonResponse({'datasources': datasource_list})

def create_datasource_view(request):
    json_body = request.POST.dict()
    ds_name = json_body['name']
    if(datasource_db_utilities.check_duplicates_datasource(ds_name)):
        return JsonResponse({"duplicate": True})
    else:
        context = data_context.create_context()
        files = request.FILES.getlist('files')
        ret = datasource.create_datasource(context, json_body, files)
        datasource_list = datasource_db_utilities.get_datasource_list()
        return JsonResponse({"duplicate": False, 'datasources': datasource_list})

def delete_datasource_view(request, datasource_name):
    context = data_context.create_context()
    datasource.delete_datasource(context, datasource_name)
    datasource_list = datasource_db_utilities.get_datasource_list()
    return JsonResponse({'datasources': datasource_list})

### DATA ASSETS
def list_data_assets_view(request, datasource_name):
    context = data_context.create_context()
    data_asset_list = datasource.list_data_assets(context, datasource_name)
    return JsonResponse({'data_assets': data_asset_list })


### DATA PROFILING
def get_columns_of_asset(request):
    if request.method == "POST":
        datasource_name = request.POST['datasource_name']
        data_asset_name = request.POST['asset_name']
        out = get_columns_list(datasource_name, data_asset_name)
        return JsonResponse({'columns': out})

def data_profiling_view(request):
    if request.method == 'POST':
        datasource_name = request.POST['datasource_name']
        data_asset_name = request.POST['data_asset_name']
        row_percentage = request.POST['row_percentage']
        columns = request.POST['columns']
        report = profile_data_asset(datasource_name, data_asset_name, int(row_percentage), columns)
        return JsonResponse({'report': report})


### EXPECTATION SUITES
def create_expectation_suite_view(request):
    suite_config = json.loads(request.POST['suite_config'])
    suite_name = suite_config['expectation_suite_name']
    if(expectation_db_utilities.check_duplicates_suite(suite_name)):
        return JsonResponse({"duplicate": True})  
    else:
        context = data_context.create_context()
        ret = expectations.create_expectation_suite(context, suite_config)
        suite_list = expectation_db_utilities.get_expectation_suite_list()
        return JsonResponse({"duplicate": False, 'suite_list': suite_list})

def list_expectation_suites_view(request):
    context = data_context.create_context()
    suite_list = expectations.list_expectation_suites(context)
    return JsonResponse({'suite_list': suite_list})

def delete_expectation_suite_view(request, suite_name):
    context = data_context.create_context()
    suite_list = expectations.delete_expectation_suite(context, suite_name)
    return JsonResponse({'suite_list': suite_list})


### CHECKPOINT
def list_checkpoints_view(request):
    checkpoint_list = checkpoint.list_checkpoints()
    return JsonResponse({'checkpoint_detail': checkpoint_list})

def create_checkpoint_view(request):
    checkpoint_config = json.loads(request.POST['checkpoint_config'])
    checkpoint_name = checkpoint_config['name']
    if(checkpoint_db_utilities.check_duplicate_checkpoint(checkpoint_name)):
        return JsonResponse({'duplicate': True})
    else:
        context = data_context.create_context()
        checkpoint_list = checkpoint.create_checkpoint(context, checkpoint_config)
        return JsonResponse({'duplicate': False, 'checkpoint_detail': checkpoint_list})

def run_checkpoint_view(request, checkpoint_name):
    if request.method == 'POST':
        query = """SELECT * FROM ge_checkpoint_store WHERE checkpoint_name=%s"""
        # result = engine.execute(query, checkpoint_name).fetchone()
        result = execute_get_query(query, [checkpoint_name])
        result = result[0]
        result = yaml.load(dict(result)['value'])

        report = Report.objects.create(
            execution_start=datetime.now(),
            checkpoint_name=checkpoint_name,
            datasource_name=result['validations'][0]['batch_request']['datasource_name'],
            target_dataset=result['validations'][0]['batch_request']['data_asset_name'],
            rule_name=result['validations'][0]["expectation_suite_name"]
        )
        id = report.pk
        context = data_context.create_context()
        result = checkpoint.run_checkpoint(context, checkpoint_name)
        try:
            rows_processed = max(
                r['result'].get("element_count", 0)
                for r in result['results'])

            rows_failed = sum(
                r['result'].get("unexpected_count", 0)
                for r in result['results'])
        except:
            rows_processed = 0
            rows_failed = 0

        report = Report.objects.filter(id=id).update(
            execution_end=datetime.now(),
            success=result['success'],
            rows_processed=rows_processed,
            rows_passed=rows_processed - rows_failed,
            rows_failed=rows_failed,
            statistics=result["statistics"],
        )
        return JsonResponse({'result': result})

def delete_checkpoint_view(request, checkpoint_name):
    context = data_context.create_context()
    checkpoint_list = checkpoint.delete_checkpoint(context, checkpoint_name)
    return JsonResponse({'checkpoint_detail': checkpoint_list})


### VALIDATION
def validations_view(request):
    data = validation_db_utilities.db_get_validations()
    return JsonResponse({"validations": data})

def validation_view(request, suite_name=None, run_name=None):
    if request.method == 'POST':
        context = data_context.create_context()
        checkpoint_config = json.loads(request.POST['checkpoint_config'])
        expectation_suite_name = request.POST['expectation_suite_name']
        result = validation.run_validation(
            context,
            checkpoint_config,
            expectation_suite_name)
        return JsonResponse({'result': result})
    elif request.method == 'DELETE':
        ResultV1.objects.filter(run_name=run_name).delete()
        Report.objects.filter(checkpoint_name = run_name.split('-')[0]).delete()
        validations = validation_db_utilities.db_delete_validation(suite_name, run_name)
        return JsonResponse({"validations": validations})


### STREAM DATA VALIDATION
def create_stream_checkpoint_view(request):
    checkpoint_name = request.POST['checkpoint_name']
    datasource_name = request.POST['datasource_name']
    expectation_suite_name = request.POST['expectation_suite_name']
    stream_db_utilities.db_create_stream_checkpoint(
        checkpoint_name, datasource_name, expectation_suite_name)
    return JsonResponse({'checkpoints': []})

def delete_stream_checkpoint_view(request, checkpoint_name):
    streamdata_utils.stop_validation_task(checkpoint_name=checkpoint_name)
    stream_db_utilities.db_delete_stream_validations(checkpoint_name=checkpoint_name)
    stream_db_utilities.db_delete_stream_checkpoint(checkpoint_name=checkpoint_name)
    return JsonResponse({"status": "success"})

def list_stream_checkpoints_view(request):
    results = stream_db_utilities.db_getall_stream_checkpoints()
    return JsonResponse({'checkpoints': results or []})

def start_streamdata_validation_view(request, ):
    if request.method == 'POST':
        checkpoint_name = request.POST['checkpoint_name']
        task_name = streamdata_utils.start_validation_task(
            checkpoint_name=checkpoint_name
        )
        return JsonResponse({"task_name": task_name})

def stop_streamdata_validation_view(request,):
    if request.method == 'POST':
        checkpoint_name = request.POST['checkpoint_name']
        task_name = streamdata_utils.stop_validation_task(
            checkpoint_name=checkpoint_name
        )
        return JsonResponse({"task_name": task_name})

def get_streamdata_validations_view(request, checkpoint_name):
    validations = stream_db_utilities.db_get_stream_validations(checkpoint_name=checkpoint_name)
    summary = stream_db_utilities.db_get_strem_validation_summary(checkpoint_name=checkpoint_name)
    return JsonResponse({'validations': validations, 'summary': summary})


### REPORT
def details_report_view(request, id=None):
    if request.method == 'GET':
        reports = Report.objects.all().values()
        reports_v1 = ResultV1.objects.all().values()
        return JsonResponse({"reports": list(reports), 'reports_v1': list(reports_v1)})
    if request.method == 'DELETE':
        report = Report.objects.filter(id=id).delete()
        reports = Report.objects.all().values()
        return JsonResponse({"reports": list(reports), "status": "success"})

### WIZARD FLOW
def get_datasource_details_view(request, ds_name):
    if request.method == 'GET':
        detail = datasource_db_utilities.get_ds_details(ds_name)
        return JsonResponse({"detail": detail})

def insert_datasource_name_wizard_flow_view(request):
    if request.method == 'POST':
        json_body = request.POST.dict()
        datasource_name = json_body['name']
        response = wizard_db_utilities.insert_datasource_name_to_wizard(datasource_name)
        return JsonResponse({"status": "success"})


def update_asset_to_wizard_flow_view(request):
    if request.method == 'POST':
        json_body = request.POST.dict()
        datasource_name = json_body['datasource_name']
        data_asset = json_body['selectedDataAssets']
        current_page = json_body['current_page']
        status = json_body['status']
        response = wizard_db_utilities.update_asset_to_wizard(datasource_name, current_page, status, data_asset)
        return JsonResponse({"status": "success"})

def get_wizard_detail_view(request):
    if request.method == 'GET':
        detail = wizard_db_utilities.get_wizard_detail()
        return JsonResponse({"detail": detail})


def update_wizard_with_asset_and_col_data_view(request):
    if request.method == 'POST':
        json_body = request.POST.dict()
        all_cols = json_body['all_cols']
        asset_for_profile = json_body['asset_for_profile']
        print(all_cols)
        response = wizard_db_utilities.update_all_cols_to_wizard(all_cols, asset_for_profile)
        return JsonResponse({"status" : "success"})

def update_status_to_wizard_flow_view(request):
    if request.method == 'POST':
        json_body = request.POST.dict()
        status = json_body['status']
        current_page = json_body['current_page']
        print(status, current_page)
        response = wizard_db_utilities.update_wizard_status(status, current_page)
        return JsonResponse({"status": "success"})

def update_selected_ce_to_wizard_flow_view(request):
    if request.method == 'POST':
        json_body = request.POST.dict()
        selected_ce = json_body['selected_ces']
        current_page = json_body['current_page']
        print(selected_ce)
        response = wizard_db_utilities.update_selected_ce_to_wizard(selected_ce, current_page)
        return JsonResponse({"status": "success"})
 
def update_expectation_suite_to_wizard_flow_view(request):
    if request.method == 'POST':
        json_body = request.POST.dict()
        suite_name = json_body['expectation_suite_name']
        if(expectation_db_utilities.check_duplicates_suite(suite_name)):
            return JsonResponse({'duplicate': True})
        else:
            wizard_db_utilities.update_suite_name_to_wizard(suite_name)
            return JsonResponse({"status": "success", 'duplicate': False})


#########################    API     #########################
# run_checkpoint_view()

def api_validation_view(request):
    context = data_context.create_context()
    now = datetime.now()
    if request.method == 'POST':
        json_request = json.loads(request.body)
        print(json_request)
        datasource_name = json_request['datasource_name']
        data_asset_name = json_request['data_asset_name']
        expectation_suite_name = json_request['expectation_suite_name']
        run_name = json_request['run_name']
        batch_request = {
            "datasource_name": datasource_name,
            "data_connector_name": "default_inferred_data_connector_name",
            "data_asset_name": data_asset_name,
        }
        checkpoint_config = {
            "class_name": "SimpleCheckpoint",
            "run_name_template": run_name + now.strftime("-%Y%m%d-%H%M%S"),
            "validations": [
                {
                "batch_request": batch_request,
                "expectation_suite_name": expectation_suite_name,
                },
            ],
        }
        result = validation.run_validation(
            context,
            checkpoint_config,
            expectation_suite_name)
        return JsonResponse({'result': result})