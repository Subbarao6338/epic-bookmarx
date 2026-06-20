from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Utility import recentlyviewed_utility as recentlyviewed_util
import json
import datetime


# @csrf_exempt
# def fetch_recentlyviewed(request):
#     tenant_id = request.GET['tenant_id'],
#     AccountMail = request.GET['AccountMail']
#     response = recentlyviewed_util.fetch_recentlyviewed(tenant_id, AccountMail)
#     # print(response['message'], response['data'])
#     # return HttpResponse(json.dumps(response['data']), content_type="application/json")
#     # return HttpResponse(arr)#, content_type="application/json")


@csrf_exempt
def save_recentviewed(request):
    asset_type = request.POST.get("asset_type")
    data_url = request.POST.get("url")
    current_time = datetime.datetime.now()
    ret = recentlyviewed_util.create_recentlyviewed(asset_type, data_url, current_time)
    return JsonResponse({"data" : ret}, content_type="application/json")



@csrf_exempt
def getRecentViewed(request):
    # AccountMail = request.GET["AccountMail"]
    response = recentlyviewed_util.getRecentViewed()
    # return JsonResponse(response)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")


    




