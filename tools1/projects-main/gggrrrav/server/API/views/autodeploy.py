import re
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from Utility import resource_deployment,resource_destroy,autodeploy_utility

@csrf_exempt

def deploy(request):
    page_type = request.GET.get('page_type')

    if page_type != "kubernetes":
        autodeploy_utility.saveDeployedResources(request)

    if page_type == "kubernetes":
        resource_deployment.resource_deploy("terraform_template\kubernetes", request)
    elif page_type == "airflow":
        deploymentType = request.GET.get('deploymentType') 
        if deploymentType == "App Service":
            resource_deployment.resource_deploy("terraform_template\\airflow", request)
        elif deploymentType == "Kubernetes Cluster":
            resource_deployment.component_deploy(request)
    return JsonResponse({'msg': "Succees"})

@csrf_exempt
def destroy(request):
    page_type = request.GET.get('page_type')

    if page_type != "kubernetes":
        autodeploy_utility.updateDeployedResourcesStatus(request,"","Deleting")
    
    if page_type == "kubernetes":
        resource_destroy.resource_destroy("terraform_template\kubernetes", request)
    elif page_type == "airflow":
        deploymentType = request.GET.get('deploymentType') 
        if deploymentType == "App Service":
            resource_destroy.resource_destroy("terraform_template\\airflow", request)
        elif deploymentType == "Kubernetes Cluster":
            resource_destroy.component_destroy(request)
      
    return JsonResponse({'msg': "Succees"})

    
@csrf_exempt
def deploylogs(request):
    with open('deploylogs.txt') as f:
        logdetails = f.readlines()
    return JsonResponse({'msg': "Succees","logs":logdetails})


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
    response = autodeploy_utility.delete_kubernetescluster(resource_name)
    return HttpResponse(response)

@csrf_exempt
def getkubernetes_projectbased(request):
    response = autodeploy_utility.getkubernetes_projectbased(request)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")

@csrf_exempt
def getprovisionedresource_projectbased(request):
    response = autodeploy_utility.getprovisionedresource_projectbased(request)
    return HttpResponse(json.dumps(response['data']), content_type="application/json")