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
from db_utils import db_suites as db_suite_utility

### PROJECT
def list_all_projects_view(request):
    project_list = db_project_utility.get_all_project_list()
    return JsonResponse({'projectlist': project_list})

def list_active_projects_view(request):
    project_list = db_project_utility.get_active_project_list()
    return JsonResponse({'projectlist': project_list})

def get_project_view(request):
    project_id = request.GET.get("project_id")
    project = db_project_utility.get_project(project_id)
    return JsonResponse({'project': project})

def create_project_view(request):
    create_project_data = json.loads(request.POST['create_project_data'])
    project_name = create_project_data['project_name']
    isactive = create_project_data['is_active']

    if(db_project_utility.check_duplicate_projectname(project_name)):
        return JsonResponse({'duplicate': True})
    else:
        db_project_utility.add_project(project_name, isactive)
        return JsonResponse({'duplicate': False, 'createproject':db_project_utility.get_all_project_list()})

def update_project_view(request):
    update_project_data = json.loads(request.POST['update_project_data'])
    project_id = update_project_data['project_id']
    project_name = update_project_data['project_name']
    isactive = update_project_data['is_active']
    if(db_project_utility.check_duplicate_projectname(project_name, project_id)):
        return JsonResponse({'duplicate': True})
    else:
        return JsonResponse({'updateproject':db_project_utility.update_project(project_id, project_name, isactive)})

def delete_project_view(request):
    project_id = request.GET.get("project_id")
    return JsonResponse({'deleteproject':db_project_utility.delete_project(project_id)})

### SUITE
def list_all_suites_view(request):
    suite_list = db_suite_utility.get_all_suite_list()
    return JsonResponse({'suitelist': suite_list})

def list_active_suites_view(request):
    suite_list = db_suite_utility.get_active_suite_list()
    return JsonResponse({'suitelist': suite_list})

def get_suite_view(request):
    suite_id = request.GET.get("suite_id")
    suite = db_suite_utility.get_suite(suite_id)
    return JsonResponse({'suite': suite})

def create_suite_view(request):
    create_suite_data = json.loads(request.POST['create_suite_data'])
    suite_name = create_suite_data['suite_name']
    isactive = create_suite_data['is_active']
    project_id = create_suite_data['project_id']

    if(db_suite_utility.check_duplicate_suitename(suite_name)):
        return JsonResponse({'duplicate': True})
    else:
        db_suite_utility.add_suite(suite_name, project_id, isactive)
        return JsonResponse({'duplicate': False, 'createsuite':db_suite_utility.get_all_suite_list()})

def update_suite_view(request):
    create_suite_data = json.loads(request.POST['update_suite_data'])
    suite_id = create_suite_data['suite_id']
    suite_name = create_suite_data['suite_name']
    isactive = create_suite_data['is_active']
    project_id = create_suite_data['project_id']
    if(db_suite_utility.check_duplicate_suitename(suite_name, suite_id)):
        return JsonResponse({'duplicate': True})
    else:
        return JsonResponse({'updatesuite':db_suite_utility.update_suite(suite_id, suite_name, project_id, isactive)})

def delete_suite_view(request):
    suite_id = request.GET.get("suite_id")
    return JsonResponse({'deletesuite':db_suite_utility.delete_suite(suite_id)})
