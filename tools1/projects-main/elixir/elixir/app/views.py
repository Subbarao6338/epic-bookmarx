# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""
import glob
import os
import subprocess
from _csv import reader
from os import listdir
from os.path import basename
from threading import Thread
from zipfile import ZipFile
import calendar
import time

import jpype
from django.contrib.auth.decorators import login_required
import requests
from django.core.files.storage import FileSystemStorage

from django.shortcuts import render, get_object_or_404, redirect
from django.template import loader
from django.http import HttpResponse, Http404
from django import template
import json
import re
import csv
from datetime import datetime
import pandas as pd
import random
import math

# @login_required(login_url="/login/")
from django.views.decorators.csrf import csrf_exempt
from fpdf import FPDF

from Utility import ConnectionUtility
from Utility.ConnectionUtility import update_deeplearning_taskstatus
from Utility.Deep_Learning_Utility import generate_log_pdf_json, predict_log_features
from Utility.request_parser import save_regex_generator_task, create_regex_formatted_json, save_regex_task, \
    save_uploaded_log_lines, get_total_log_records_count, get_log_data_with_paging, get_log_record, insert_tag_list, \
    get_tag_list, insert_highlighted_data, get_log_line_highlighted_data, create_regex_generation_json, \
    get_sequence_number, insert_highlighted_data_markall, update_highlight_status_markall, get_task_detail_by_name, \
    get_training_type, read_csv_data, insert_update_configuration, get_regex_pattern_list, delete_task_from_database, \
    delete_validation_task_from_database, create_user_defined_formats, delete_highlighted_data, \
    delete_tag_and_highlighted_data, get_total_log_records, update_highlight_status_markall_basedtagselection, \
    read_log_files, upload_log_files_and_save, generate_regex_generation_process, generate_regex_generation_process_old, \
    view_task_details_list, insert_selection_data, get_total_index_based_marked_data, start_log_validation_process, \
    get_list_task, get_word_based_marked_data, get_tag_based_marked_data, get_configuration_details, \
    get_reverse_word_position_based_marked_data, upload_aws_pem_file, check_environment_for_java, \
    get_user_defined_format_info, insert_user_defined_selected_format_info, update_user_defined_selected_format_info
import codecs


def index(request):
    return render(request, "index.html")


def task_list_page(request):
    return render(request, "activitylist.html")


def create_edit_task_page(request):
    return render(request, "home.html")


# @login_required(login_url="/login/")
def pages(request):
    context = {}
    # All resource paths end in .html.
    # Pick out the html file name from the url. And load that template.
    try:
        load_template = request.path.split('/')[-1]
        html_template = loader.get_template(load_template)
        return HttpResponse(html_template.render(context, request))

    except template.TemplateDoesNotExist:
        html_template = loader.get_template('page-404.html')
        return HttpResponse(html_template.render(context, request))

    except:
        html_template = loader.get_template('page-500.html')
        return HttpResponse(html_template.render(context, request))


def view_logpage(request):
    return render(request, "home.html")


def read_logfiles(request):
    filename = request.GET.get("filename")
    separator = request.GET.get("delimiter")
    separator = codecs.decode(separator, 'unicode_escape')
    input_lines = read_log_files(filename, separator)
    return HttpResponse(json.dumps(input_lines), content_type="application/json")


@csrf_exempt
def upload_log_files(request):
    request_data = request.POST['req_data']
    xml_files = request.FILES.getlist('log_files[]')
    save_task_resp = save_regex_task(request_data)
    th = Thread(target=upload_log_files_and_save, args=(save_task_resp, request_data, xml_files))
    th.start()
    th.join()
    # upload_log_files_and_save(save_task_resp, request_data, xml_files)
    return HttpResponse(json.dumps("Task Created Successfully. Now Create TAG and Mark Log data to Generate Regex."),
                        content_type="application/json")


def obj_dict(obj):
    return obj.__dict__


class Object:
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)


@csrf_exempt
def generate_regex(request_json, task_name):
    response_text = generate_regex_generation_process(request_json, task_name)
    return HttpResponse(json.dumps(response_text), content_type="application/json")


@csrf_exempt
def generateregex(request_json, task_name_param):
    response_text = generate_regex_generation_process_old(request_json, task_name_param)
    return HttpResponse(json.dumps(response_text), content_type="application/json")


def getexecutionlog(request):
    task_name = request.GET.get("task_name")
    exec_log = ConnectionUtility.getExecLog(task_name)
    return HttpResponse(json.dumps(exec_log), content_type="application/json")


def getresults_api(request):
    task_name = request.GET.get("task_name")
    exec_result = ConnectionUtility.getresults(task_name)
    return HttpResponse(json.dumps(exec_result), content_type="application/json")


def obj_dict(obj):
    return obj.__dict__


