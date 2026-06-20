import json
import math
from unittest import result
import locale
import pandas as pd
import numpy as np
from django.http import HttpResponse, JsonResponse
from babel.numbers import format_currency
from django.views.decorators.csrf import csrf_exempt
import requests
from datetime import date, datetime, timedelta
import configparser
import os
cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")
config_parser = configparser.ConfigParser()
print(os.path.join(config_path, "azure_cred.ini"))
config_parser.read(os.path.join(config_path, "azure_cred.ini"))
my_date = datetime.now()
lastUpdatedBeforeDate = my_date.isoformat()
Tenant_ID = "189de737-c93a-4f5a-8b68-6f4ca9941912"
Client_ID = "7c38f76b-c45e-4a9a-81b8-d8c57cccb5ad"
Secret_ID = "eEe7Q~Mtew.CQ0njKkYTJNjO3URb5DJiWegUq"
Subscription_ID = "cdd13030-77e0-41a5-b0d9-558c7e10551c"
Grant_Type = "client_credentials"
Resource = "https://management.azure.com/"
### For Generating the Token
@csrf_exempt
def generate_token():
    gettokens_exturl = "https://login.microsoftonline.com/" + Tenant_ID + "/oauth2/token"
    payload = {
         'grant_type': Grant_Type,
         'client_id': Client_ID,
         'client_secret': Secret_ID,
         'resource': Resource
     }
    response = requests.request("GET", gettokens_exturl, data=payload)
    bearer = response.json()['access_token']
    return bearer
### For Get the Daily Cost (Actual Cost) - Start
@csrf_exempt
def listDateWiseCostDetails(requestBody):
    FromDate = requestBody.GET['FromDate']
    ToDate = requestBody.GET['ToDate']
    Accumulated_exturl = "https://management.azure.com/subscriptions/" + Subscription_ID + "/providers/Microsoft.CostManagement/query?api-version=2021-10-01&$top=5000"
    token = 'Bearer ' + generate_token()
    payload = json.dumps({
        "type": "ActualCost",
        "dataSet": {
            "granularity": "Daily",
            "aggregation": {
                "totalCost": {
                    "name": "Cost",
                    "function": "Sum"
                },
                "totalCostUSD": {
                    "name": "CostUSD",
                    "function": "Sum"
                }
            },
            "sorting": [{
                "direction": "ascending",
                "name": "UsageDate"
            }]
        },
        "timeframe": "Custom",
        "timePeriod": {
            "from": FromDate,
            "to": ToDate
        }
    })
    headers = {'Authorization': token, 'Content-Type': "application/json"}
    response = requests.request("POST",
                                Accumulated_exturl,
                                headers=headers,
                                data=payload)
    data_json = {}
    if response.status_code == 200:                  
        result = response.json()
        cost_results = result['properties']['rows']
        data_arr = []
        for i in range(len(cost_results)):
            temp = {}
            #temp['daily_cost'] = cost_results[i][0]
            temp['daily_cost'] = format_currency(round(cost_results[i][0],2), 'INR', locale='en_IN')
            temp['cost_date'] = str(cost_results[i][2])[0:4]+"-"+str(cost_results[i][2])[4:6]+"-"+str(cost_results[i][2])[6:8]
            data_arr.append(temp)
        data_json['data'] = data_arr
        data_json['msg'] = "Success"
        return JsonResponse(data_json)
    else:
        data_json['data'] = response.status_code
        data_json['msg'] = "Failure"
        return JsonResponse(data_json)
