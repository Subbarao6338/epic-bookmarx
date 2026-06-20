from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Utility import metadata_utility as metadata_util
import json
import pandas as pd


@csrf_exempt
def handle_uploaded_file(path, file):
    with open(path + file.name, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
        return path + file.name


@csrf_exempt
def save_metadata(request):
    tenant_id = request.POST['tenant_id']
    title = request.POST['title']
    file = request.FILES['file']
    acc_details = request.POST['acc_details']
    # one file is there
    file_path = handle_uploaded_file(path='temp_files/', file=file)
    if file_path.endswith(".csv"):
        file_content = pd.read_csv(file_path)
    elif file_path.endswith(".json"):
        file_content = pd.read_json(file_path)
    else:
        raise ValueError("Invalid file format")
    filename = file.name
    index = file_content.index
    number_of_rows = len(index)
    if number_of_rows < 100:
        temp = []
        for i in range(number_of_rows):
            # print("Content")
            # print(file_content.iloc[i].to_json())
            temp.append(file_content.iloc[i].to_json())
    else:
        temp = []
        for i in range(100):
            # print("Content")
            # print(file_content.iloc[i].to_json())
            temp.append(file_content.iloc[i].to_json())

    print("temp")
    json_obj = file_content.to_json(orient ='table', index=False)
    data_org = json.loads(json_obj)
    data = json.dumps(data_org['data'])
    data_schema = data_org['schema']['fields']
    data_schema_new = {}
    for val in data_schema:
        print(val)
        data_schema_new[val['name']] = val['type']
    data_schema_new = json.dumps(data_schema_new)
    data = {
        "file_name": filename,
        "data": data,
        "data_schema": data_schema_new
    }

    # check_metadata_title(req) ---> final_title
    final_title = metadata_util.check_metadata_title(title)
    response = metadata_util.insert_metadata(data, tenant_id, final_title, acc_details)
    # response = "Done"
    return HttpResponse(response)


@csrf_exempt
def get_metadata(request):
    tenant_id = request.GET['tenant_id']
    response = metadata_util.get_metadata(tenant_id)

    return HttpResponse(json.dumps(response['data']), content_type="application/json")


@csrf_exempt
def view_metadatafile(request):
    filename = request.GET["filename"]
    id = request.GET["id"]

    response = metadata_util.get_metadata_by_filename(filename, id)
    data = json.loads(response['data'][0]['data'])
    data_schema = json.loads(response['data'][0]['data_schema'])
    file_name = response['data'][0]['filename']
    title = response['data'][0]['title']

    return_res = [{
        'data' : data,
        'data_schema' : data_schema,
        'filename' : file_name,
        'title' : title
    }]
    return HttpResponse(json.dumps(return_res), content_type="application/json")


@csrf_exempt
def delete_metadata(request):
    id = request.GET['id']

    response = metadata_util.delete_metadata(id)

    return HttpResponse(response)
