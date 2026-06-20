from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Utility import notifications_utility as notifications_util
import json


@csrf_exempt
def fetch_notifications(request):
    tenant_id = request.GET['tenant_id'],
    AccountMail = request.GET['AccountMail']
    response = notifications_util.fetch_notifications(tenant_id, AccountMail)
    # print(response['message'], response['data'])
    return HttpResponse(json.dumps(response['data']), content_type="application/json")
    # return HttpResponse(arr)#, content_type="application/json")


@csrf_exempt
def update_status(request):
    response = notifications_util.update_status(request)
    return HttpResponse(response)

@csrf_exempt
def add_notifications(request):
    response = notifications_util.add_notifications(request)
    return HttpResponse(response)

@csrf_exempt
def getRecentActivities(request):
    AccountMail = request.GET["AccountMail"]
    response = notifications_util.getRecentActivities(AccountMail)
    return JsonResponse(response)