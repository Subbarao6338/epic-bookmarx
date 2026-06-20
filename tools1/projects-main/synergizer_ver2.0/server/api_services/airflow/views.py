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
import time
import airflow_client.client as client
from airflow_client.client.api import dag_api, task_instance_api
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from airflow_client.client.api import dag_run_api
from pprint import pprint
from airflow_client.client.model.list_task_instance_form import ListTaskInstanceForm
from airflow_client.client.model.list_dag_runs_form import ListDagRunsForm
from airflow_client.client.model.inline_response200 import InlineResponse200
from airflow_client.client.api import dag_api
import json
from influxdb_client import InfluxDBClient, Point, WritePrecision, Dialect
from influxdb_client.client.write_api import SYNCHRONOUS
import configparser
from datetime import datetime, timedelta, timezone
import urllib.parse
import requests

parser = configparser.ConfigParser()
parser.read('config.ini')

af_api_url = parser.get('airflow', 'api_url')
username = parser.get('airflow', 'username')
password = parser.get('airflow', 'password')


# Create your views here.

def get_airflow_configuration():
    configuration = client.Configuration(
        host=af_api_url,
        username=username,
        password=password
    )
    return configuration


def get_dag_list(request):
    configuration = get_airflow_configuration()
#    with get_airflow_client() as api_client:
    with client.ApiClient(configuration) as api_client:
        api_instance = dag_api.DAGApi(api_client)
        try:
            # List DAGs
            api_response = api_instance.get_dags()
            return JsonResponse(api_response.to_dict())
        except client.ApiException as e:
            print("Exception when calling DAGApi->get_dags: %s\n" % e)


def get_dag_details(request, dag_id):
    configuration = get_airflow_configuration()
    with client.ApiClient(configuration) as api_client:
        # Create an instance of the API class
        api_instance = dag_api.DAGApi(api_client)
        dag_id = dag_id  # str | The DAG ID.

        try:
            # Get basic information about a DAG
            api_response = api_instance.get_dag(dag_id)
            return JsonResponse(api_response.to_dict())
        except client.ApiException as e:
            print("Exception when calling DAGApi->get_dag: %s\n" % e)


def get_dag_runs(request, dag_id=None):
    configuration = get_airflow_configuration()
    if dag_id:
        with client.ApiClient(configuration) as api_client:
            api_instance = dag_run_api.DAGRunApi(api_client)
            try:
                api_response = api_instance.get_dag_runs(
                    dag_id, limit=20, order_by="-start_date")
                return JsonResponse(api_response.to_dict())
            except client.ApiException as e:
                print("Exception when calling DAGRunApi->get_dag_run: %s\n" % e)
    else:
        with client.ApiClient(configuration) as api_client:
            api_instance = dag_run_api.DAGRunApi(api_client)
            list_dag_run_form = ListDagRunsForm(
                order_by="-start_date",
                page_limit=100
            )
            try:
                api_response = api_instance.get_dag_runs_batch(
                    list_dag_run_form)
                return JsonResponse(api_response.to_dict())
            except client.ApiException as e:
                print("Exception when calling DAGRunApi->get_dag_run: %s\n" % e)


def get_airflow_metrics(request):
    client = InfluxDBClient.from_config_file("config.ini")
    query_client = client.query_api()
    query = """
     from(bucket: "my-bucket")
        |> range(start: -24h, stop: now())
        |> filter(fn: (r) => r["_measurement"] == "prometheus_remote_write")
        |> filter(fn: (r) => r["airflow_id"] == "airflow")
        |> filter(fn: (r) => r["_field"] == "af_agg_dagrun_duration_failed_count" or r["_field"] == "af_agg_dagrun_duration_success_count")
        |> group(columns:["dag_id","_field"])
        |> increase()
        |> last(column: "_value")
        |> pivot(rowKey:["dag_id"], columnKey: ["_field"], valueColumn:"_value" )
        |> group()
        |> rename(columns: {af_agg_dagrun_duration_failed_count: "failed_count", af_agg_dagrun_duration_success_count: "success_count"})
    """
    tables = query_client.query(query)
    return HttpResponse(tables.to_json(), content_type="application/json")


