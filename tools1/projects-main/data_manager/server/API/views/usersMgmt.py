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


@csrf_exempt
def get_project_details(request):
    ret = user_utils.get_project_details(request)
    return JsonResponse({"projectDetails": ret})


@csrf_exempt
def get_resources_provisioned_for_user(request):
    ret = user_utils.get_resource_provisioned(request)
    print("RETURN---->", ret)
    return JsonResponse({'resourceDetails': ret, 'kubernetesCluster': ret[0], 'deployedResources': ret[1]})