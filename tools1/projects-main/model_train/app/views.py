# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""
import json
import mimetypes
from urllib import response
from threading import Thread

import pandas as pd
from django.http import HttpResponse
from django.http.response import JsonResponse, FileResponse, Http404
from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt
from Utility import connect_sqlite as dbconn
from Utility import connect_azure_sql as azure_sql_conn
from Utility import connect_azure_blob as azure_blob_conn
from Simulator import device_events_simulator as event_simulator
from SDV import sdv_main as sdv_simulator
from SDV.sdv_model_training import single_table_sdv_model_training, generate_sdv_data
from SDV_REL.sdv_model_training import relational_sdv_model_training, generate_rel_sdv_data
from Utility.anonymize_data_utility import anonymize_uploaded_data, remove_rows_by_index, add_rows_to_existing_csv, \
    update_uploaded_file_as_anonymized, update_uploaded_json_file_as_anonymized
from .models import SDVForm, SDVModel
from Image_Simulation.Image_Processing import SampleImageSimulation as image_simulation
import shutil
import os

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")
masking_json_path = os.path.join(config_path, "masking_type.json")
sdv_path = os.path.join(cwdPath, "SDV")


def index(request):
    return render(request, "index.html")


def simulator(request):
    return render(request, "simulator.html")


def generate_page_view(request):
    return render(request, "Generate.html")


def reports(request):
    return render(request, "reports.html")


@csrf_exempt
def start_simulator(request):
    request_data = request.POST['req_data']

    request_data_json = json.loads(request_data)
    simulation_type = request_data_json['simulation_type']
    cloud_type = request_data_json['cloud_type']
    cloud_service_type = request_data_json['cloud_service_type']
    data_options = request_data_json['data_options']
    hub_name = request_data_json['hub_name']
    device_count = int(request_data_json['device_count'])
    time_delay = int(request_data_json['time_delay'])
    simulator_status = request_data_json['simulator_status']

    sql_response = dbconn.insert_simulator_details(request_data)
    if simulation_type == "Rule_Based":
        event_simulator.simulator(cloud_service_type, data_options, device_count, time_delay, simulator_status,
                                  hub_name,
                                  "UI")
    else:
        sdv_simulator.sent_synthetic_data(cloud_service_type, time_delay, hub_name)
    response = "Simulator Event Sent Successfully"
    # else:
    #     response = "Simulator Development In-Progress"

    return HttpResponse(json.dumps(response), content_type="application/json")


@csrf_exempt
def stop_simulator(request):
    request_data = request.POST['req_data']
    sql_response = dbconn.update_simulator_status(request_data)
    response = "Simulator Stopped Successfully"
    return HttpResponse(json.dumps(response), content_type="application/json")


@csrf_exempt
def get_simulator_details(request):
    response = dbconn.get_simulator_details()
    # print('get_simulator_details :>>',response)
    return HttpResponse(json.dumps(response), content_type="application/json")


@csrf_exempt
def get_hub_name_details(request):
    request_data = request.POST['req_data']
    request_data_json = json.loads(request_data)
    cloud_service_type = request_data_json['cloud_service_type']

    response_from_setting = azure_sql_conn.get_hub_name_details(cloud_service_type)
    return HttpResponse(json.dumps(response_from_setting), content_type="application/json")


@csrf_exempt
def get_device_count(request):
    response = dbconn.get_device_count()
    return HttpResponse(json.dumps(response), content_type="application/json")


@csrf_exempt
def get_device_count_from_metadata(request):
    dbconn.create_device_count_tbl()
    count_metadata = azure_sql_conn.get_device_count_from_metadata()
    count_local = dbconn.get_device_count()
    if count_local != 0:
        if count_local != count_metadata:
            dbconn.update_devicecount(count_metadata)
            response = 'Success'
    else:
        dbconn.insert_devicecount(count_metadata)
        response = 'Success'
    print('get_device_count_from_metadata :>>', response)
    return HttpResponse(json.dumps(response), content_type="application/json")


