from datetime import datetime
import uuid
from django.shortcuts import render
from xmlrpc.client import ResponseError
from pydantic import Json
from db_utils.db_connection import execute_get_query
import json
from django.http.response import JsonResponse
from ruamel import yaml

from db_utils import db_projects as db_project_utility

### PROJECT
def list_all_projects_view(request):
    project_list = db_project_utility.get_all_project_list()
    return JsonResponse({'projectlist': project_list})

def list_active_projects_view(request):
    project_list = db_project_utility.get_active_project_list()
    return JsonResponse({'projectlist': project_list})

def get_project_view(request):
    project_id = request.GET.get("project_id")
    print("Project id" + project_id)
    project = db_project_utility.get_project(project_id)
    return JsonResponse({'project': project})

def create_project_view(request):
    create_project_data = json.loads(request.POST['create_project_data'])
    project_name = create_project_data['project_name']
    isactive = create_project_data['is_active']

    if(db_project_utility.check_duplicate_projectname(project_name)):
        return JsonResponse({'duplicate': True})
    else:
        return JsonResponse({'duplicate': False, 'createproject':db_project_utility.add_project(project_name, isactive)})

def update_project_view(request):
    create_project_data = json.loads(request.POST['update_project_data'])
    project_id = create_project_data['project_id']
    project_name = create_project_data['project_name']
    isactive = create_project_data['is_active']
    if(db_project_utility.check_duplicate_projectname(project_name, project_id)):
        return JsonResponse({'duplicate': True})
    else:
        return JsonResponse({'updateproject':db_project_utility.update_project(project_id, project_name, isactive)})

def delete_project_view(request, project_id):
    print("delete project")
    print(project_id)
    #return JsonResponse({'deleteproject':db_project_utility.delete_project(project_id)})
    return JsonResponse({'deleteproject:success'})
