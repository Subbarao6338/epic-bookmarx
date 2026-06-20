from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Utility import dashboard_utility as dashboard_util
import json


@csrf_exempt
def dashboardcount(request):
    response = dashboard_util.dashboard_count(request)
    print(response)
    return JsonResponse(response)