@csrf_exempt
def image_submit(request):
    if request.method == 'POST':
        file = request.FILES['image_file']
        # converted_string = base64.b64encode(file.read())
        # print(file.read())
        temp_img_path = os.getcwd() + "/Image_Simulation/temp_images/"
        for f in os.listdir(temp_img_path):
            try:
                os.remove(os.path.join(temp_img_path, f))
            except:
                shutil.rmtree(os.path.join(temp_img_path, f))
        out_img_path = os.getcwd() + "/Image_Simulation/output_images/"
        for f in os.listdir(out_img_path):
            shutil.rmtree(os.path.join(out_img_path, f))
        processed_img_path = os.getcwd() + "/Image_Simulation/processed_images.zip"
        if (os.path.exists(processed_img_path)):
            os.remove(processed_img_path)

        file_path = handle_uploaded_file(path=temp_img_path, file=file)
        ftype = file_path[-3:]
        try:
            shutil.unpack_archive(file_path, "Image_Simulation/temp_images/", "zip")
            os.remove(file_path)
            print(ftype)
            ret = ""
            f_name_ls = []
            f_type_ls = []
            f_size_ls = []
            if ftype == "zip":
                all_files_path = os.getcwd() + "/Image_Simulation/temp_images/"
                all_files = os.listdir(all_files_path)
                for file in all_files:
                    f_path = all_files_path + file
                    file_type = file[-3:]
                    file_name = file
                    file_size = os.path.getsize(f_path)
                    txt = ""
                    txt += "Name: " + file_name + "<br>"
                    s = file_size
                    s = s / 1024
                    s = str(round(s))
                    s = s + " KB"
                    txt += "Size: " + s + "<br>"
                    txt += "Type: " + file_type + "<br><br>"
                    ret = ret + txt
                    f_name_ls.append(file_name)
                    f_size_ls.append(s)
                    f_type_ls.append(file_type)

            return JsonResponse(
                {'message': 'File uploaded successfully', 'data': ret, 'ftype': ftype, 'fname': f_name_ls,
                 'type_ls': f_type_ls, 'size_ls': f_size_ls})
            # return HttpResponse(file)
        except:
            file_path = os.getcwd() + "/Image_Simulation/temp_images/"
            file = os.listdir(file_path)
            f_path = file_path + file[0]
            file_name = file[0]
            file_size = os.path.getsize(f_path)
            file_type = "image/" + file[0][-3:]
            txt = ""
            txt += "Name: " + file_name + "<br>"
            s = file_size
            s = s / 1024
            s = str(round(s, 2))
            txt += "Size: " + s + " KB <br>"
            txt += "Type: " + file_type + "<br><br>"
            ret = txt
            print(ret)
            return JsonResponse(
                {'message': 'File uploaded successfully', 'data': ret, 'ftype': ftype, 'fname': file_name})

    if request.method == 'GET':
        return render(request, "image_upload.html")


@csrf_exempt
def sdv_model_training(request):
    if request.method == 'POST':
        file_path = handle_uploaded_file(path='SDV/temp_files/', file=request.FILES['sdv_train_file'])
        model_name = request.POST['sdv_model_name']

        is_model_name_duplicate = azure_sql_conn.check_duplicate_model_name(model_name + ".pkl")
        if is_model_name_duplicate:
            return JsonResponse({"status": "failed", "error": "model_name already exist"})

        response = {}
        key_list = []
        if file_path.endswith(".csv"):
            file_content = pd.read_csv(file_path)
        elif file_path.endswith(".json"):
            file_content_df = pd.read_json(file_path)
            file_content = pd.json_normalize(file_content_df.to_dict("records"))
        else:
            raise ValueError("Invalid train file format")

        columns = list(file_content.columns)
        # json_data = json.loads(file_content)
        # print(json_data)
        for key in columns:
            key_list.append(key)
        response['json_key_list'] = key_list
        response['file_path'] = file_path
        response['file_length'] = len(file_content.index)
        print(masking_json_path)
        with open(masking_json_path, 'r') as masking_json_file:
            json_data = masking_json_file.read()
        json_data = json.loads(json_data)
        print(json_data)
        # json_data = ['a','b','c']
        masking_key_list = []
        for json_key in json_data:
            masking_key_list.append(json_key)
        response['masking_type_list'] = masking_key_list
        print(json.dumps(response))
        return HttpResponse(json.dumps(response), content_type="application/json")

        # single_table_sdv_model_training(file_path=file_path, model_name=model_name)
        # return JsonResponse({'message': 'File uploaded and model trained successfully'})
    else:
        return render(request, "sdv_model_training.html")

