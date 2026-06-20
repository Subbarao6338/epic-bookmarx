import re
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Utility import resourcedynamic_utility as resource_util
import json


@csrf_exempt
def getresource(request):
    tenant_id = request.GET['tenant_id']
    response = resource_util.get_resource(tenant_id)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")


@csrf_exempt
def getresource_userbased(request):
    response = resource_util.getresource_userbased(request)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")

