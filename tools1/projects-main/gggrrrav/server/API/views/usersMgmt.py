import re
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Utility import usermgmt_utility as user_utils
import json

@csrf_exempt
def getusers(request):
    ret = user_utils.get_users()
    return JsonResponse({"users": ret})