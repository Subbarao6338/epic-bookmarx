import re
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
def deleteprojectresource(request):
    id = request.GET['id']
    response = addresource_util.delete_projectresource(id)
    return HttpResponse(response)



@csrf_exempt
def deleteallprojectresource(self):
    response = addresource_util.delete_allprojectresource(self)
    return HttpResponse(response)

