from enum import auto
from gc import collect
from http.client import HTTPResponse
from typing import Collection
from azure.purview.catalog import PurviewCatalogClient
from azure.purview.account import PurviewAccountClient
from azure.identity import  ClientSecretCredential
from azure.core.exceptions import HttpResponseError
from os import access
import re
import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import requests
import configparser
import os
from itertools import tee

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")
config_parser = configparser.ConfigParser()
print(os.path.join(config_path, "azurepurview.ini"))
config_parser.read(os.path.join(config_path, "azurepurview.ini"))   

########for query
@csrf_exempt
def purview_query(keyword, filter): 
    
    tenant_id = config_parser.get("service_principal", "tenant_id")
    client_id = config_parser.get("service_principal", "client_id")
    client_secret = config_parser.get("service_principal", "client_secret")
    end_point = config_parser.get("service_principal","endpoint")
    
    credential = ClientSecretCredential(tenant_id, client_id, client_secret)
    client = PurviewCatalogClient(endpoint="https://prathamcdppurview.purview.azure.com", credential=credential)

    response = client.discovery.query(search_request = {"keywords":keyword,  "filter": filter })

    print("KEY", keyword)
    print(response)
    
    return response['value']
#######
#######for collections api
def generate_token():
    tenant_id = config_parser.get("service_principal", "tenant_id")
    client_id = config_parser.get("service_principal", "client_id")
    client_secret = config_parser.get("service_principal", "client_secret")
    grant_type = "client_credentials"
    resource = 'https://purview.azure.net/'
    gettokens_exturl = 'https://login.microsoftonline.com/' + tenant_id + '/oauth2/token'
    payload = {
                'grant_type': grant_type,
                'client_id': client_id,
                'client_secret': client_secret,
                'resource': resource
            }
    response = requests.request("GET", gettokens_exturl, data=payload)
    print("token----->",response.json())
    bearer = response.json()['access_token']
    return bearer



def purview_collection(): 
    token = generate_token()
    #keyword = request.POST.get("keyword")
    end_point = config_parser.get("service_principal","endpoint")
    print(end_point)
    url = end_point + "/collections?api-version=2019-11-01-preview"
    token = 'Bearer ' + token

    payload = {}
    headers = {
        'Authorization': token
    }
    response = requests.request("GET", url, headers=headers, data=payload)
    print(response.json())
    #return JsonResponse(response.json())
    return response.json()["value"]








#########

def purview_auto_complete(keyword):
    tenant_id = config_parser.get("service_principal", "tenant_id")
    client_id = config_parser.get("service_principal", "client_id")
    client_secret = config_parser.get("service_principal", "client_secret")
    end_point = config_parser.get("service_principal","endpoint") 
    
    credential = ClientSecretCredential(tenant_id, client_id, client_secret)
    client = PurviewCatalogClient(endpoint="https://prathamcdppurview.purview.azure.com", credential=credential)

    response = client.discovery.auto_complete(auto_complete_request = {"keywords":keyword})
    print("AUTOCOMPLETE---->>>",keyword, response)
    return response['value']


def purview_suggest(keyword):
    #print(request.POST)
    tenant_id = config_parser.get("service_principal", "tenant_id")
    client_id = config_parser.get("service_principal", "client_id")
    client_secret = config_parser.get("service_principal", "client_secret")
    end_point = config_parser.get("service_principal","endpoint")
    
    credential = ClientSecretCredential(tenant_id, client_id, client_secret)
    client = PurviewCatalogClient(endpoint="https://prathamcdppurview.purview.azure.com", credential=credential)

    response = client.discovery.suggest(suggest_request = {"keywords":keyword})
    print("KEY", keyword)
    print(response)
    return response['value']

@csrf_exempt
def get_search_result(request):
    keyword = request.GET["keyword"]
    auto_complete = purview_auto_complete(keyword)
    suggest = purview_suggest(keyword)
    # query = purview_query(keyword)

    if len(auto_complete)<=4 :
        auto_complete_temp = auto_complete
    else:
        auto_complete_temp = auto_complete[:4]

    if len(suggest)<=4 :
        suggest_temp = suggest
    else:
        suggest_temp = suggest[:4]

   
    final_result = []
    for item in auto_complete_temp:
        temp = {}
        temp['DisplayText'] = item['text']
        temp['DisplayValue'] = item['queryPlusText']
        temp['Category'] = "Auto Complete API"
        final_result.append(temp)
    
    for item in suggest_temp:
        temp = {}
        temp['DisplayText'] = item['qualifiedName']
        temp['DisplayValue'] = item['name']
        temp['Category'] = "Suggest API"
        final_result.append(temp)
    return JsonResponse({'data': final_result})


def get_display_icon(obj_type):
    obj_type = json.loads(json.dumps(obj_type))[0]
    display_icon = "AzureDatafactory.png"
    with open("config/object.json") as json_object_list:
        json_list = json.load(json_object_list)
    for item in json_list['asset_type']:
        print(item)
        json_obj = json.loads(json.dumps(item))
        if json_obj["assetType"] == obj_type:
            display_icon = json_obj["asset_icon"]
            break
    return display_icon

    
@csrf_exempt
def get_full_search_result(request):
    keyword = request.GET["keyword"]
    filter = request.GET["filter"]
    print(filter)
    my_filter_arr = json.loads(filter)['filter_data']
    temp_ls = []
    for object_type in my_filter_arr:
        temp = {}
        temp["objectType"] = object_type
        temp_ls.append(temp)
    my_final_filter = {"or":temp_ls}
    query = purview_query(keyword, my_final_filter)
    collection_name= purview_collection()
    
    print("Pavithran :>>")
    print("Pavithran :>>",len(query))
    final_result = []
    required_keys = {'name', 'qualifiedName','entityType','assetType','objectType'}
    for item in query:
        # print("ITEM--->",item)
        print("Pavithran :>>",item)
        if required_keys <= set(item):
            temp = {}
            temp['DisplayText'] = item['name']
            temp['DisplayText1'] = item['qualifiedName']
            temp['DisplayValue'] = item['entityType']
            temp['DisplayText2'] = item['assetType']
            temp['DisplayText3'] = item['objectType']
            
            temp['Category'] = "Query API"
            temp["display_icon"] = get_display_icon(item['assetType'])
            temp["id"]=item["id"]
            final_result.append(temp)

    return JsonResponse({'data': final_result, "collection":collection_name})
