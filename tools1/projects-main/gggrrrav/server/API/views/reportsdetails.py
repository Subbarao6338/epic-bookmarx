from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Utility import reportsdetails_utility as reportsdetails_util
import json


@csrf_exempt
def fetchreportsdetails(request):
    response = reportsdetails_util.fetchreportsdetails(request)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")