class Object:
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)


def view_task_details(request):
    json_result = view_task_details_list()
    return HttpResponse(json_result, content_type="application/json")


@csrf_exempt
def insert_selection(request):
    request_data = request.POST['req_data']
    response = insert_selection_data(request_data)
    return HttpResponse(json.dumps(response), content_type="application/json")


@csrf_exempt
def save_regex_generation_task(request):
    request_data = request.POST['req_data']
    request_json_obj = json.loads(request_data)
    save_task_resp = save_regex_task(request_data)
    if save_task_resp == True:
        background_thread = Thread(target=generate_regex, args=(request_json_obj,))
        background_thread.start()
        save_regex_generator_task(request_data)
    return HttpResponse(json.dumps([{"Status": "Success", "Message": "Task Submitted Successfully"}]),
                        content_type="application/json")


def get_total_records_count(request):
    task_name = request.GET.get("task_name")
    record_count = get_total_log_records_count(task_name)
    return HttpResponse(json.dumps(record_count), content_type="application/json")


def get_log_data(request):
    task_name = request.GET.get("task_name")
    page_number = request.GET.get("page_number")
    total_records = request.GET.get("records_per_page")
    list_records = get_log_data_with_paging(task_name, page_number, total_records)
    return HttpResponse(json.dumps(list_records), content_type="application/json")


def get_log_record_by_id(request):
    task_name = request.GET.get("task_name")
    line_number = request.GET.get("log_line_no")
    log_record = get_log_record(task_name, line_number)
    return HttpResponse(json.dumps(log_record), content_type="application/json")


@csrf_exempt
def save_tag_data_of_task(request):
    request_data = request.POST['req_data']
    insert_tag_list(request_data)
    return HttpResponse(json.dumps('success'), content_type="application/json")


def get_tag_data(request):
    task_name = request.GET.get("task_name")
    tag_list = get_tag_list(task_name)
    return HttpResponse(json.dumps(tag_list), content_type="application/json")


@csrf_exempt
def save_highlighted_of_task(request):
    request_data = request.POST['req_data']
    insert_highlighted_data(request_data)
    return HttpResponse(json.dumps('success'), content_type="application/json")


def get_highlighted_data(request):
    task_name = request.GET.get("task_name")
    line_number = request.GET.get("log_line_no")
    list_data = get_log_line_highlighted_data(task_name, line_number)
    return HttpResponse(json.dumps(list_data), content_type="application/json")


def start_regex_generation_for_task(request):
    task_name = request.GET.get("task_name")
    training_type = json.loads(get_training_type(task_name))
    if training_type[0]['training_type'] == 'Regular Expression':
        update_deeplearning_taskstatus(task_name, "In-Progress")
        regex_request_json = create_regex_generation_json(task_name)
        background_thread = Thread(target=generate_regex, args=(regex_request_json, task_name,))
        background_thread.start()
        response = "Regex Generation Started Successfully."
    else:
        config_done = ConnectionUtility.is_configuration_done()
        if config_done:
            background_thread = Thread(target=generate_log_pdf_json, args=(task_name,))
            background_thread.start()
            response = "Model Training Started Successfully."
        else:
            response = "Configuration detail not exist. Please enter the configuration detail using Configuration page."
    return HttpResponse(json.dumps(response), content_type="application/json")


def get_log_line_numbers(request):
    task_name = request.GET.get("task_name")
    list_log_numbers = get_sequence_number(task_name)
    return HttpResponse(json.dumps(list_log_numbers), content_type="application/json")


def word_based_position_marking(request):
    list_data_req_obj = []
    marked_records = []
    task_name = request.GET.get("task_name")
    request_json_obj = json.loads(request.GET.get('wordPositionMarkingInfo'))
    task_records = get_total_log_records(task_name)
    for log_record in task_records:
        log_line_no = log_record[0]
        log_line_data = log_record[1]
        final_log_record = log_line_data.replace('\n', '')

        for x in range(0, len(request_json_obj)):
            start_word_index = request_json_obj[x]['startWordIndex']
            end_word_index = request_json_obj[x]['endWordIndex']
            tag_label = request_json_obj[x]['tagLabel']
            tag_ID = request_json_obj[x]['tagID']

            selected_start_index = int(start_word_index)
            selected_end_index = int(end_word_index)
            # print(selected_end_index)
            s_line = str(final_log_record).split()
            selected_word = s_line[selected_start_index:selected_end_index]
            if len(s_line) < int(end_word_index):
                selected_word = ""
            else:
                final_selected_text = ' '.join(selected_word)
                start_word_index_number = final_log_record.index(final_selected_text)
                length_of_string = len(final_selected_text)
                end_word_index_number = (start_word_index_number + length_of_string) - 1
                # print(end_word_index_number)
                if end_word_index_number == -1:
                    start_word_index_number = -1
                    end_word_index_number = -1

                tag_selection_obj = (
                    task_name,
                    log_line_no,
                    tag_ID,
                    tag_label,
                    final_selected_text,
                    start_word_index_number,
                    end_word_index_number)
                # print('######################################')
                # print(tag_selection_obj)
                marked_records.append(log_line_no)
                # print(marked_records)
                list_data_req_obj.append(tag_selection_obj)

    result = insert_highlighted_data_markall(list_data_req_obj)
    print(result)
    if result:
        update_highlight_status_markall_basedtagselection(task_name)
    return HttpResponse(json.dumps(marked_records), content_type="application/json")


