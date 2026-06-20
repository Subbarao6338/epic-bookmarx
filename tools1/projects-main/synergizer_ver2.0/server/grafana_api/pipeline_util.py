import configparser
import json
import os
import requests
import datetime

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")
config_parser = configparser.ConfigParser()
config_parser.read(os.path.join(config_path, "azure_details.ini"))

tenant_id = config_parser.get("azure_details", "tenant_id")
client_id = config_parser.get("azure_details", "client_id")
client_secret = config_parser.get("azure_details", "client_secret")
grant_type = config_parser.get("azure_details", "grant_type")
resource = config_parser.get("azure_details", "resource")
subscription_id = config_parser.get("azure_details", "subscription_id")
resource_group = config_parser.get("azure_details", "resource_group")
factory_name = config_parser.get("azure_details", "factory_name")

def get_access_token():
    gettokens_exturl = "https://login.microsoftonline.com/" + tenant_id + "/oauth2/token"

    payload = {
                'grant_type': grant_type,
                'client_id': client_id,
                'client_secret': client_secret,
                'resource': resource
            }
    response = requests.request("GET", gettokens_exturl, data=payload)
    bearer = response.json()['access_token']
    return bearer


def get_success_pipelines():
    bearer = get_access_token()
    external_url = "https://management.azure.com/subscriptions/" + subscription_id + "/resourceGroups/" + resource_group + "/providers/Microsoft.DataFactory/factories/" + factory_name + "/pipelines?api-version=2018-06-01"
    token = 'Bearer ' + bearer
    payload = {}
    headers = {
        'Authorization': token
    }
    response = requests.request("GET", external_url,headers=headers, data=payload)
    pipelines = response.json()["value"]
    
    name_ls = []
    for pipeline in pipelines:
        name = pipeline['name']
        name_ls.append(name)

    url_runs = "https://management.azure.com/subscriptions/" + subscription_id + "/resourceGroups/" + resource_group + "/providers/Microsoft.DataFactory/factories/" + factory_name + "/queryPipelineRuns?api-version=2018-06-01"
    time_now = datetime.datetime.now()
    last_24_hrs = datetime.datetime.now() - datetime.timedelta(hours = 24)
    final_response = []
    total_success_count = 0
    for pipeline in pipelines:
        json_body = {
            "lastUpdatedAfter": last_24_hrs.strftime("%m/%d/%Y, %H:%M:%S"),
            # "lastUpdatedAfter": "2022-05-01T00:00:40.3345758Z",
            "lastUpdatedBefore": time_now.strftime("%m/%d/%Y, %H:%M:%S"),
            "filters": [
                {
                "operand": "PipelineName",
                "operator": "Equals",
                "values": [pipeline["name"]],
                }
            ]
        }
        try:
            response_runs = requests.request("POST", url_runs ,headers=headers, data=payload, json=json_body)
            pipelines_runs = response_runs.json()["value"]
            pipelines_runs = [run for run in pipelines_runs if run["status"]=="Succeeded"]
            temp = {}
            temp["name"] = pipeline["name"]
            # temp["last_success_run"] = pipelines_runs[-1]["lastUpdated"]
            # temp["run_duration"] = str(pipelines_runs[-1]["durationInMs"] / 1000)
            temp["success_count"] = len(pipelines_runs)
            total_success_count = total_success_count + len(pipelines_runs)
        except:
            temp = {}
            temp["name"] = pipeline["name"]
            # temp["last_success_run"] = "--"
            # temp["run_duration"] = "--"
            temp["success_count"] = 0
        final_response.append(temp)
    
    return final_response, total_success_count


def get_failed_pipelines():
    bearer = get_access_token()
    external_url = "https://management.azure.com/subscriptions/" + subscription_id + "/resourceGroups/" + resource_group + "/providers/Microsoft.DataFactory/factories/" + factory_name + "/pipelines?api-version=2018-06-01"
    token = 'Bearer ' + bearer
    payload = {}
    headers = {
        'Authorization': token
    }
    response = requests.request("GET", external_url,headers=headers, data=payload)
    pipelines = response.json()["value"]
    
    name_ls = []
    for pipeline in pipelines:
        name = pipeline['name']
        name_ls.append(name)

    url_runs = "https://management.azure.com/subscriptions/" + subscription_id + "/resourceGroups/" + resource_group + "/providers/Microsoft.DataFactory/factories/" + factory_name + "/queryPipelineRuns?api-version=2018-06-01"
    time_now = datetime.datetime.now()
    last_24_hrs = datetime.datetime.now() - datetime.timedelta(hours = 24)
    final_response = []
    total_failure_count = 0
    for pipeline in pipelines:
        json_body = {
            "lastUpdatedAfter": last_24_hrs.strftime("%m/%d/%Y, %H:%M:%S"),
            # "lastUpdatedAfter": "2022-05-01T00:00:40.3345758Z",
            "lastUpdatedBefore": time_now.strftime("%m/%d/%Y, %H:%M:%S"),
            "filters": [
                {
                "operand": "PipelineName",
                "operator": "Equals",
                "values": [pipeline["name"]],
                }
            ]
        }
        try:
            response_runs = requests.request("POST", url_runs ,headers=headers, data=payload, json=json_body)
            pipelines_runs = response_runs.json()["value"]
            pipelines_runs = [run for run in pipelines_runs if run["status"]=="Failed"]
            temp = {}
            temp["name"] = pipeline["name"]
            # temp["last_updated"] = pipelines_runs[-1]["lastUpdated"]
            # temp["run_duration"] = str(pipelines_runs[-1]["durationInMs"] / 1000)
            temp["failure_count"] = len(pipelines_runs)
            total_failure_count = total_failure_count + len(pipelines_runs)
        except:
            temp = {}
            temp["name"] = pipeline["name"]
            # temp["last_updated"] = "--"
            # temp["run_duration"] = "--"
            temp["failure_count"] = 0
        final_response.append(temp)
    
    return final_response, total_failure_count