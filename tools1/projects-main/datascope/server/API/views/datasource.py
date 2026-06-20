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
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Utility import datasource_utility as datasource_util
import json


@csrf_exempt
def createdatasource(request):
    response = datasource_util.create_datasource(request)
    return HttpResponse(response)


@csrf_exempt
def get_datasource(request):
    tenant_id = request.GET['tenant_id']
    response = datasource_util.get_datasource(tenant_id)
    # print(response['message'], response['data'])
    return HttpResponse(json.dumps(response['data']), content_type="application/json")
    # return HttpResponse(arr)#, content_type="application/json")

@csrf_exempt
def update_datasource(request):
    response = datasource_util.update_datasource(request)
    return HttpResponse(response)


@csrf_exempt
def delete_datasource(request):
    id = request.GET['id']
    response = datasource_util.delete_datasource(id)
    return HttpResponse(response)
