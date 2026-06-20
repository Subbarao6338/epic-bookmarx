# -*- encoding: utf-8 -*-
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


import os
import pandas as pd
import json
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt
from Utility import connect_azure_sql as AzureSql
from Utility import db_connection_for_dataset as DB
from Utility import kafka
from Utility import azure_anomaly as AzureAnomaly
from Utility import graviton_anomaly as GravitonAnomaly
from Utility import multivariate_anomaly as MultivariateAnomaly
from Utility import save_anomaly as SaveAnomaly


def home(request):
    return render(request, "home.html")


@csrf_exempt
def save_filedetails(request):
    title_name = request.POST['title_name']
    dup = AzureSql.check_duplicate_datasource(title_name)
    if(dup == "SQL Error"):
        return HttpResponse(json.dumps("SQL Error, Please try again"), content_type="application/json")
    elif(dup == 0):
        file = request.FILES['upload_file']
        file_path = SaveAnomaly.handle_uploaded_file('uploaded_data/', file)
        title_id = AzureSql.file_content(title_name, file_path)
        return HttpResponse(json.dumps("Saved Successfully"), content_type="application/json")
    else:
        return HttpResponse(json.dumps("Title Already Exist"), content_type="application/json")


# Connect Database
@csrf_exempt
def connect_db(request):
    json_body = request.POST.dict()
    connection_str = DB.get_connection_string(json_body)
    tables = DB.connect_to_database(connection_str)
    return JsonResponse({'tables': tables})


@csrf_exempt
def connect_mssql(request):
    json_body = request.POST.dict()
    connection_str = DB.get_connection_string(json_body)
    tables = DB.connect_to_mssql(connection_str)
    return JsonResponse({'tables': tables})


# Save Database Details
@csrf_exempt
def save_db_details(request):
    json_body = request.POST.dict()
    connection_str = DB.get_connection_string(json_body)
    title_id = AzureSql.save_db_details(connection_str, json_body)
    return HttpResponse(json.dumps(title_id), content_type="application/json")    


@csrf_exempt
def save_kafka_details(request):
    title_name = request.POST['title_name']
    kafka_host = request.POST['kafka_host']
    port = request.POST['kafka_port']
    topic = request.POST['topic']
    group_id = request.POST['group_id']
    conn_string = request.POST['conn_string']
    kafka_body = json.dumps({'Topic': topic, 'Group_ID': group_id, 'Kafka_Host': kafka_host, 'Port': port, 'conn_string': conn_string})
    title_id = AzureSql.save_kafka_details(title_name, kafka_body)
    return HttpResponse(json.dumps("Saved Successfully"), content_type="application/json")


@csrf_exempt
def get_files_view(request):
    if request.method == 'GET':
        files = AzureSql.get_files()
        return JsonResponse({'files': files})
    else:
        return JsonResponse({"error": "Invalid request method"})


@csrf_exempt
def get_after_removing_file(request):
    if request.method == 'DELETE':
        json_body = json.loads(request.body.decode('utf-8'))
        titleName = json_body['TitleName']
        files = AzureSql.get_after_remove_file(titleName)
        return JsonResponse({'files': files})
    else:
        return JsonResponse({"error": "Invalid request method"})


@csrf_exempt
def get_column_list(request):
    anomaly_id = request.GET.get('anomaly_id')
    file_path_response = AzureSql.get_file_path(anomaly_id)
    if file_path_response[1] == 'Database':
        loads = json.loads(file_path_response[0])
        connection_str = loads["connection_string"]
        selected_table = loads["Table"]
        if loads["Database"] != 'mssql':
            anomaly_df = DB.get_table(connection_str, selected_table)
            column = anomaly_df.columns[0]
            anomaly_df=anomaly_df.sort_values(by=column, ascending=True)
        else:
            anomaly_df = DB.get_mssql_table(connection_str, selected_table)
            column = anomaly_df.columns[0]
            anomaly_df=anomaly_df.sort_values(by=column, ascending=True)

    else:
        anomaly_df = pd.read_csv(file_path_response[0])
        anomaly_df = anomaly_df.sort_values(by=anomaly_df.columns[0], ascending=True)

    column_list_obj = list(anomaly_df.columns)
    col_list = []
    column_list = []
    for column in column_list_obj:
        column_list.append(column)
        col_list.append(column)
    anomaly_df1 = anomaly_df.infer_objects()
    # anomaly_df1['timestamp']=pd.to_datetime(anomaly_df1['timestamp'])
    object_list = list(anomaly_df1.select_dtypes(include=['object', 'datetime64', 'datetime64[ns]']).columns)
    int_list = list(anomaly_df1.select_dtypes(include=['int64', 'float64']).columns)
    setting_values = AzureSql.get_setting_values()
    anomaly_service_type = setting_values["service_type"]
    if anomaly_service_type == "graviton_anomaly_detection":
        return JsonResponse({'object_list': object_list, 'int_list': int_list})
    elif anomaly_service_type == "azure_anomaly_detection":
        diff = SaveAnomaly.timestamp_difference(anomaly_df[object_list], object_list)
        return JsonResponse({'object_list': object_list, 'int_list': int_list, 'diff': diff})