### For Get the Daily Cost (Actual Cost) - End
### For Get the Forecast Cost - Start
def getForecastCost(FromDate,ToDate):
    forcast_exturl = "https://management.azure.com/subscriptions/" + Subscription_ID + "/providers/Microsoft.CostManagement/forecast?api-version=2021-10-01&$top=5000"
    token = 'Bearer ' + generate_token()
    payload = json.dumps({
        "type": "ActualCost",
        "dataSet": {
            "granularity": "Daily",
            "aggregation": {
                "totalCost": {
                    "name": "Cost",
                    "function": "Sum"
                }
            },
            "sorting": [{
                "direction": "ascending",
                "name": "UsageDate"
            }]
        },
        "timeframe": "Custom",
        "timePeriod": {
            "from": FromDate,
            "to": ToDate
        },
        "includeActualCost": False,
        "includeFreshPartialCost": False
    })
    headers = {'Authorization': token, 'Content-Type': "application/json"}
    response = requests.request("POST",
                                forcast_exturl,
                                headers=headers,
                                data=payload)
    data_json = {}
    if response.status_code == 200: 
        data_json['msg'] ="Success"
        data_json['data'] =response.json()
        #result = response.json()
        return data_json
    else:
        data_json['msg'] ="Failure"
        data_json['data'] =response.status_code
        return data_json
### For Get the Forecast Cost - End
### For Get the Accumulated Cost - Start
def getAccumulatedCost(FromDate,ToDate):
    Accumulated_exturl = "https://management.azure.com/subscriptions/" + Subscription_ID + "/providers/Microsoft.CostManagement/query?api-version=2021-10-01&$top=5000"
    token = 'Bearer ' + generate_token()
    payload = json.dumps({
        "type": "ActualCost",
        "dataSet": {
            "granularity": "Daily",
            "aggregation": {
                "totalCost": {
                    "name": "Cost",
                    "function": "Sum"
                },
                "totalCostUSD": {
                    "name": "CostUSD",
                    "function": "Sum"
                }
            },
            "sorting": [{
                "direction": "ascending",
                "name": "UsageDate"
            }]
        },
        "timeframe": "Custom",
        "timePeriod": {
            "from": FromDate,
            "to": ToDate
        }
    })
    headers = {'Authorization': token, 'Content-Type': "application/json"}
    response = requests.request("POST",
                                Accumulated_exturl,
                                headers=headers,
                                data=payload) 
    data_json = {}
    if response.status_code == 200: 
        data_json['msg'] ="Success"
        data_json['data'] =response.json()
        #result = response.json()
        return data_json
    else:
        data_json['msg'] ="Failure"
        data_json['data'] =response.status_code
        return data_json
### For Get the Accumulated Cost - End
### For Get the Monthly Budget - Start
def getMonthlyBudget():
    MonthlyBudget_exturl = "https://management.azure.com/subscriptions/" + Subscription_ID + "/providers/Microsoft.CostManagement/budgets?api-version=2021-10-01&$expand=none"
    token = 'Bearer ' + generate_token()
    payload = {}
    headers = {'Authorization': token, 'Content-Type': "application/json"}
    response = requests.request("GET",
                                MonthlyBudget_exturl,
                                headers=headers,
                                data=payload)
    data_json = {}
    if response.status_code == 200: 
        data_json['msg'] ="Success"
        data_json['data'] =response.json()
        #result = response.json()
        return data_json
    else:
        data_json['msg'] ="Failure"
        data_json['data'] =response.status_code
        return data_json
### For Get the Accumulated Cost - End
### For Get the Area Chart Data - Start
def daterange(start_date, end_date):
    for n in range(int ((end_date+timedelta(1) - start_date).days)):
        yield start_date + timedelta(n)
