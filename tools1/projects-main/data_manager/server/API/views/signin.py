
import re
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Utility import signin_utility as signin_util
import json


# @csrf_exempt
# def getusersdetails(request):
#     response = signin_util.get_usersdetails()
#     return HttpResponse(json.dumps(response['data']), content_type="application/json")


@csrf_exempt
def checkUserAuthorized(request):
    response = signin_util.checkUserAuthorized(request)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")


@csrf_exempt
def checkUserAuthorized1(request):
    response = signin_util.checkUserAuthorized1(request)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")


@csrf_exempt
def updatepassword(request):
    response = signin_util.updatepassword(request)
    return JsonResponse(json.loads(json.dumps(response)))