def get_airflow_metrics_v2(request):
    client = InfluxDBClient.from_config_file("config.ini")
    query_client = client.query_api()
    query = """
     data = from(bucket: "my-bucket")
        |> range(start: -2d)
        |> filter(fn: (r) => r["_measurement"] == "prometheus_remote_write")
        |> filter(fn: (r) => r["_field"] == "airflow_dag_status")

    a = data
        |> group(columns: ["dag_id"])
        |> pivot(columnKey: ["status"], rowKey: ["_time","dag_id"], valueColumn: "_value")
        |> sort(columns: ["_time"])
        |> last(column: "_time")
        |> group()

    b = data
        |> group(columns: ["dag_id","status"])
        |> difference(nonNegative: true)
        |> filter(fn: (r) => r["_value"] > 0)
        |> group(columns: ["dag_id"])
        |> sort(columns: ["_time"])
        |> last(column: "_time")
        |> rename(columns: {status: "last_status", _time: "last_run"})
        |> group()

    join(tables: {a, b}, on: ["dag_id"])
    |> keep(columns: ["dag_id","success","failed","running","last_run","last_status"])
    """
    tables = query_client.query(query)
    return HttpResponse(tables.to_json(), content_type="application/json")


def get_task_instances_view(request,  dag_id=None, dag_run_id=None):
    t_now = datetime.now(tz=timezone.utc)
    td24h = timedelta(hours=24)
    t_start = t_now - td24h

    # af_config = get_airflow_configuration()
    # with client.ApiClient(af_config) as api_client:
    #     api_instance = task_instance_api.TaskInstanceApi(api_client)
    #     list_task_instance_form = ListTaskInstanceForm(
    #         dag_ids=[
    #             "CKAN_ETL"
    #         ],
    #         execution_date_gte='2019-08-24T14:15:22Z',
    #         execution_date_lte='2019-08-24T14:15:22Z',
    #     )
    #     try:
    #         api_response = api_instance.get_task_instances_batch(list_task_instance_form)
    #         pprint(api_response)
    #     except client.ApiException as e:
    #         print("Exception when calling TaskInstanceApi: %s\n" % e)

    # af_config = get_airflow_configuration()
    # with client.ApiClient(af_config) as api_client:
    #     api_instance = task_instance_api.TaskInstanceApi(api_client)
    #     try:
    #         api_response = api_instance.get_task_instances(dag_id, dag_run_id)
    #         pprint(api_response)
    #     except client.ApiException as e:
    #         print("Exception when calling TaskInstanceApi: %s\n" % e)

    # airflow-python-client is broken
    if dag_id and dag_run_id:
        url = f"{af_api_url}/dags/{dag_id}/dagRuns/{dag_run_id}/taskInstances"
        api_response = requests.get(url, auth=(username, password))
        return HttpResponse(api_response.content, content_type="application/json")
    else:
        url = f"{af_api_url}/dags/~/dagRuns/~/taskInstances/list"
        body = {
            "dag_ids": [
                "CKAN_ETL"
            ],
            "execution_date_gte": t_start.isoformat(),
            "execution_date_lte": t_now.isoformat(),
        }
        api_response = requests.post(url, json=body, auth=(username, password))
        return HttpResponse(api_response.content, content_type="application/json")


def get_task_instance_log_view(request, dag_id, dag_run_id, task_id, task_try_number):
    configuration = get_airflow_configuration()
    with client.ApiClient(configuration) as api_client:
        api_instance = task_instance_api.TaskInstanceApi(api_client)
        kwargs = {"full_content": True}
        try:
            api_response = api_instance.get_log(
                dag_id, dag_run_id, task_id, task_try_number, **kwargs)
            return JsonResponse(api_response.to_dict())

        except client.ApiException as e:
            print("Exception when calling TaskInstanceApi: %s\n" % e)


def get_dag_source_view(request, file_token):
    configuration = get_airflow_configuration()
    with client.ApiClient(configuration) as api_client:
        # Create an instance of the API class
        api_instance = dag_api.DAGApi(api_client)

        try:
            # Get basic information about a DAG
            api_response = api_instance.get_dag_source(file_token)
            return JsonResponse(api_response.to_dict())
            # pprint(api_response)
        except client.ApiException as e:
            print("Exception when calling DAGApi->get_dag: %s\n" % e)


def get_tasks_of_dag_view(request, dag_id):
    url = f"{af_api_url}/dags/{dag_id}/tasks"
    api_response = requests.get(url, auth=(username, password))
    return HttpResponse(api_response.content, content_type="application/json")


def get_dag_run_view(request, dag_id, dag_run_id):
    if request.method == "GET":
        configuration = get_airflow_configuration()
        with client.ApiClient(configuration) as api_client:
            api_instance = dag_run_api.DAGRunApi(api_client)
            dag_id = dag_id
            dag_run_id = dag_run_id

            try:
                api_response = api_instance.get_dag_run(dag_id, dag_run_id)
                return JsonResponse(api_response.to_dict(),
                                    json_dumps_params={"indent": 2})
            except client.ApiException as e:
                print("Exception when calling DAGRunApi->get_dag_run: %s\n" % e)
