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
from Utility import reportsdetails_utility as reportsdetails_util
import json


@csrf_exempt
def fetchreportsdetails(request):
    response = reportsdetails_util.fetchreportsdetails(request)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")
