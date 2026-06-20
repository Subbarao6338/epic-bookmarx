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
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.core.cache import cache
import requests

from api_services.config_api.models import ConfigString
from .pipeline_util import *

# Create your views here.


def _get_grafana_config():
    cache_key = 'prefix'+'visualization'
    obj = cache.get(cache_key)

    if not obj:
        obj = ConfigString.objects.filter(
            config_name='visualization').values().first()
        cache.set(cache_key, obj)

    return json.loads(obj['value'])


def grafana_alert_rule(request, rule_folder=None, rule_group=None):

    config = _get_grafana_config()
    token = config['token']

    if request.method == 'GET':
        if not (rule_folder and rule_group):
            url = config['url'] + "/api/ruler/grafana/api/v1/rules"
            response = requests.get(
                url, headers={'Authorization': 'Bearer ' + token})
            return HttpResponse(response)

        url = config['url'] + "/api/ruler/grafana/api/v1/rules/{}/{}?subtype=cortex".format(
            rule_folder, rule_group)
        response = requests.get(
            url, headers={'Authorization': 'Bearer ' + token})
        return HttpResponse(response)

    if request.method == 'POST':
        if (rule_folder):
            url = config['url'] + \
                "/api/ruler/grafana/api/v1/rules/{}?subtype=cortex".format(
                    rule_folder)
            json_body = json.loads(request.body)
            response = requests.post(
                url,
                headers={'Authorization': 'Bearer ' + token},
                json=json_body
            )
            return HttpResponse(response)

    if request.method == 'DELETE':
        if (rule_folder):
            url = config['url'] + "/api/ruler/grafana/api/v1/rules/{}/{}?subtype=cortex".format(
                rule_folder, rule_group)
            response = requests.delete(
                url, headers={'Authorization': 'Bearer ' + token})
            return HttpResponse(response)


def grafana_contact_point(request):
    config = _get_grafana_config()
    url = config['url'] + "/api/alertmanager/grafana/config/api/v1/alerts"
    token = config['token']

    if request.method == 'GET':
        response = requests.get(
            url, headers={'Authorization': 'Bearer ' + token})
        return HttpResponse(response)

    if request.method == 'POST':
        json_body = json.loads(request.body)
        response = requests.post(
            url,
            headers={'Authorization': 'Bearer ' + token},
            json=json_body
        )
        return HttpResponse(response)


def grafana_alert_list(request):
    config = _get_grafana_config()
    url = config['url'] + "/api/prometheus/grafana/api/v1/rules"
    token = config['token']
    if request.method == 'GET':
        response = requests.get(
            url, headers={'Authorization': 'Bearer ' + token})
        return HttpResponse(response)


# HOME PAGE ALERT TABLE
def grafana_alert_list_home(request):
    config = _get_grafana_config()
    url = config['url'] + "/api/prometheus/grafana/api/v1/rules"
    token = config['token']
    if request.method == 'GET':
        response = requests.get(
            url, headers={'Authorization': 'Bearer ' + token})
        res = response.json()
        print(res)
        ret = []
        for group in res['data']['groups']:
            for rule in group["rules"]:
                for alert in rule["alerts"]:
                    temp = {}
                    temp["folder_name"] = group['file']
                    temp["group_name"] = group["name"]
                    temp["rule_name"] = rule["name"]
                    temp["last_evaluation"] = rule["lastEvaluation"]
                    temp["state"] = rule["state"]
                    temp["active_at"] = alert["activeAt"]
                    temp["duration"] = rule["duration"]
                    ret.append(temp)
        return JsonResponse({"data": ret})

# ALERT SUMMARY


def grafana_alert_summary(request):
    config = _get_grafana_config()
    url = config['url'] + "/api/ruler/grafana/api/v1/rules"
    token = config['token']
    if request.method == 'GET':
        response = requests.get(
            url, headers={'Authorization': 'Bearer ' + token})
        res = response.json()
        summary = []
        for folder in res:
            for group in res[folder]:
                for rule in group["rules"]:
                    temp = {}
                    temp["folder_name"] = folder
                    temp["group_name"] = group["name"]
                    temp["rule_name"] = rule["grafana_alert"]["title"]
                    rule_id = rule["grafana_alert"]["id"]
                    temp["rule_id"] = rule_id
                    temp["alert_count"] = 0
                    url_state_history = config['url'] + \
                        "/api/annotations?alertId=" + str(rule_id)
                    response_state_history = requests.get(url_state_history, headers={
                                                          'Authorization': 'Bearer ' + token})
                    res_state_history = response_state_history.json()
                    temp["state_history"] = res_state_history
                    summary.append(temp)

    return JsonResponse({"summary": summary})

# PIPELINE


def get_adf_pipeline_success(request):
    response_success, success_count = get_success_pipelines()
    return JsonResponse({"success_pipelines": response_success, "success_count": success_count})


def get_adf_pipeline_failure(request):
    response_failure, failure_count = get_failed_pipelines()
    return JsonResponse({"failed_pipelines": response_failure, "failure_count": failure_count})


def get_airflow_pipeline_success(request):
    response_success, success_count = get_success_pipelines()
    return JsonResponse({"success_pipelines": response_success, "success_count": success_count})


def get_airflow_pipeline_failure(request):
    response_failure, failure_count = get_failed_pipelines()
    return JsonResponse({"failed_pipelines": response_failure, "failure_count": failure_count})


def grafana_alert_datasource(request):
    config = _get_grafana_config()
    url = config['url'] + "/api/datasources"
    token = config['token']
    if request.method == 'GET':
        response = requests.get(
            url, headers={'Authorization': 'Bearer ' + token})
        return HttpResponse(response)