def index_based_position_marking(request):
    task_name = request.GET.get("task_name")
    request_json_obj = json.loads(request.GET.get('indexPositionMarkingInfo'))
    marked_records = get_total_index_based_marked_data(task_name, request_json_obj)
    return HttpResponse(json.dumps(marked_records), content_type="application/json")


def logvalidation(request):
    return render(request, "logvalidation.html")


@csrf_exempt
def upload_logvalidation_files(request):
    uploaded_files = request.FILES.getlist('log_files[]')
    fs = FileSystemStorage(location='uploaded_logval_files/')
    gmt = time.gmtime()
    random_str = calendar.timegm(gmt)
    for file in uploaded_files:
        fname = file.name.split(".")
        upload_filename = fname[0] + "_" + str(random_str) + "." + fname[1]
        fs.save(upload_filename, file)
    return HttpResponse(json.dumps([{"FileName": file.name, "Uploaded_filename": upload_filename}]),
                        content_type="application/json")


@csrf_exempt
def save_task_dtl(request):
    request_data = request.POST['req_data']
    data = json.loads(request_data)
    object_data = data["data"]
    now = datetime.now()
    dt_string = now.strftime("%Y-%m-%d %H:%M:%S")
    filename = object_data["filename"]
    taskname = object_data["taskname"]
    tagnames = object_data["tagnames"]
    regexexpr = object_data["regexexpr"]
    status = object_data["status"]
    tasktype = object_data["tasktype"]
    selected_task_name = object_data["sel_task_name"]
    result_type = object_data["result_type"]
    log_delimiter = object_data["log_delimeter"]
    response = ConnectionUtility.save_logval_taskdtl(dt_string, filename, taskname, tagnames, regexexpr, status,
                                                     tasktype, selected_task_name, result_type, log_delimiter)
    return HttpResponse(
        json.dumps([{"Status": "Success", "Message": "Validation Task created successfully", "Result": response}]),
        content_type="application/json")


def read_task_dtl(request):
    res = ConnectionUtility.read_logval_taskdtl()
    print("RES---->", res)
    res = json.loads(json.dumps(res))
    print("RES_AFTER---->", res)
    return HttpResponse(json.dumps([{"Result": res}]), content_type="application/json")


pattern_lst = []


def read_logval_files(request):
    filename = request.GET.get("filename")
    tagnames = request.GET.get("tagnames")
    taskid = request.GET.get("taskid")
    start_log_validation_process(filename, tagnames, taskid)
    return HttpResponse(
        json.dumps([{"Status": "Success", "Message": "Log Validation Completed."}]), content_type="application/json")


@csrf_exempt
def update_task_status(request):
    taskid = request.POST["taskid"]
    status = request.POST["status"]
    res = ConnectionUtility.update_task_status(taskid, status)
    return HttpResponse(json.dumps([{"Status": "Success", "Message": "Status Updated", "Result": res}]),
                        content_type="application/json")


def get_task_list(request):
    json_result = get_list_task()
    return HttpResponse(json_result, content_type="application/json")


def single_word_based_position_marking(request):
    task_name = request.GET.get("task_name")
    request_json_obj = json.loads(request.GET.get('singleWordPositionMarkingInfo'))
    marked_records = get_word_based_marked_data(task_name, request_json_obj)
    return HttpResponse(json.dumps(marked_records), content_type="application/json")


def get_task_detail(request):
    task_name = request.GET.get("task_name")
    task_detail = get_task_detail_by_name(task_name)
    return HttpResponse(json.dumps(task_detail), content_type="application/json")


def tag_based_position_marking(request):
    task_name = request.GET.get("task_name")
    request_json_obj = json.loads(request.GET.get('tagPositionMarkingInfo'))
    marked_records = get_tag_based_marked_data(task_name, request_json_obj)
    return HttpResponse(json.dumps(marked_records), content_type="application/json")


def get_ml_models(request):
    task_name = request.GET.get("task_name")
    model_dir = 'DeepLearning_Model/' + task_name + '/'
    print(os.listdir(model_dir))
    return HttpResponse(json.dumps(os.listdir(model_dir)), content_type="application/json")


