"""
=============================================================================
COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
import json

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
from datetime import datetime
my_date = datetime.now()
lastUpdatedBeforeDate = my_date.isoformat()

@csrf_exempt
def generate_token(request):
    tenant_id = request.GET["tenant_id"];
    grant_type = request.GET["grant_type"];
    client_id = request.GET["client_id"];
    client_secret = request.GET["client_secret"];
    resource = request.GET["resource"];
    gettoken_exturl = request.GET["gettoken_exturl"];

    payload = {
                'grant_type': grant_type,
                'client_id': client_id,
                'client_secret': client_secret,
                'resource': resource
            }
    response = requests.request("GET", gettoken_exturl, data=payload)
    bearer = response.json()['access_token']
    return JsonResponse({'token': bearer})

@csrf_exempt
def listdatapipeline(request):
    tenant_id = request.GET["tenant_id"];
    listpipeline_exturl = request.GET["listpipeline_exturl"];
    token = 'Bearer ' + request.GET["token"];

    payload = {}
    headers = {
        'Authorization': token
    }
    response = requests.request("GET", listpipeline_exturl, headers=headers, data=payload)
    print(response.text)
    return JsonResponse(response.json())


@csrf_exempt
def query_debugpipelines(request):
    tenant_id = request.GET["tenant_id"];
    query_debugpipelines_exturl = request.GET["query_debugpipelines_exturl"];
    token = 'Bearer ' + request.GET["token"];

    payload = json.dumps({
      "lastUpdatedAfter": "2018-06-16T00:36:44.3345758Z",
      "lastUpdatedBefore": lastUpdatedBeforeDate
    })
    headers = {
        'Authorization': token
    }
    response = requests.request("post",query_debugpipelines_exturl, headers=headers, data=payload)
    print(response.text)
    return JsonResponse(response.json())


@csrf_exempt
def query_pipelines(request):
    tenant_id = request.GET["tenant_id"];
    query_pipelines_exturl = request.GET["query_pipelines_exturl"];
    token = 'Bearer ' + request.GET["token"];

    payload = json.dumps({
        "lastUpdatedAfter": "2018-06-16T00:36:44.3345758Z",
        "lastUpdatedBefore": lastUpdatedBeforeDate
    })

    headers = {
        'Authorization': token
    }
    response = requests.request("POST", query_pipelines_exturl, headers=headers, data=payload)
    print(response.text)
    return JsonResponse(response.json())