@csrf_exempt
def save_anomaly_parameters(request):
    anomaly_id = request.POST['anomaly_id']
    anomaly_type = request.POST['anomaly_type']
    anomaly_interval = request.POST['anomaly_interval']
    anomaly_params = request.POST['anomaly_params']
    date_param = request.POST['date_param']
    model = request.POST['model_name']
    multivariate_type = request.POST['input_type']
    file_path = AzureSql.get_file_path(anomaly_id)
    form_id = AzureSql.save_anomaly(anomaly_id, anomaly_type, anomaly_interval, anomaly_params, date_param, model, multivariate_type)
    column_list = SaveAnomaly.get_column_list_by_anomaly_id(anomaly_id)
    setting_values = AzureSql.get_setting_values()
    anomaly_service_type = setting_values["service_type"]
    if anomaly_service_type == "graviton_anomaly_detection":
        if multivariate_type == "single":
            GravitonAnomaly.graviton_anomaly_detection(file_path[0], file_path[1], form_id, anomaly_params, date_param, model)
            return HttpResponse(json.dumps("Saved Successfully"), content_type="application/json")
        elif multivariate_type == "multi":
            MultivariateAnomaly.multi_anomaly_detection(file_path[0], file_path[1], form_id, anomaly_params, model)
            return HttpResponse(json.dumps("Saved Successfully"), content_type="application/json")
    elif anomaly_service_type == "azure_anomaly_detection":
        AzureAnomaly.azure_anomaly(file_path[0], file_path[1], form_id, date_param, anomaly_params, column_list, anomaly_type, anomaly_interval)
        return HttpResponse(json.dumps("Saved Successfully"), content_type="application/json")
    else:
        return HttpResponse(json.dumps("Failed Save"), content_type="application/json")


@csrf_exempt
def anomaly_form(request):
    if request.method == 'GET':
        files = AzureSql.anomaly_form()
        return JsonResponse({'files': files})
    else:
        return JsonResponse({"error": "Invalid request method"})


@csrf_exempt
def view_anomaly(request):
    if request.method == 'GET':
        id = request.GET.get('ID')
        file_data = AzureSql.view_anomaly(id)
        itype = file_data[4]
        itype.replace(" ", "")
        return JsonResponse({'json': file_data[0], 'anomaly_param': file_data[1], 'input_type': file_data[4].strip()})


@csrf_exempt
def chart_classification(request):
    if request.method == 'GET':
        anomaly_counts = AzureSql.chart_classification()
        return JsonResponse({'data': anomaly_counts})