def download_ml_model(request):
    task_name = request.GET.get("task_name")
    tag_name = request.GET.get("tag_name")
    cwdPath = os.path.abspath(os.getcwd())
    result_path = os.path.join(cwdPath, "DeepLearning_Model")
    dir_name = os.path.join(result_path, task_name, tag_name)
    file_name = tag_name + '.zip'
    with ZipFile(file_name, 'w') as zipObj:
        for folderName, subfolders, filenames in os.walk(dir_name):
            for filename in filenames:
                filePath = os.path.join(folderName, filename)
                print(filePath)
                zipObj.write(filePath, basename(filePath))
    response = HttpResponse(open(file_name, 'rb'), content_type='application/zip')
    response['Content-Disposition'] = 'attachment; filename=%s' % file_name
    return response


def get_validation_result(request):
    file_name = request.GET.get("file_name")
    csv_data = read_csv_data(file_name)
    return HttpResponse(csv_data, content_type="application/json")


def configuration(request):
    return render(request, "configuration.html")


@csrf_exempt
def save_configuration_detail(request):
    request_data = request.POST['req_data']
    response = insert_update_configuration(request_data)
    if response:
        return HttpResponse(json.dumps("Configuration saved successfully."),
                            content_type="application/json")
    else:
        return HttpResponse(json.dumps("Error occurred while saving the configuration."),
                            content_type="application/json")


def get_config_details(request):
    json_result = get_configuration_details()
    return HttpResponse(json_result, content_type="application/json")


def delete_task(request):
    task_name = request.GET.get("task_name")
    delete_task_from_database(task_name)
    return HttpResponse(json.dumps("Task Deleted Successfully."), content_type="application/json")


def delete_validation_task(request):
    task_id = request.GET.get("task_id")
    delete_validation_task_from_database(task_id)
    return HttpResponse(json.dumps("Validation Task Deleted Successfully."), content_type="application/json")


def user_defined_formats_marking(request):
    request_json_obj = request.GET.get('predefined_tag_values_info')
    result_data = create_user_defined_formats(request_json_obj)
    return HttpResponse(json.dumps(result_data), content_type="application/json")


def remove_highlight_data(request):
    task_name = request.GET.get("task_name")
    tag_id = request.GET.get("tag_id")
    line_no = request.GET.get("line_no")
    delete_highlighted_data(task_name, tag_id, line_no)
    return HttpResponse(json.dumps("Highlighted Data Removed Successfully."), content_type="application/json")


def delete_tag_data(request):
    task_name = request.GET.get("task_name")
    tag_id = request.GET.get("tag_id")
    tag_name = request.GET.get("tag_name")
    delete_tag_and_highlighted_data(task_name, tag_id, tag_name)
    return HttpResponse(json.dumps("Tag and Highlighted Data Removed Successfully."), content_type="application/json")


def reverse_single_word_based_position_marking(request):
    task_name = request.GET.get("task_name")
    request_json_obj = json.loads(request.GET.get('reverseSingleWordPositionMarkingInfo'))
    marked_records = get_reverse_word_position_based_marked_data(task_name, request_json_obj)
    return HttpResponse(json.dumps(marked_records), content_type="application/json")


@csrf_exempt
def upload_pemfile(request):
    uploaded_files = request.FILES.getlist('pem_files[]')
    file_name = upload_aws_pem_file(uploaded_files)
    return HttpResponse(json.dumps([{"FileName": file_name}]), content_type="application/json")


def download_validation_result(request):
    file_name = request.GET.get('file_name')
    cwdPath = os.path.abspath(os.getcwd())
    result_path = os.path.join(cwdPath, "OutputCSV")
    file_path = os.path.join(result_path, file_name)
    if os.path.exists(file_path):
        with open(file_path, 'rb') as fh:
            response = HttpResponse(fh.read(), content_type="application/vnd.ms-excel")
            response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
            return response
    raise Http404


def check_java_path_variable(request):
    response = check_environment_for_java()
    return HttpResponse(json.dumps(response), content_type="application/json")


def user_defined_format_selected_info(request):
    request_json_obj = request.GET.get('userDefinedFormatInfo')
    user_defined_format_result_data = get_user_defined_format_info(request_json_obj)
    return HttpResponse(json.dumps(user_defined_format_result_data), content_type="application/json")


def insert_user_defined_format_info(request):
    request_json_obj = request.GET.get('insert_user_defined_format')
    result_data = insert_user_defined_selected_format_info(request_json_obj)
    return HttpResponse(json.dumps(result_data), content_type="application/json")


def update_user_defined_format_info(request):
    request_json_obj = request.GET.get('update_user_defined_format')
    result_data = update_user_defined_selected_format_info(request_json_obj)
    return HttpResponse(json.dumps(result_data), content_type="application/json")
