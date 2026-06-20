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
    gettokens_exturl = request.GET["gettokens_exturl"];

    payload = {
                'grant_type': grant_type,
                'client_id': client_id,
                'client_secret': client_secret,
                'resource': resource
            }
    response = requests.request("GET", gettokens_exturl, data=payload)
    bearer = response.json()['access_token']
    return JsonResponse({'token': bearer})

@csrf_exempt
def listcostDetails(request):
    tenant_id = request.GET["tenant_id"];
    listcostDetails_exturl = request.GET["listcostDetails_exturl"];
    token = 'Bearer ' + request.GET["token"];

    payload = {}
    headers = {
        'Authorization': token
    }
    response = requests.request("GET", listcostDetails_exturl, headers=headers, data=payload)
    # print(response.text)
    return JsonResponse(response.json())

@csrf_exempt
def query_debugcostDetails(request):
    tenant_id = request.GET["tenant_id"];
    query_debugcostDetails_exturl = request.GET["query_debugcostDetails_exturl"];
    token = 'Bearer ' + request.GET["token"];

    payload = json.dumps({
      "lastUpdatedAfter": "2018-06-16T00:36:44.3345758Z",
      "lastUpdatedBefore": lastUpdatedBeforeDate
    })
    headers = {
        'Authorization': token
    }
    response = requests.request("post",query_debugcostDetails_exturl, headers=headers, data=payload)
    if response.status_code == 200:
        result = json.loads(response.content)
        # print(result)
    return JsonResponse(response.json())


@csrf_exempt
def query_costDetails(request):
    tenant_id = request.GET["tenant_id"];
    query_costDetails_exturl = request.GET["query_costDetails_exturl"];
    token = 'Bearer ' + request.GET["token"];

    payload = json.dumps({
        "lastUpdatedAfter": "2018-06-16T00:36:44.3345758Z",
        "lastUpdatedBefore": lastUpdatedBeforeDate
    })

    headers = {
        'Authorization': token
    }
    response = requests.request("POST", query_costDetails_exturl, headers=headers, data=payload)
    # print(response.text)
    return JsonResponse(response.json())