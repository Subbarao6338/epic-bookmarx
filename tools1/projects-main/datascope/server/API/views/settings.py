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
from Utility import settings_utility as settings_util
import json
import datetime


@csrf_exempt
def createsettings(request):
    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)['param']
    title = json_req['title']
    # check_settings_title
    # print(title)
    final_title = settings_util.check_settings_title(title)
    response = settings_util.create_settings(json_req, final_title)
    return HttpResponse(response)


@csrf_exempt
def getsettings(request):
    tenant_id = request.GET['tenant_id']
    print(tenant_id)
    response = settings_util.get_settings(tenant_id)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")


@csrf_exempt
def updatesettings(request):
    response = settings_util.update_settings(request)

    return HttpResponse(response)


@csrf_exempt
def deletesettings(request):
    id = request.GET['id']
    print(id)
    response = settings_util.delete_settings(id)
    return HttpResponse(response)

