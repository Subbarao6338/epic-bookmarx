"""
=============================================================================
COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
import re
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from Utility import resource_deployment, resource_destroy, autodeploy_utility
import os

cwdPath = os.path.abspath(os.getcwd())

@csrf_exempt
def deploy(request):
    page_type = request.GET.get('page_type')    
    if page_type != "kubernetes":
        autodeploy_utility.saveDeployedResources(request)
    if page_type == "kubernetes":
        autodeploy_utility.create_kubernetescluster(request)
        resource_deployment.resource_deploy(
            "kubernetes", request)
    elif page_type == "airflow":
        deploymentType = request.GET.get('deploymentType')
        if deploymentType == "App Service":
            resource_deployment.resource_deploy(
                "airflow", request)
        elif deploymentType == "Kubernetes Cluster":
            resource_deployment.component_deploy(request)
    elif page_type == "airbyte":
        deploymentType = request.GET.get('deploymentType')
        resource_deployment.component_deploy(request)
    return JsonResponse({'msg': "Succees"})


@csrf_exempt
def destroy(request):
    page_type = request.GET.get('page_type')
    if page_type != "kubernetes":
        autodeploy_utility.updateDeployedResourcesStatus(
            request, "", "Deleting")
    if page_type == "kubernetes":
        resource_destroy.resource_destroy(
            "kubernetes", request)
    elif page_type == "airflow":
        deploymentType = request.GET.get('deploymentType')
        if deploymentType == "App Service":
            resource_destroy.resource_destroy(
                "airflow", request)
        elif deploymentType == "Kubernetes Cluster":
            resource_destroy.component_destroy(request)
    elif page_type == "airbyte":
        deploymentType = request.GET.get('deploymentType')
        resource_destroy.component_destroy(request)
    return JsonResponse({'msg': "Success"})


@csrf_exempt
def deploylogs(request):
    with open(os.path.join(cwdPath, 'deploylogs.txt')) as f:
        logdetails = f.readlines()
    return JsonResponse({'msg': "Succees", "logs": logdetails})


@csrf_exempt
def getkubernetes_cluster(request):
    response = autodeploy_utility.getkubernetes_cluster()
    return HttpResponse(json.dumps(response['data']), content_type="application/json")


@csrf_exempt
def create_kubernetescluster(request):
    response = autodeploy_utility.create_kubernetescluster(request)
    return HttpResponse(response)


@csrf_exempt
def delete_kubernetescluster(request):
    resource_name = request.GET['resource_name']
    proj_id = request.GET["proj_id"]
    response = autodeploy_utility.delete_kubernetescluster(resource_name, proj_id)
    return HttpResponse(response)


@csrf_exempt
def getkubernetes_projectbased(request):
    response = autodeploy_utility.getkubernetes_projectbased(request)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")


@csrf_exempt
def getprovisionedresource_projectbased(request):
    response = autodeploy_utility.getprovisionedresource_projectbased(request)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")


@csrf_exempt
def is_kubernetes_cluster_exists(request):
    resource_name = request.GET.get('resource_name')
    # page_type = request.GET.get('page_type')
    # resource_id = request.GET.get('id')
    response = autodeploy_utility.iskubernetesclusterexists(resource_name)
    return HttpResponse(json.dumps(response["data"]))


@csrf_exempt
def get_project_name(request):
    response = autodeploy_utility.get_project_name(request)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")


@csrf_exempt
def get_project_resource(request):
    proj_id = request.GET["projid"]
    ret = autodeploy_utility.get_project_resource(proj_id)
    print(ret)
    return JsonResponse({"nodetype": ret})

@csrf_exempt
def getvalidationforclear(request):
    ret = autodeploy_utility.getvalidationforclear(request)
    return JsonResponse({"count": ret})