@csrf_exempt
def getAreaChartData(requestBody):
    FromDate = requestBody.GET['FromDate']
    ToDate = requestBody.GET['ToDate']
    print("FromDate :>>",FromDate)
    print("ToDate :>>",ToDate)
    accumulatedCost = getAccumulatedCost(FromDate,ToDate)
    forecastCost = getForecastCost(FromDate,ToDate)
    monthlyBudget = getMonthlyBudget()
    accumulatedCost_resultsJSON = {}
    forecastCost_resultsJSON = {}
    finalAccumulatedCost = 0
    if accumulatedCost['msg'] == "Success":
        ## Accumulated Cost Calculations
        _accumulatedCost = accumulatedCost['data']
        accumulatedCost_results = _accumulatedCost['properties']['rows']
        for i in range(len(accumulatedCost_results)):
            finalAccumulatedCost += accumulatedCost_results[i][0]
            accumulatedCost_resultsJSON[str(accumulatedCost_results[i][2])] = finalAccumulatedCost
    if accumulatedCost['msg'] == "Success" and forecastCost['msg'] == "Success":
        ## ForeCast Cost Calculations
        finalForeCastCost = finalAccumulatedCost
        _forecastCost = forecastCost['data']
        forecastCost_results = _forecastCost['properties']['rows']
        for j in range(len(forecastCost_results)):
            finalForeCastCost += forecastCost_results[j][0]
            forecastCost_resultsJSON[str(forecastCost_results[j][1])] = finalForeCastCost
    mb_res_leng = 0
    if monthlyBudget['msg'] == "Success":
        _monthlyBudget = monthlyBudget['data']
        mb_res_leng = len(_monthlyBudget['value'])
    fromdate = pd.to_datetime(FromDate,utc=True)
    todate = pd.to_datetime(ToDate,utc=True)
    data_json = {}
    data_arr = []
    for single_date in daterange(fromdate, todate):
        chart_date = single_date.strftime("%Y%m%d")
        #print(0 if accumulatedCost_resultsJSON.get(chart_date) is None else accumulatedCost_resultsJSON.get(chart_date) )
        temp = {}
        temp['date'] = single_date.strftime("%Y-%m-%d")
        #temp['Accumulated cost'] = "{:.2f}".format(0) if accumulatedCost_resultsJSON.get(chart_date) is None else "{:.2f}".format(accumulatedCost_resultsJSON.get(chart_date)) 
        if accumulatedCost['msg'] == "Success":
            temp['Accumulated cost'] = "--" if accumulatedCost_resultsJSON.get(chart_date) is None else "{:.2f}".format(accumulatedCost_resultsJSON.get(chart_date)) 
        else:
            temp['Accumulated cost'] = "No Data"
        if forecastCost['msg'] == "Success":
            temp['Forecast cost'] = "--" if forecastCost_resultsJSON.get(chart_date) is None else "{:.2f}".format(forecastCost_resultsJSON.get(chart_date))
        else:
            temp['Forecast cost'] = "No Data"
        if monthlyBudget['msg'] == "Success":
            temp['Monthly budget'] = "No Data" if mb_res_leng == 0 else "{:.2f}".format(100000)
        else:
            temp['Monthly budget'] = "No Data"
        data_arr.append(temp)
    data_json['data'] = data_arr
    return JsonResponse(data_json)
### For Get the Area Chart Data - End
### For Get the Donut Chart Data [Service Name]- Start
@csrf_exempt
def getDonutChart_Service(requestBody):
    FromDate = requestBody.GET['FromDate']
    ToDate = requestBody.GET['ToDate']
    Consumed_services_exturl = "https://management.azure.com/subscriptions/" + Subscription_ID + "/providers/Microsoft.CostManagement/query?api-version=2021-10-01&$top=5000"
    token = 'Bearer ' + generate_token()
    payload = json.dumps({
        "type": "ActualCost",
        "dataSet": {
            "granularity": "None",
            "aggregation": {
                "totalCost": {
                    "name": "Cost",
                    "function": "Sum"
                },
                "totalCostUSD": {
                    "name": "CostUSD",
                    "function": "Sum"
                }
            },
            "grouping": [{
                "type": "Dimension",
                "name": "ServiceName"
            }],
            "sorting": [{
                "direction": "descending",
                "name": "Cost"
            }]
        },
        "timeframe": "Custom",
        "timePeriod": {
            "from": FromDate,
            "to": ToDate
        }
    })
    headers = {'Authorization': token, 'Content-Type': "application/json"}
    response = requests.request("POST",
                                Consumed_services_exturl,
                                headers=headers,
                                data=payload) 
    data_json = {}
    if response.status_code == 200: 
        result = response.json()
        service_cost = result['properties']['rows']
        data_service = []
        data_service_cost = []
        for i in range(len(service_cost)):
            data_service.append("No service name" if  service_cost[i][2] is "" else service_cost[i][2] )
            data_service_cost.append(round(service_cost[i][0],2))
        data_json['servicename'] = data_service
        data_json['servicecost'] = data_service_cost
        data_json['msg'] = "Success"
        return JsonResponse(data_json)
    else:
        data_json['data'] = response.status_code
        data_json['msg'] = "Failure"
        return JsonResponse(data_json)