@csrf_exempt
def get_chart_data(request):
    if request.method == 'GET':
        id = request.GET.get('ID')
        anomaly_data = AzureSql.view_anomaly(id)
        anomaly_param = anomaly_data[1]
        if ',' in anomaly_param:
            anomaly_param = anomaly_param.split(',')
        else:
            anomaly_param = anomaly_param

        anomaly_json = anomaly_data[0]
        anomaly_id = anomaly_data[2]
        input_type = anomaly_data[4].replace(" ", "")
        timeseries_param = anomaly_data[3]
        index_of_anomaly_data = []
        if anomaly_json == '''No anomalies were detected in the time series.''':
            index_of_anomaly_data = []
        else:
            for val in anomaly_json:
                index_of_anomaly_data.append(int(val['index']))

        file_path_by_anomaly_id = AzureSql.get_file_path(anomaly_id)
        file_path = file_path_by_anomaly_id[0]
        ds_type = file_path_by_anomaly_id[1]
        if ds_type == "Database":
            connection_str = json.loads(file_path)["connection_string"]
            selected_table = json.loads(file_path)["Table"]
            if json.loads(file_path)["Database"] != "mssql":
                org_df = DB.get_table(connection_str, selected_table)
            else:
                org_df = DB.get_mssql_table(connection_str, selected_table)
        # elif ds_type == "Apache_Kafka":
        #     org_df = pd.read_csv('uploaded_data/file.csv')
        elif ds_type == "Local":
            org_df = pd.read_csv(file_path)
        full_data = list(org_df[anomaly_param])
        timeseries_data = list(org_df[timeseries_param])
        color = ["green"] * len(full_data)
        for index in index_of_anomaly_data:
            color[index] = "red"
        data = {'full_data': full_data, 'timeseries_data': timeseries_data, 'color': color,
                'anomaly_param': anomaly_param, 'input_type': input_type}
        return JsonResponse(data)


@csrf_exempt
def get_multi_data(request):
    if request.method == 'GET':
        id = request.GET.get('ID')
        anomaly_data = AzureSql.view_anomaly(id)
        anomaly_param = anomaly_data[1]
        anomaly_json = anomaly_data[0]
        anomaly_id = anomaly_data[2]
        input_type = anomaly_data[4].replace(" ", "")
        index_of_anomaly_data = []
        if anomaly_json == '''No anomalies were detected in the time series.''':
            index_of_anomaly_data = []
        else:
            for val in anomaly_json:
                index_of_anomaly_data.append(int(val['index']))

        file_path_by_anomaly_id = AzureSql.get_file_path(anomaly_id)
        file_path = file_path_by_anomaly_id[0]
        ds_type = file_path_by_anomaly_id[1]
        if ds_type == "Database":
            connection_str = json.loads(file_path)["connection_string"]
            selected_table = json.loads(file_path)["Table"]
            if json.loads(file_path)["Database"] != "mssql":
                org_df = DB.get_table(connection_str, selected_table)
            else:
                org_df = DB.get_mssql_table(connection_str, selected_table)
        # elif ds_type == "Apache_Kafka":
        #     org_df = pd.read_csv('uploaded_data/file.csv')
        elif ds_type == "Local":
            org_df = pd.read_csv(file_path)

        # full_data = org_df[anomaly_param]
        anomaly_cols = anomaly_param.split(",")
        response_json = {}
        for col in anomaly_cols:
            response_json[col] = list(org_df[col])
        color = ["green"]*len(org_df)
        for index in index_of_anomaly_data:
            color[index] = "red"
        data = {'full_data': json.dumps(response_json), 'color': color, 'anomaly_param': anomaly_param, 'input_type': input_type}
        return JsonResponse(data, safe=False)


@csrf_exempt
def update_anomaly_services(request):
    # id = request.POST['id']
    Anomaly_services = request.POST['Anomaly_services']
    subscription_key = request.POST['subscription_key']
    ad_endpoint = request.POST['anomaly_detector_endpoint']
    form_id = AzureSql.update_anomaly(Anomaly_services, subscription_key, ad_endpoint)
    return HttpResponse(json.dumps("Updated Successfully"), content_type="application/json")


@csrf_exempt
def get_setting_values(request):
    if request.method == 'GET':
        setting_values = AzureSql.get_setting_values()
    return JsonResponse({"data": setting_values})
    # else:
    # return JsonResponse({"error": "Invalid request method"})


@csrf_exempt
def graviton_table(request):
    if request.method == 'GET':
        files = AzureSql.graviton_table()
        return JsonResponse({'files': files})
    else:
        return JsonResponse({"error": "Invalid request method"})


@csrf_exempt
def settings_anomaly_service(request):
    config = AzureSql.settings_anomaly_service()
    # print(config)
    return HttpResponse(json.dumps(config), content_type='application/json')


@csrf_exempt
def dataset_counts(request):
    if request.method == 'GET':
        dataset_counts_data = AzureSql.dataset_counts()
        return JsonResponse({'data': dataset_counts_data})


@csrf_exempt
def get_kafka(request):
    if request.method == 'GET':
        kafka = AzureSql.get_kafka()
        return JsonResponse({'data': kafka})
