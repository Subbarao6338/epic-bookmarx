import time
import airflow_client.client as client
from airflow_client.client.api import dag_api, task_instance_api
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from airflow_client.client.api import dag_run_api
from pprint import pprint
from airflow_client.client.model.list_task_instance_form import ListTaskInstanceForm
from airflow_client.client.model.inline_response200 import InlineResponse200
# from airflow_client.client.api import dag_api
import json
from influxdb_client import InfluxDBClient, Point, WritePrecision, Dialect
from influxdb_client.client.write_api import SYNCHRONOUS
import configparser
from datetime import datetime, timedelta, timezone
import urllib.parse
import requests

parser = configparser.ConfigParser()
parser.read('config.ini')

api_url = parser.get('airflow', 'api_url')
username = parser.get('airflow', 'username')
password = parser.get('airflow', 'password')


# Create your views here.

def get_airflow_configuration():
    configuration = client.Configuration(
        host=api_url,
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


def get_dag_details(request, dag_id='CKAN_ETL'):
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


def get_dag_runs(request, dag_id='CKAN_ETL'):
    configuration = get_airflow_configuration()
    with client.ApiClient(configuration) as api_client:
        api_instance = dag_run_api.DAGRunApi(api_client)
        try:
            api_response = api_instance.get_dag_runs(dag_id)
            return JsonResponse(api_response.to_dict())
        except client.ApiException as e:
            print("Exception when calling DAGRunApi->get_dag_run: %s\n" % e)


def get_airflow_metrics(request):
    client = InfluxDBClient.from_config_file("config.ini")
    query_client = client.query_api()
    query = """
     from(bucket: "my-bucket")
        |> range(start: -100d, stop: now())
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


def get_task_instances_batch_view(request):
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

    # python client is broken
    url = api_url + "/dags/~/dagRuns/~/taskInstances/list"
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