### For Get the Donut Chart Data [Service Name]- End
### For Get the Donut Chart Data [Location]- Start
@csrf_exempt
def getDonutChart_Location(requestBody):
    FromDate = requestBody.GET['FromDate']
    ToDate = requestBody.GET['ToDate']
    resource_location_exturl = "https://management.azure.com/subscriptions/" + Subscription_ID + "/providers/Microsoft.CostManagement/query?api-version=2021-10-01&$top=5000"
    token = 'Bearer ' + generate_token()
    payload = json.dumps({
        "type": "ActualCost",
        "dataSet": {
            "granularity": "None",
            "aggregation": {
                "totalCost": {
                    "name": "Cost",
                    "function": "Sum"
                },
                "totalCostUSD": {
                    "name": "CostUSD",
                    "function": "Sum"
                }
            },
            "grouping": [{
                "type": "Dimension",
                "name": "ResourceLocation"
            }],
            "sorting": [{
                "direction": "descending",
                "name": "Cost"
            }]
        },
        "timeframe": "Custom",
        "timePeriod": {
            "from": FromDate,
            "to": ToDate
        }
    })
    headers = {'Authorization': token, 'Content-Type': "application/json"}
    response = requests.request("POST",
                                resource_location_exturl,
                                headers=headers,
                                data=payload)
    data_json = {}
    if response.status_code == 200: 
        result = response.json()
        location_cost = result['properties']['rows']
        data_json = {}
        data_location = []
        data_location_cost = []
        for i in range(len(location_cost)):
            data_location.append("No location" if  location_cost[i][2] is "" else location_cost[i][2] )
            data_location_cost.append(round(location_cost[i][0],2))
        data_json['location'] = data_location
        data_json['locationcost'] = data_location_cost
        data_json['msg'] = "Success"
        return JsonResponse(data_json)
    else:
        data_json['data'] = response.status_code
        data_json['msg'] = "Failure"
        return JsonResponse(data_json)
### For Get the Donut Chart Data [Location]- End
### For Get the Donut Chart Data [Resource Group Name]- Start
@csrf_exempt
def getDonutChart_ResourceGroup(requestBody):
    FromDate = requestBody.GET['FromDate']
    ToDate = requestBody.GET['ToDate']
    resource_group_exturl = "https://management.azure.com/subscriptions/" + Subscription_ID + "/providers/Microsoft.CostManagement/query?api-version=2021-10-01&$top=5000"
    token = 'Bearer ' + generate_token()
    payload = json.dumps({
        "type": "ActualCost",
        "dataSet": {
            "granularity":
            "None",
            "aggregation": {
                "totalCost": {
                    "name": "Cost",
                    "function": "Sum"
                },
                "totalCostUSD": {
                    "name": "CostUSD",
                    "function": "Sum"
                }
            },
            "grouping": [{
                "type": "Dimension",
                "name": "ResourceGroupName"
            }, {
                "type": "Dimension",
                "name": "ChargeType"
            }, {
                "type": "Dimension",
                "name": "PublisherType"
            }],
            "sorting": [{
                "direction": "descending",
                "name": "Cost"
            }]
        },
        "timeframe": "Custom",
        "timePeriod": {
            "from": FromDate,
            "to": ToDate
        }
    })
    headers = {'Authorization': token, 'Content-Type': "application/json"}
    response = requests.request("POST",
                                resource_group_exturl,
                                headers=headers,
                                data=payload) 
    data_json = {}
    if response.status_code == 200: 
        result = response.json()
        rsg_cost = result['properties']['rows']
        data_json = {}
        data_rsg = []
        data_rsg_cost = []
        for i in range(len(rsg_cost)):
            data_rsg.append("No resource group" if  rsg_cost[i][2] is "" else rsg_cost[i][2] )
            data_rsg_cost.append(round(rsg_cost[i][0],2))
        data_json['rsg'] = data_rsg
        data_json['rsgcost'] = data_rsg_cost
        data_json['msg'] = "Success"
        return JsonResponse(data_json)
    else:
        data_json['data'] = response.status_code
        data_json['msg'] = "Failure"
        return JsonResponse(data_json)