@csrf_exempt
def start_sdv_training(request):
    if request.method == 'POST':
        file_path = request.POST['file_path']
        model_name = request.POST['model_name']
        remove_index_list = json.loads(request.POST['remove_indexes'])
        added_records = json.loads(request.POST['added_records'])
        mask_column_list = json.loads(request.POST['mask_col_list'])
        model_type = request.POST['model_type']
        batch_size = request.POST['batch_size']
        epoch_size = request.POST['epoch_size']
        columnFormulas = json.loads(request.POST['columnFormulas'])
        print(columnFormulas)

        create_constraints(columnFormulas)

        # print(remove_index_list)
        # if len(remove_index_list) > 0:
        #     remove_rows_by_index(file_path, remove_index_list)
        # if len(added_records) > 0:
        #     add_rows_to_existing_csv(file_path, added_records)
        if len(mask_column_list) > 0:
            update_uploaded_file_as_anonymized(file_path, mask_column_list)
        train_thread = Thread(target=single_table_sdv_model_training,
                              args=(file_path, model_name, model_type, batch_size, epoch_size,))
        train_thread.start()
        # single_table_sdv_model_training(file_path=file_path, model_name=model_name)
        return JsonResponse({'message': 'Model Training Started Successfully'})
    else:
        return render(request, "sdv_model_training.html")


@csrf_exempt
def data_simulator(request):
    if request.method == 'POST':
        data_form = DATAForm(request.POST, request.FILES)
        if data_form.is_valid():
            file_path = handle_uploaded_file(request.FILES['JSON'])
            Template_Name = request.POST['Template_Name']
            single_table_data_simulator(
                file_path=file_path, Template_Name=Template_Name)
            return JsonResponse({'message': 'File uploaded and Template trained successfully'})
    else:
        return render(request, "Data_Simulator.html")


