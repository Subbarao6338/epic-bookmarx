
import re
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Utility import projects_utility as projects_util
import json


@csrf_exempt

def getprojectdetails(request):
    ret = projects_util.get_projectdetails()
    return JsonResponse({"projects": ret})


def getorganizationdetails(request):
    response = projects_util.get_organizationdetails()
    return HttpResponse(json.dumps(response['data']), content_type="application/json")

def createuser(request):
    response = projects_util.createuser(request)
    return HttpResponse(response)

def getuserdetails(request):
    tenant_id = request.GET['tenant_id']
    response = projects_util.get_userdetails(tenant_id)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")

def isuserexists(request):
    user_name = request.GET.get('user_name')
    user_mail = request.GET.get('user_mail')
    user_type = request.GET.get('user_type')
    user_id = request.GET.get('user_id')
    response = projects_util.isuserexists(user_name, user_mail,user_type, user_id) 
    print(json.dumps(response["data"]))
    return HttpResponse(json.dumps(response["data"]))


@csrf_exempt
def createprojects(request):
    response = projects_util.create_projects(request)
    return HttpResponse(response)


@csrf_exempt
def update_projects(request):
    response = projects_util.update_projects(request)
    return HttpResponse(response)


@csrf_exempt
def delete_projects(request):
    projectname = request.GET['projectname']
    response = projects_util.delete_projects(projectname)
    return HttpResponse(response)

def delete_users(request):
    user_mail = request.GET['user_mail']
    response = projects_util.delete_users(user_mail)
    return HttpResponse(response)

@csrf_exempt
def isprojectexists(request):
    project_name = request.GET.get('projectname')
    page_type = request.GET.get('page_type')
    project_id = request.GET.get('projid')
    response = projects_util.isprojectexists(project_name, page_type, project_id)
    return HttpResponse(json.dumps(response["data"]))

@csrf_exempt
def projects_config(request):
    response = projects_util.projects_config(request)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")

@csrf_exempt
def projects_nameslist(request):
    response = projects_util.projects_nameslist(request)
    return HttpResponse(json.dumps(response), content_type="application/json")

@csrf_exempt
def update_projects_config(request):
    response = projects_util.update_projects_config(request)
    return HttpResponse(json.dumps(response), content_type="application/json")

@csrf_exempt
def getprojects_userbased(request):
    response = projects_util.getprojects_userbased(request)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")

@csrf_exempt
def getresources_projectbased(request):
    response = projects_util.getresources_projectbased(request)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")