### For Get the Donut Chart Data [Resource Group Name]- End
### ----------------------------- USAGE ------------------------------------###
@csrf_exempt
def listusagemonitoring(request):
    tenant_id = request.GET["tenant_id"]
    listusagemonitoring_exturl = request.GET["listusagemonitoring_exturl"]
    token = 'Bearer ' + request.GET["token"]
    payload = {}
    headers = {'Authorization': token}
    response = requests.request("GET",
                                listusagemonitoring_exturl,
                                headers=headers,
                                data=payload)
    return JsonResponse(response.json())
def listusagemonitoring_chart(request):
    FromDate = request.GET['FromDate']
    ToDate = request.GET['ToDate']
    listusagemonitoring_exturl = "https://management.azure.com/subscriptions/"+ Subscription_ID +"/providers/Microsoft.Consumption/usageDetails?api-version=2021-10-01&metric=actualcost"
    token = 'Bearer ' + generate_token()
    payload = {}
    headers = {'Authorization': token}
    response = requests.request("GET",
                                listusagemonitoring_exturl,
                                headers=headers,
                                data=payload)
    result = response.json()["value"]
    result_array = []
    data_json = {}
    data_rsg = []
    data_rsg_cost =[]
    for items in result:
        result_array.append(items["properties"])
    df_main = pd.json_normalize(json.loads(json.dumps(result_array)))
    final_result = {}
    df_area_chart = pd.DataFrame(
    df_main.groupby(["date"], as_index=False)['quantity'].sum())
    df_area_chart['date']=df_area_chart['date']
    df_area_chart['quantity'] = round(df_area_chart['quantity'])
    df_consumed_service = pd.DataFrame(
    df_main.groupby(["consumedService"], as_index=False)['quantity'].sum()).sort_values(by='quantity',ascending=False)
    df_consumed_service['consumedService'] = df_consumed_service['consumedService']
    df_consumed_service['quantity'] = round(df_consumed_service['quantity'],2)
    df_resourceLocation = pd.DataFrame(
    df_main.groupby(["resourceLocation"],as_index=False)['quantity'].sum()).sort_values(by='quantity',ascending=False)
    df_resourceLocation['quantity'] = round(df_resourceLocation['quantity'],2)
    df_resourceGroup = pd.DataFrame(
    df_main.groupby(["resourceGroup"], as_index=False)['quantity'].sum()).sort_values(by='quantity',ascending=False)
    df_resourceGroup['resourceGroup'] = df_resourceGroup['resourceGroup']
    df_resourceGroup['quantity'] = round(df_resourceGroup['quantity'],2)
    Accumulatedquantity=0
    temp = []
    temp1=[]
    date=''
    for i in range(len( df_area_chart['quantity'])):
            Accumulatedquantity += df_area_chart['quantity'][i]
            temp.append(Accumulatedquantity)
    print(temp)
    for j in range(len( df_area_chart['quantity'])):
            date = str(df_area_chart['date'][j][0:4])+str(df_area_chart['date'][j][4:7])+str(df_area_chart['date'][j][7:10])
            temp1.append(date)
    print(temp1)
    data_json['date']=temp1
    data_json['Accumulated Quantity']=temp
    data_json['quantity'] = df_consumed_service['quantity'].to_json(orient='records')
    data_json['servicename'] = df_consumed_service['consumedService'].to_json(orient='records')
    data_json['servicecost'] =df_consumed_service['quantity'].to_json(orient='records')
    data_json['location'] = df_resourceLocation['resourceLocation'].to_json(orient='records')
    data_json['locationcost'] =df_resourceLocation['quantity'].to_json(orient='records')
    data_json['rsg'] = df_resourceGroup['resourceGroup'].to_json(orient='records')
    data_json['rsgcost'] = df_resourceGroup['quantity'].to_json(orient='records')
    return JsonResponse(data_json)