@csrf_exempt
def handle_uploaded_file(path, file):
    # data = pd.read_csv(file)
    # file=data.to_json(orient='index',lines=True)
    with open(path + file.name, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
        return path + file.name


@csrf_exempt
def get_sdv_models_view(request):
    if request.method == 'GET':
        sdv_models = azure_sql_conn.get_sdv_models()
        return JsonResponse({'sdv_models': sdv_models})
    else:
        return JsonResponse({"error": "Invalid request method"})


@csrf_exempt
def get_template_list_view(request):
    if request.method == 'GET':
        template_list = azure_sql_conn.get_template_list()
        return JsonResponse({'template_list': template_list})
    else:
        return JsonResponse({"error": "Invalid request method"})


@csrf_exempt
def get_template_models_view(request):
    if request.method == 'GET':
        template_models = azure_sql_conn.get_template_models()
        return JsonResponse({'template_models': template_models})
    else:
        return JsonResponse({"error": "Invalid request method"})


@csrf_exempt
def get_after_removing_template_model(request):
    if request.method == 'DELETE':
        json_body = json.loads(request.body.decode('utf-8'))
        templateId = json_body['templateId']
        template_models = azure_sql_conn.get_after_remove_template_model(templateId)
        return JsonResponse({'template_models': template_models})


def get_complete_json_view(request):
    if request.method == 'GET':
        templateId = request.GET.get('templateId')
        template_models = azure_sql_conn.get_complete_json(templateId)
        # print((template_models));
        return JsonResponse({'template_models': template_models})


@csrf_exempt
def download_sdv_file_view(request):
    if request.method == "GET":
        filetype = request.GET.get("filetype")
        filename = request.GET.get("filename")
        file_path = "SDV/" + filetype + "/" + filename

        with open(file_path, "rb") as file:
            response = HttpResponse(file, content_type="application/force-download")
            response["Content-Disposition"] = "attachment; filename=%s" % filename
        return response


@csrf_exempt
def download_rel_sdv_file_view(request):
    if request.method == "GET":
        filetype = request.GET.get("filetype")
        filename = request.GET.get("filename")
        file_path = "SDV_REL/" + filetype + "/" + filename

        with open(file_path, "rb") as file:
            response = HttpResponse(file, content_type="application/force-download")
            response["Content-Disposition"] = "attachment; filename=%s" % filename
        return response


@csrf_exempt
def submit_setting_form(request):
    if request.method == 'POST':
        request_data = request.POST
        request_data_json = json.dumps(request_data)
        # #
        ret = azure_sql_conn.insert_setting_details(request_data_json)
        response = "Setting data sent Successfully"

        return HttpResponse(json.dumps(request_data), content_type="application/json")


@csrf_exempt
def get_setting_details(request):
    response = azure_sql_conn.get_setting_details()
    return HttpResponse(json.dumps(response), content_type="application/json")


@csrf_exempt
def image_generation(request):
    # response = "yesssssssssss"
    # file = request.FILES['image_file'];
    print("RESPONSE: ")
    rotation = request.POST["rotation"]
    shift = request.POST["shift"]
    flip = request.POST["flip"]
    shear = request.POST["shear"]
    zoom = request.POST["zoom"]
    grayscale = request.POST["grayscale"]
    width = request.POST["width"]
    height = request.POST["height"]
    resize = request.POST["resize"]
    print(rotation, shift, flip, shear, zoom, grayscale, resize, width, height)
    inp_dir = os.getcwd() + "/Image_Simulation/temp_images/"
    if os.listdir(inp_dir):
        out_dir = os.getcwd() + "/Image_Simulation/output_images/"
        response = image_simulation.MyFunction(inp_dir, out_dir, rotation, shift, shear, zoom, flip, grayscale, resize,
                                               width, height)
        shutil.make_archive(os.getcwd() + "/Image_Simulation/processed_images", "zip", out_dir)
        for f in os.listdir(inp_dir):
            try:
                os.remove(os.path.join(inp_dir, f))
            except:
                shutil.rmtree(os.path.join(inp_dir, f))

        return HttpResponse(json.dumps(response), content_type="application/json")
    else:
        response = "Please Submit Image.."
        return HttpResponse(json.dumps(response), content_type="application/json")


def custom_message_template(request):
    return render(request, "message_template.html")


import csv


@csrf_exempt
def display_json_content(request):
    response = {}
    key_list = []
    template_name = request.POST['template_name']
    file = request.FILES['template_file']
    filename = file.name

    if filename.endswith(".json"):
        file_content = file.read()
        json_str = file_content.decode('utf8').replace("'", '"')

    elif filename.endswith(".csv"):
        filepath = handle_uploaded_file(path="messagetemplate/", file=file)
        file_content = pd.read_csv(filepath)
        json_str = file_content.to_json()
        print(json_str)

    else:
        raise ValueError("Invalid train file format")

    print(json_str)
    json_data = json.loads(json_str)
    print(json_data)
    template_id = azure_sql_conn.save_json_content(template_name, json.dumps(json_data))
    for key in json_data.keys():
        key_list.append(key)
    response['template_id'] = str(template_id)
    response['json_key_list'] = key_list
    return HttpResponse(json.dumps(response), content_type="application/json")


@csrf_exempt
def push_to_db(request):
    path = os.getcwd() + "/Image_Simulation/processed_images.zip"
    name = request.POST["Blob"]
    if name != "":
        response = azure_blob_conn.function(path, name)
    else:
        response = "Please Enter Blob Name!"
    return HttpResponse(json.dumps(response), content_type="application/json")


@csrf_exempt
def download_images(request):
    path = "C:/Users/azureuser/Downloads/abc.zip"
    blob_name = "output/Output_images1"
    response = azure_blob_conn.download_blob(path, blob_name)
    return HttpResponse(json.dumps(response), content_type="application/json")


@csrf_exempt
def download_zip(request):
    file_path = os.getcwd() + "/Image_Simulation/processed_images.zip"
    print(file_path)
    if os.path.exists(file_path):
        print("yes exist!")
        with open(file_path, 'rb') as fh:
            mime_type, _ = mimetypes.guess_type(file_path)
            response = HttpResponse(fh.read(), content_type=mime_type)
            print(response)
            response['Content-Disposition'] = 'attachment; filename=' + os.path.basename(file_path)
            response['msg'] = "Downloaded Successfully!!"
        os.remove(file_path)
        return response
    else:
        return JsonResponse({"msg": "Please Generate Synthetic Images!!"})


@csrf_exempt
def json_content_property(request):
    t_data = json.loads(request.POST['data'])
    print(t_data)
    type_to_value = {
        "String": "string_value",
        "Phone Number": "tel_value",
        "E-Mail": "email_value",
        "IP Address": "ip_value"
    }
    for value in t_data:
        prop_value = value.get(type_to_value.get(value['type'], ''), "")
        azure_sql_conn.save_json_content_property(value['type'], value['propsName'], prop_value,
                                                  value['value_from'], value['value_to'], value['template_id'], )
    return HttpResponse("Json content property saved successfully")


@csrf_exempt
def get_static_file(request):
    f_name = request.GET.get('f_name')
    if request.method == 'GET':
        absolute_path = os.getcwd() + "/Image_Simulation/temp_images/" + f_name
        response = FileResponse(open(absolute_path, 'rb'), content_type='image/png')
        return response


@csrf_exempt
def setting_page(request):
    return render(request, "Setting.html")


@csrf_exempt
def rel_sdv_model_training(request):
    file_list = request.FILES.getlist('rel_sdv_train_file')
    meta_file = request.FILES.get('sdv_train_meta_file')
    # print("file_list")
    # print(meta_file)
    if request.method == 'POST':
        meta_file_path = handle_uploaded_file(path='SDV_REL/metadata/', file=meta_file)
        array_file_path = []
        array_file_path_json = {}
        uploaded_file_list = {}
        uploaded_file_content_list = {}
        masking_content = {}
        temp = []
        temp1 = []
        for file in file_list:
            file_path = handle_uploaded_file(path='SDV_REL/temp_files/', file=file)
            if file_path.endswith(".csv"):
                file_content = pd.read_csv(file_path)
            elif file_path.endswith(".json"):
                file_content = pd.read_json(file_path)
            else:
                raise ValueError("Invalid train file format")
            temp.append(file.name)
            temp1.append(list(file_content.columns))
            array_file_path.append(file_path)
        model_name = request.POST['sdv_model_name']
        uploaded_file_list['data'] = temp
        uploaded_file_content_list['data'] = temp1
        array_file_path_json['data'] = array_file_path
        print(masking_json_path)
        with open(masking_json_path, 'r') as masking_json_file:
            json_data = masking_json_file.read()
        json_data = json.loads(json_data)
        print(json_data)
        # json_data = ['a','b','c']
        masking_key_list = []
        for json_key in json_data:
            masking_key_list.append(json_key)
        masking_content['masking_type_list'] = masking_key_list
        # relational_sdv_model_training(array_file_path, check_list, meta_file_path, model_name)
        return JsonResponse(
            {'message': 'File uploaded and model trained successfully', 'meta_file_path': meta_file_path,
             'data': uploaded_file_list, 'columns_list': uploaded_file_content_list,
             'masking_type_list': masking_content, 'file_paths': array_file_path_json})
    else:
        return render(request, "sdv_model_training.html")


@csrf_exempt
def start_rel_sdv_training(request):
    file_list = request.POST['rel_sdv_train_file_path_arr']
    meta_file_path = request.POST['metadata_file_path']
    mask_column_list = json.loads(request.POST['mask_columns'])
    if request.method == 'POST':
        model_name = request.POST['model_name']
        array_file_path = file_list.split(",")
        print(array_file_path)
        print(meta_file_path)
        print(model_name)
        if len(mask_column_list) > 0:
            for file_path in array_file_path:
                update_uploaded_json_file_as_anonymized(file_path, mask_column_list)
        rel_train_thread = Thread(target=relational_sdv_model_training,
                                  args=(array_file_path, meta_file_path, model_name,))
        rel_train_thread.start()
        # relational_sdv_model_training(array_file_path, meta_file_path, model_name)
        return JsonResponse({'message': 'Model Training Started Successfully'})
    else:
        return render(request, "sdv_model_training.html")


@csrf_exempt
def get_rel_sdv_models_view(request):
    if request.method == 'GET':
        sdv_models = azure_sql_conn.get_rel_sdv_models()
        return JsonResponse({'sdv_models': sdv_models})
    else:
        return JsonResponse({"error": "Invalid request method"})
    return JsonResponse({"error": "Invalid request method"})


@csrf_exempt
def download_rel_sdv_file_view(request):
    if request.method == "GET":
        filetype = request.GET.get("filetype")
        filename = request.GET.get("filename")
        file_path = os.path.join(os.getcwd(), "SDV_REL", filetype, filename)

        with open(file_path, "rb") as file:
            response = HttpResponse(file, content_type="application/force-download")
            response["Content-Disposition"] = "attachment; filename=%s" % filename
        return response
    return JsonResponse({"error": "Invalid request method"})


@csrf_exempt
def get_metadata_json_view(request):
    if request.method == 'GET':
        name = request.GET.get('name')
        name = "/SDV_REL/metadata/" + name
        # print(name)
        path = os.getcwd() + name
        print(path)
        with open(path) as f:
            data = json.load(f)
        template_models = data
        # print(template_models);
        return JsonResponse({'template_models': template_models})


@csrf_exempt
def get_uploaded_json_view(request):
    if request.method == 'GET':
        name = request.GET.get('name')
        name = "/SDV_REL/temp_files/" + name
        # print(name)
        path = os.getcwd() + name
        print(path)
        with open(path) as f:
            data = json.load(f)
        template_models = data
        print(template_models);
        return JsonResponse({'template_models': template_models})


@csrf_exempt
def get_model_list_dropdown(request):
    request_data = request.POST['req_data']
    request_data_json = json.loads(request_data)
    data_type = request_data_json['data_type']
    if data_type == 'single_table':
        sdv_models = azure_sql_conn.get_sdv_models_drop()
        res = []
        for model in sdv_models:
            res.append(model['sdv_model'])

        return HttpResponse(json.dumps(res), content_type="application/json")
    else:
        sdv_models = azure_sql_conn.get_rel_sdv_models_drop()
        res = []
        for model in sdv_models:
            res.append(model['sdv_model'])

        return HttpResponse(json.dumps(res), content_type="application/json")


@csrf_exempt
def synth_data_generation(request):
    generated_id = request.POST['generate_id']
    row_numbers = request.POST['Number_of_Rows']
    model_selected = request.POST['Model_Selected']
    data_type = request.POST['Data_Type']
    # is_already_exist = azure_sql_conn.chk_if_data_already_exist(model_selected, row_numbers, data_type)
    # if is_already_exist:
    #     return HttpResponse(json.dumps("Duplicate"), content_type="application/json")
    if int(generated_id) > 0:
        azure_sql_conn.remove_generated_record(generated_id)
    print(generated_id, row_numbers, model_selected, data_type)
    if data_type == 'Single':
        model_file_path = os.getcwd() + "/SDV/sdv_models/" + model_selected
        single_dataset_thread = Thread(target=generate_sdv_data,
                                       args=(model_file_path, model_selected, int(row_numbers), data_type))
        single_dataset_thread.start()
        # generate_sdv_data(model_file_path, int(row_numbers))
        res = "Success"
        return HttpResponse(json.dumps(res), content_type="application/json")
    else:
        model_file_path = os.getcwd() + "/SDV_REL/sdv_models/" + model_selected
        single_dataset_thread = Thread(target=generate_rel_sdv_data,
                                       args=(model_file_path, model_selected, int(row_numbers), data_type))
        single_dataset_thread.start()
        # generate_rel_sdv_data(model_file_path, int(row_numbers))
        res = "Success"
        return HttpResponse(json.dumps(res), content_type="application/json")


@csrf_exempt
def get_anonymized_data(request):
    t_data = json.loads(request.POST['selected_data'])
    uploaded_file_path = request.POST['file_path']
    page_number = int(request.POST['page_number'])
    page_size = int(request.POST['page_size'])
    if uploaded_file_path.endswith(".csv"):
        if page_number == 1:
            uploaded_df = pd.read_csv(uploaded_file_path, nrows=page_size)
        else:
            uploaded_df = pd.read_csv(uploaded_file_path, skiprows=range(1, (page_number - 1) * page_size),
                                      nrows=page_size)
    else:
        # with open(uploaded_file_path, 'r') as f:
        #     data = json.loads(f.read())
        print("File_path", uploaded_file_path)
        uploaded_json_data = pd.read_json(uploaded_file_path)
        # uploaded_df = pd.DataFrame.from_dict(data)
        uploaded_df = pd.json_normalize(uploaded_json_data.to_dict("records"))
        if len(uploaded_df) > 5000:
            uploaded_df = uploaded_df.head(5000)
    anonymized_df = anonymize_uploaded_data(uploaded_df, t_data)
    return HttpResponse(anonymized_df.to_json(orient="records", date_format='iso'), content_type="application/json")


@csrf_exempt
def get_id_and_name(request):
    if request.method == 'GET':
        template_list_with_id = azure_sql_conn.get_template_list_with_ID()
        print(template_list_with_id)
        return JsonResponse({'template_list_with_id': template_list_with_id})
    else:
        return JsonResponse({"error": "Invalid request method"})


from image_anonymization import detect


@csrf_exempt
def image_anonymization_submit(request):
    res = {}
    # print(request.FILES.getlist('uploaded_image_file'))
    file = request.FILES['uploaded_image_file']
    if request.method == 'POST':
        print(file.name)
        file_path = handle_uploaded_file(path='image_anonymization/input_img/', file=file)
        res['message'] = "Image Uploaded Sucessfully"
        res['file_path'] = file_path

    return HttpResponse(json.dumps(res), content_type="application/json")


@csrf_exempt
def image_anonymization_generate(request):
    if request.method == 'POST':
        file_path = request.POST['file_path']
        print(file_path)
        detect.detect_and_blur(file_path)

    return HttpResponse(json.dumps({'file_path': file_path}), content_type="application/json")


from django.views.decorators.cache import never_cache


@csrf_exempt
@never_cache
def image_anonymization_preview(request):
    file_path = os.getcwd() + "/image_anonymization/output_img/latest.jpg"
    print(file_path)
    if os.path.exists(file_path):
        print("yes exist!")
        response = FileResponse(open(file_path, 'rb'), content_type='image/jpg')
        return response


@csrf_exempt
def download_image(request):
    file_path = os.getcwd() + "/image_anonymization/output_img/latest.jpg"
    print(file_path)
    if os.path.exists(file_path):
        print("yes exist!")
        with open(file_path, 'rb') as fh:
            mime_type, _ = mimetypes.guess_type(file_path)
            response = HttpResponse(fh.read(), content_type=mime_type)
            print(response)
            response['Content-Disposition'] = 'attachment; filename=' + os.path.basename(file_path)
            response['msg'] = "Downloaded Successfully!!"
            return response
    raise Http404


def get_schema_detail(request):
    if request.method == 'GET':
        templateId = request.GET.get('templateId')
        template_models = azure_sql_conn.get_schema_detail_by_id(templateId)
        # print((template_models));
        return JsonResponse({'template_models': template_models})


def get_synthetic_data_list(request):
    data_list = azure_sql_conn.get_synthetic_data_list()
    return JsonResponse({'data_list': data_list})


def generated_list(request):
    return render(request, "synthetic_data_generation.html")


@csrf_exempt
def dataset_counts(request):
    if request.method == 'GET':
        dataset_counts_data = azure_sql_conn.dataset_counts()
        return JsonResponse({'data': dataset_counts_data})



@csrf_exempt
def get_recent_sdv_models(request):
    if request.method == 'GET':
        recent_sdv_models = azure_sql_conn.get_recent_sdv_models()
        return JsonResponse({'data': recent_sdv_models})


@csrf_exempt
def get_recent_rel_sdv_models(request):
    if request.method == 'GET':
        recent_rel_sdv_models = azure_sql_conn.get_recent_rel_sdv_models()
        return JsonResponse({'data': recent_rel_sdv_models})


def get_modal_by_type(request):
    dataset_type = request.GET.get('dataset_type')
    modal_list = azure_sql_conn.get_modal_list_by_type(dataset_type)
    return JsonResponse({'modal_list': modal_list})


def get_total_rows_count(request):
    file_path = request.GET.get('file_path')
    with open(file_path, "r") as f:
        reader = csv.reader(f, delimiter=",")
        data = list(reader)
        row_count = len(data)
    return JsonResponse({'total_count': row_count})


@csrf_exempt
def add_records_to_file(request):
    file_path = request.POST['file_path']
    added_records = json.loads(request.POST['added_records'])
    if len(added_records) > 0:
        add_rows_to_existing_csv(file_path, added_records)
    return JsonResponse({"message": "Record added successfully."})


@csrf_exempt
def remove_record_from_file(request):
    file_path = request.POST['file_path']
    remove_index_list = json.loads(request.POST['remove_indexes'])
    if len(remove_index_list) > 0:
        remove_rows_by_index(file_path, remove_index_list)
    return JsonResponse({"message": "Record removed successfully."})


@csrf_exempt
def remove_synthgen_record(request):
    generated_id = request.POST['generated_id']
    azure_sql_conn.remove_generated_record(generated_id)
    return JsonResponse({"message": "Record removed successfully."})


@csrf_exempt
def remove_single_sdv_model(request):
    model_name = request.POST['model_name']
    azure_sql_conn.remove_single_sdv_model(model_name)
    return JsonResponse({"message": "Record removed successfully."})


@csrf_exempt
def remove_relational_sdv_model(request):
    model_name = request.POST['model_name']
    azure_sql_conn.remove_relational_sdv_model(model_name)
    return JsonResponse({"message": "Record removed successfully."})


@csrf_exempt
def get_cloudtype_details(request):
    cloudtype_details = azure_sql_conn.get_cloudtype_details()
    return HttpResponse(json.dumps(cloudtype_details), content_type="application/json")


@csrf_exempt
def get_cloudservicetype_details(request):
    request_data = request.POST['req_data']
    request_data_json = json.loads(request_data)
    cloud_type = request_data_json['cloud_type']
    cloudservicetype_details = azure_sql_conn.get_cloudservicetype_details(cloud_type)
    return HttpResponse(json.dumps(cloudservicetype_details), content_type="application/json")


@csrf_exempt
def column_list(request):
    file_path = request.POST['file_path']
    print("file_path")
    print(file_path)
    response = {}
    key_list = []
    if file_path.endswith(".csv"):
        file_content = pd.read_csv(file_path)
    elif file_path.endswith(".json"):
        file_content = pd.read_json(file_path)
    else:
        raise ValueError("Invalid train file format")

    columns = list(file_content.columns)
    # json_data = json.loads(file_content)
    # print(json_data)
    for key in columns:
        key_list.append(key)
    print(key_list)
    response['json_key_list'] = key_list
    return HttpResponse(json.dumps(response), content_type="application/json")


def create_constraints(columnFormulas):
    # create dynamic scripts - started from here
    constraints_value = '\tconstraints = ['
    column_formula_value = ''
    column_formula_calc_value = ''
    import_value = '\tfrom sdv.constraints import ColumnFormula \n'
    import_value += '\timport pandas as pd \n'
    import_value += '\tfrom datetime import datetime \n\n'
    final_constraints_code = ''
    print(len(columnFormulas))
    if len(columnFormulas) == 0:
        constraints_value += ']'
        # # write dynamic scripts into output.py
        # f = open(os.path.join(sdv_path, 'constraints_data.txt'), 'w')
        # f.write(constraints_value)
        # f.close()
    else:
        for i in range(len(columnFormulas)):
            print(columnFormulas[i]['columnName'])
            print(columnFormulas[i]['Formula'])
            constraints_value += columnFormulas[i]['columnName'] + '_constraints,'

            column_formula_value += '\t' + columnFormulas[i]['columnName'] + '_constraints = ColumnFormula(column =\'' + \
                                    columnFormulas[i][
                                        'columnName'] + '\', formula = ' + columnFormulas[i][
                                        'columnName'] + '_constraints_ColumnFormula, handling_strategy = \'transform\')'
            column_formula_value += '\n\n'

            final_formula = columnFormulas[i]['Formula']
            # print(final_formula)
            column_formula_calc_value += '\tdef ' + columnFormulas[i][
                'columnName'] + '_constraints_ColumnFormula(data):'
            column_formula_calc_value += '\n\t\t return ' + final_formula
            column_formula_calc_value += '\n\n'

        if constraints_value.endswith(','):
            constraints_value = constraints_value.rstrip(constraints_value[-1])
            constraints_value += ']'
        else:
            constraints_value += ']'

        # print(column_formula_calc_value)
        # print(column_formula_value)
        # print(constraints_value)

        # create dynamic scripts - ended from here

    # create Final Constraints scripts - started from here
    final_constraints_code += 'def return_constraints():\n'
    final_constraints_code += import_value + '\n'
    final_constraints_code += column_formula_calc_value + '\n'
    final_constraints_code += column_formula_value + '\n'
    final_constraints_code += constraints_value + '\n'
    final_constraints_code += '\treturn constraints \n'
    final_constraints_code += 'return_constraints()'
    # create Final Constraints scripts - Ended from here

    # write dynamic scripts into output.py
    f = open(os.path.join(sdv_path, 'constraints_data.txt'), 'w')
    f.write(final_constraints_code)
    f.close()

@csrf_exempt
def progress_bar(request):
    model_name = request.GET.get('model_name')
    with open('model_name.txt') as f:
    # with open('model_name.txt') as f:
        lines = f.readlines()
    return JsonResponse({"data":lines})





