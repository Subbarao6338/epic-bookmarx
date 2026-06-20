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
import re
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Utility import organization_utility as organization_util
import json


@csrf_exempt
def getorganizationdetails(request):
    response = organization_util.get_getorganizationdetails()
    return HttpResponse(json.dumps(response['data']), content_type="application/json")

@csrf_exempt
def createorganization(request):
    response = organization_util.create_organization(request)
    return HttpResponse(response)

@csrf_exempt
def delete_organization(request):
    id = request.GET['id']
    response = organization_util.delete_organization(id)
    return HttpResponse(response)

@csrf_exempt
def update_organization(request):
    #name = request.GET['name']
    response = organization_util.update_organization(request)
    return HttpResponse(response)

@csrf_exempt
def isorganizationexists(request):
    org_name = request.GET.get('name')
    page_type = request.GET.get('page_type')
    org_id = request.GET.get('id')
    response = organization_util.isorganizationexists(org_name, page_type, org_id)
    return HttpResponse(json.dumps(response["data"]))