import re
from urllib import response
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Utility import addresource_utility as addresource_util
import json


@csrf_exempt
def createprojectresource(request):
    response = addresource_util.create_projectresource(request)
    return HttpResponse(response)


@csrf_exempt
def getprojectresource(request):
    tenant_id = request.GET['tenant_id']
    response = addresource_util.get_projectresource(tenant_id)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")

@csrf_exempt
def getconfiguredresources(request):
    project_id = request.GET['projid']
    response = addresource_util.get_configured_resources(project_id)
    # return HttpResponse(json.dumps(response['data']), content_type="application/json")
    return JsonResponse(response)


@csrf_exempt
def deleteprojectresource(request):
    id = request.GET['id']
    response = addresource_util.delete_projectresource(id)
    return HttpResponse(response)

@csrf_exempt
def update_projectresource(request):
    response = addresource_util.update_projectresource(request)
    return HttpResponse(response)


@csrf_exempt
def deleteallprojectresource(self):
    response = addresource_util.delete_allprojectresource(self)
    return HttpResponse(response)

@csrf_exempt
def deleteselectedconfigresource(request):    
    response = addresource_util.delete_selected_configurations(request)
    return HttpResponse(response)
