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
from asyncio import constants
import json
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
import subprocess
import os
from django.core.cache import cache

from api_services.config_api.models import MetricSource, PromConfig, ConfigString
from datetime import datetime

from influxdb_client import InfluxDBClient, Point, WritePrecision, Dialect
from influxdb_client.client.write_api import SYNCHRONOUS


# Create your views here.
def metric_source_config(request, id=None):
    if request.method == 'POST':
        json_body = json.loads(request.body.decode('utf-8'))
        # print(json_body)
        source_name = json_body['SourceName']
        default_config = json_body['DefaultConfig']
        instance = MetricSource.objects.create(
            source_name=source_name, default_config=default_config)
        return JsonResponse({"status": 'success'})

    if request.method == 'PUT':
        json_body = json.loads(request.body.decode('utf-8'))
        id = json_body['id']
        configured_value = json_body['configured_value']
        instance = MetricSource.objects.get(id=id)
        instance.configured_value = configured_value
        instance.save()
        return JsonResponse({"status": 'success'})

    if request.method == 'GET':
        if id:
            instance = MetricSource.objects.filter(id=id).values().first()
            return JsonResponse({"value": instance})
        # else
        instances = MetricSource.objects.all().values()
        return JsonResponse({"value_list": list(instances)})


def metric_exporter(request):
    print('hello world')
    subprocess.check_call(
        'docker run -d --mount type=bind, source=config/azure.yml,target=/etc/config/azure.yml robustperception/azure_metrics_exporter')
    return JsonResponse({"message": "hello world"})


def home_page(request):
    if request.method == 'GET':
        bucket = "my-bucket"
        client = InfluxDBClient.from_config_file("config.ini")

        write_api = client.write_api(write_options=SYNCHRONOUS)
        query_api = client.query_api()

        tables = query_api.query(
            'from(bucket:"my-bucket") |> range(start: -1m)')
        metrics = []

        for table in tables:
            # print(table)
            for row in table.records:
                metrics.append(row.values)
                # print (row.values)

        print(metrics[:10])

        client.close()
        return JsonResponse({"value": metrics[:100]})


def config_view(request, config_name=None):
    if request.method == 'GET':
        cache_key = 'prefix' + config_name
        obj = cache.get('prefix' + config_name)
        if not obj:
            obj = ConfigString.objects.filter(
                config_name=config_name).values().first()
            cache.set(cache_key, obj)
        return JsonResponse({'config': obj})

    if request.method == 'POST':
        config_name = request.POST['config_name']
        format = request.POST['format']
        value = request.POST['value']

        cache_key = "prefix" + config_name
        cache.delete(cache_key)

        obj = ConfigString.objects.update_or_create(
            config_name=config_name,
            defaults={"format": format, "value": value}
        )
        return JsonResponse({'message': 'success'})
