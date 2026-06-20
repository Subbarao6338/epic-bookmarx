import codecs
import csv
import glob
import json
import os
import re
from _csv import reader
from os import listdir

import jpype
import pandas as pd
import requests
from django.core.files.storage import FileSystemStorage
from fpdf import FPDF
import configparser

from Utility import ConnectionUtility
from Utility.ConnectionUtility import insert_highlighted_values, update_log_file_for_task, insert_regex_task, \
    insert_uploaded_log_data, log_data_count_by_task_name, get_records_of_uploaded_log, get_log_record_by_id, \
    insert_tag_data, get_tag_list_by_task_name, update_for_marked_log_data, get_log_line_highlighted_data_by_task, \
    get_highlighted_data_list_task, get_sequence_number_by_task, get_task_detail_by_task_name, \
    get_training_type_by_task_name, insert_configuration_data, get_validation_task_detail, getresults, \
    delete_task_by_name, delete_validation_task_by_id, update_tag_data_user_defined_format, \
    get_non_predefined_tag_list_by_task_name, delete_highlighted_data_by_tag, delete_highlighted_data_and_tag_data, \
    log_datas_by_task_name, update_for_marked_log_data_basedtagselection, update_deeplearning_taskstatus, \
    getUserDefinedValuesInfo, insert_user_defined_format_data, update_user_defined_format_data

from Utility.Deep_Learning_Utility import predict_log_features

cwdPath = os.path.abspath(os.getcwd())
uploaded_filesDir = os.path.join(cwdPath, "uploaded_files")
OutputCSVDir = os.path.join(cwdPath, "OutputCSV")
uploaded_logval_filesDir = os.path.join(cwdPath, "uploaded_logval_files")
test_dataDir = os.path.join(cwdPath, "test_data")
DeepLearning_ModelDir = os.path.join(cwdPath, "DeepLearning_Model")
UtilityDir = os.path.join(cwdPath, "Utility")

if not os.path.isdir(uploaded_filesDir):
    os.makedirs(uploaded_filesDir)

if not os.path.isdir(OutputCSVDir):
    os.makedirs(OutputCSVDir)

if not os.path.isdir(uploaded_logval_filesDir):
    os.makedirs(uploaded_logval_filesDir)

if not os.path.isdir(test_dataDir):
    os.makedirs(test_dataDir)

if not os.path.isdir(DeepLearning_ModelDir):
    os.makedirs(DeepLearning_ModelDir)

if not os.path.isdir(UtilityDir):
    os.makedirs(UtilityDir)

print(cwdPath)

config_path = os.path.join(cwdPath, "config")
config_parser = configparser.ConfigParser()
config_parser.read(os.path.join(config_path, "regexpath.ini"))

def save_regex_generator_task(req_json):
    req_obj = json.loads(req_json)
    task_name = req_obj["task_name"]
    print("log file updating")
    list_row_data = req_obj["highlighted_data"]
    for row_tag_data in list_row_data:
        tag_selection_obj = (
            task_name, row_tag_data["logfile_line"], row_tag_data["tag_name"],
            row_tag_data["selectedText"],
            row_tag_data["text_start"], row_tag_data["text_end"])
        insert_highlighted_values(tag_selection_obj)
    return 'Success'


def obj_dict(obj):
    return obj.__dict__


class Object:
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)


def create_regex_formatted_json(request_data):
    json_obj = Object()
    request_data_json = json.loads(request_data)
    tag_data_list = request_data_json["tag_data"]
    highlighted_data_list = request_data_json["highlighted_data"]
    json_obj.datasetString = {}
    json_obj.taskname = request_data_json["task_name"]
    for tag in tag_data_list:
        json_obj.datasetString[tag] = Object()
        json_obj.datasetString[tag].examples = []
        tag_specific_list = [x for x in highlighted_data_list if x["tag_name"] == tag]
        for tag_data in tag_specific_list:
            tag_obj = Object()
            tag_obj.string = tag_data["logfile_data"].replace('\n', '')
            tag_obj.match = []
            match_obj = Object()
            match_obj.start = tag_data["text_start"]
            match_obj.end = tag_data["text_end"]
            tag_obj.match.append(match_obj)
            json_obj.datasetString[tag].examples.append(tag_obj)
    regex_json = json.dumps(json_obj, default=obj_dict)
    return regex_json


def create_regex_generation_json(task_name):
    json_obj = Object()
    # request_data_json = json.loads(request_data)
    tag_data_list = json.loads(get_non_predefined_tag_list(task_name))
    highlighted_data_list = json.loads(get_highlighted_data_list_task(task_name))
    json_obj.datasetString = {}
    json_obj.taskname = task_name
    json_formatted_pattern = ConnectionUtility.getJSONFormat(task_name)
    json_obj.userdefinedPatterns = json_formatted_pattern
    for tag in tag_data_list:
        json_obj.datasetString[tag['tag_name']] = Object()
        json_obj.datasetString[tag['tag_name']].examples = []
        tag_specific_list = [x for x in highlighted_data_list if x["tag_name"] == tag['tag_name']]
        for tag_data in tag_specific_list:
            tag_obj = Object()
            # tag_obj.string = tag_data["log_data"].replace('\n', '')
            tag_obj.string = tag_data["log_data"]
            tag_obj.match = []
            match_obj = Object()
            match_obj.start = tag_data["text_start"]
            match_obj.end = tag_data["text_end"]
            tag_obj.match.append(match_obj)
            json_obj.datasetString[tag['tag_name']].examples.append(tag_obj)
    regex_json = json.dumps(json_obj, default=obj_dict)
    return regex_json


def save_regex_task(req_data):
    request_json_obj = json.loads(req_data)
    task_name = request_json_obj["task_name"]
    task_desc = request_json_obj["task_desc"]
    log_file_name = request_json_obj["log_file_name"]
    log_delimiter = request_json_obj["log_delimiter"]
    training_type = request_json_obj["training_type"]
    if task_desc == "":
        task_desc = task_name
    req_obj = (task_name, task_desc, log_file_name, log_delimiter, 'Loading', training_type, '')
    insert_regex_task(req_obj)
    return True


def save_uploaded_log_lines(input_lines, task_name):
    list_data = []
    i = 0
    for log in input_lines:
        req_obj = (i + 1, task_name, log, 0)
        list_data.append(req_obj)
        i = i + 1
    insert_uploaded_log_data(list_data)
    return True


def get_total_log_records_count(task_name):
    return log_data_count_by_task_name(task_name)


def get_log_data_with_paging(task_name, page_number, total_records):
    return get_records_of_uploaded_log(task_name, page_number, total_records)


def get_log_record(task_name, line_number):
    return get_log_record_by_id(task_name, line_number)


def insert_tag_list(req_data):
    print(req_data)
    list_tag_obj = []
    request_json_obj = json.loads(req_data)
    task_name = request_json_obj["task_name"]
    is_predefined = request_json_obj["is_predefined"]
    # predefined_tag_json_format = request_json_obj["predefined_tag_json_format"]
    tag_list = request_json_obj["tag_values"]
    for tag in tag_list:
        req_obj = (tag, task_name, is_predefined)
        list_tag_obj.append(req_obj)
    insert_tag_data(list_tag_obj)
    return True


def get_tag_list(task_name):
    return get_tag_list_by_task_name(task_name)


def insert_highlighted_data(req_json):
    req_obj = json.loads(req_json)
    list_row_data = req_obj["list_data"]
    list_data_req_obj = []
    task_name = list_row_data[0]["task_name"]
    line_number = list_row_data[0]["logfile_line"]
    for row_tag_data in list_row_data:
        tag_selection_obj = (
            row_tag_data["task_name"],
            row_tag_data["logfile_line"],
            row_tag_data["tag_id"],
            row_tag_data["tag_name"],
            row_tag_data["selectedText"],
            row_tag_data["text_start"],
            row_tag_data["text_end"])
        print(tag_selection_obj)
        list_data_req_obj.append(tag_selection_obj)
    result = insert_highlighted_values(list_data_req_obj)
    if result:
        update_for_marked_log_data(task_name, line_number)
    return True


def get_log_line_highlighted_data(task_name, line_number):
    return get_log_line_highlighted_data_by_task(task_name, line_number)


def get_sequence_number(task_name):
    return get_sequence_number_by_task(task_name)


def insert_highlighted_data_markall(list_data_req_obj):
    result = insert_highlighted_values(list_data_req_obj)
    return result


def update_highlight_status_markall(task_name, line_no):
    update_for_marked_log_data(task_name, line_no)
    return True


def get_task_detail_by_name(task_name):
    return get_task_detail_by_task_name(task_name)


def get_training_type(task_name):
    return get_training_type_by_task_name(task_name)


def read_csv_data(file_name):
    csv_file_name = file_name.split(".")[0]
    csv_data_list = []
    print(OutputCSVDir)
    csv_file_path = os.path.join(OutputCSVDir, csv_file_name + '.csv')
    with open(csv_file_path, encoding='utf-8') as csvf:
        csv_reader = csv.DictReader(csvf)
        for rows in csv_reader:
            csv_data_list.append(rows)
    return json.dumps(csv_data_list)


def insert_update_configuration(req_data):
    response = ConnectionUtility.insert_update_configuration_detail(req_data)
    return response


def get_regex_pattern_list(validation_task_id):
    validation_task_detail = json.loads(get_validation_task_detail(validation_task_id))[0]
    pattern_list = []
    if validation_task_detail["selected_task_name"] == "":
        patterns = validation_task_detail["RegExValue"]
        pattern_list = patterns.split("\n")
    else:
        result_json = json.loads(getresults(validation_task_detail["selected_task_name"]))["result"]
        for json_item in json.loads(result_json):
            for key in json_item:
                pattern_list.append(str(json_item[key]["solutionJS"]))
    return pattern_list


def create_user_defined_formats(request_json_obj):
    request_obj = json.loads(request_json_obj)
    task_name = request_obj[0]['task_name']
    tag_name = request_obj[0]['userDefinedTagName']
    predefined_tag_type_value = request_obj[0]['predefined_tag_type_value']
    predefined_date_format_value = request_obj[0]['predefined_date_format_value']
    predefined_string_start_value = request_obj[0]['predefined_string_start_value']
    predefined_string_end_value = request_obj[0]['predefined_string_end_value']
    is_predefined = request_obj[0]['is_predefined']

    strValueJsonFormat = create_json_format(tag_name, predefined_tag_type_value, predefined_date_format_value,
                                            predefined_string_start_value,
                                            predefined_string_end_value)

    result = update_tag_data_user_defined_format(task_name, tag_name, is_predefined, strValueJsonFormat)
    if result:
        result_data = "Successfully Updated"
    return result_data


def create_json_format(tag_name, predefined_tag_type_value, predefined_date_format_value, predefined_string_start_value,
                       predefined_string_end_value):
    predefined_tag_json_format = {}
    if predefined_tag_type_value != '':
        if predefined_tag_type_value == 'Date':
            predefined_tag_json_date_format = {"type": predefined_tag_type_value, "value": predefined_date_format_value}
            predefined_tag_json_format[tag_name] = predefined_tag_json_date_format
            print(predefined_tag_json_format)
            strValueJsonFormat = json.dumps(predefined_tag_json_format)
        elif predefined_tag_type_value == 'String':
            predefined_tag_json_string_format = {"type": predefined_tag_type_value,
                                                 "value": {"start": predefined_string_start_value,
                                                           "end": predefined_string_end_value}}
            predefined_tag_json_format[tag_name] = predefined_tag_json_string_format
            print(predefined_tag_json_format)
            strValueJsonFormat = json.dumps(predefined_tag_json_format)
        else:
            predefined_tag_json_logtype_format = {"type": predefined_tag_type_value,
                                                  "value": ""}
            predefined_tag_json_format[tag_name] = predefined_tag_json_logtype_format
            print(predefined_tag_json_format)
            strValueJsonFormat = json.dumps(predefined_tag_json_format)

        return strValueJsonFormat


def get_non_predefined_tag_list(task_name):
    return get_non_predefined_tag_list_by_task_name(task_name)


def delete_task_from_database(task_name):
    return delete_task_by_name(task_name)


def delete_validation_task_from_database(task_id):
    return delete_validation_task_by_id(task_id)


def delete_highlighted_data(task_name, tag_id, line_no):
    return delete_highlighted_data_by_tag(task_name, tag_id, line_no)


def delete_tag_and_highlighted_data(task_name, tag_id, tag_name):
    return delete_highlighted_data_and_tag_data(task_name, tag_id, tag_name)


def get_total_log_records(task_name):
    return log_datas_by_task_name(task_name)


def update_highlight_status_markall_basedtagselection(task_name):
    update_for_marked_log_data_basedtagselection(task_name)
    return True


def read_log_files(filename, separator):
    file1 = open(os.path.join(uploaded_filesDir, filename), 'r')
    if separator != "":
        print('"' + separator + '"')
        Lines = file1.read()
        # separator = separator.replace("\\n", "\n")
        sLine = str(Lines).split(separator)
        inputLines = sLine
    else:
        Lines = file1.readlines()
        print("INside else")
        inputLines = Lines
    file1.close()
    return inputLines


def remove_uploaded_file(file_path):
    if os.path.exists(file_path):
        os.remove(file_path)


def upload_log_files_and_save(save_task_resp, request_data, xml_files):
    print('##################### Start ####################')

    request_json_obj = json.loads(request_data)
    separator = request_json_obj["log_delimiter"]
    task_name = request_json_obj["task_name"]
    separator = codecs.decode(separator, 'unicode_escape')
    fs = FileSystemStorage(location=uploaded_filesDir)
    file_name = ""
    input_lines = []
    for file in xml_files:
        # file_name = file.name
        file_name = task_name + '_' + file.name
        fs.save(file_name, file)

        file_path = os.path.join(uploaded_filesDir, file_name)
        file_extension = file_name.rsplit(".", 1)[1]

        if save_task_resp:
            if file_extension == 'csv':
                with open(file_path, 'r', encoding='utf-8') as read_obj:
                    csv_reader = reader(read_obj)
                    for row in csv_reader:
                        string = " ".join(row).replace('"', '\'')
                        if string != "":
                            input_lines.append(string)
            else:
                file1 = open(file_path, 'r')
                if separator != "":
                    print('"' + separator + '"')
                    lines = file1.read()
                    print(lines)
                    s_line = str(lines).split(separator)
                    # input_lines = s_line
                    for log in s_line:
                        # input_lines.append(s_line)
                        if log != "":
                            input_lines.append(log)
                else:
                    lines = file1.readlines()
                    # input_lines = lines
                    for log in lines:
                        # input_lines.append(lines)
                        if log != "":
                            input_lines.append(log)
                file1.close()
    save_uploaded_log_lines(input_lines, task_name)
    isUpdate = ConnectionUtility.update_is_process(task_name)
    for file in xml_files:
        # file_name = file.name
        file_name = task_name + '_' + file.name
        file_path = os.path.join(uploaded_filesDir, file_name)
        remove_uploaded_file(file_path)
    print('##################### End ####################')
    return True


def generate_regex_generation_process_backup(request_json, task_name):
    jvmPath = jpype.getDefaultJVMPath()
    # jvmPath = r'C:\Program Files\Java\jre1.8.0_261\bin\server\jvm.dll'
    # print(jvmPath)
    # jarPath = os.path.join(os.path.abspath('.'),
    #                        "python/Lib/site-packages/elixir/core/static/assets/jar/rgpmain_final.jar")
    jarPath = os.path.join(os.path.abspath('.'),
                           "core/static/assets/jar/newJar.jar")
    if not jpype.isJVMStarted():
        jpype.startJVM(jvmPath, "-ea", "-Djava.class.path=%s" % jarPath)
    JDClass = jpype.JClass("com.hcl.controller.RegexGenMain").main([request_json])
    # jpype.shutdownJVM()
    # subprocess.Popen(['java', '-cp', 'core/static/assets/jar/rgpmain_final.jar', 'com.hcl.controller.RegexGenMain', request_json])
    update_deeplearning_taskstatus(task_name, "Completed")
    return 'Success'

def generate_regex_generation_process(request_json, task_name):
    host = str(config_parser.get("regexpath", "host"))
    port = str(config_parser.get("regexpath", "port"))
    path = str(config_parser.get("regexpath", "path"))

    url = "http://" + host + ":" + port + "/" + path
    payload = request_json
    # print("PAYLOAD--->",payload)
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests. request("POST", url, headers=headers, data=payload)
    if response.status_code == 200:
        print("Regex generation started." + response.text)
        response_text = 'Success'
    else:
        print("Regex generation execution not started")
        response_text = 'Regex generation execution not started'
    # update_deeplearning_taskstatus(task_name, "Completed")
    return "Success" 

def generate_regex_generation_process_old(request_json, task_name_param):
    url = "http://localhost:8000/ucdpregex/regex/createTask"
    task_name_req_obj = Object()
    task_name_req_obj.taskname = task_name_param
    payload = str(json.dumps(task_name_req_obj, default=obj_dict))
    print(payload)
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    print(response.status_code, " __ ", response.text)
    if response.status_code == 200:
        if response.text.__contains__('successfully'):
            print(response.text)
            url = "http://localhost:8000/ucdpregex/regex/_pattern"
            payload = request_json
            print(payload)
            headers = {
                'Content-Type': 'application/json'
            }

            response = requests.request("POST", url, headers=headers, data=payload)
            if response.status_code == 200:
                print("Regex generation started." + response.text)
                response_text = 'Success'
            else:
                print("Regex generation execution not started")
                response_text = 'Regex generation execution not started'
        else:
            print("Task not created. Reason API issue")
            response_text = 'Task not created. Reason API issue'
    else:
        print("Task not created")
        response_text = 'Task not created'
    return response_text


def view_task_details_list():
    task_list = ConnectionUtility.get_task_list()
    list_obj = json.loads(task_list)
    list_data = list()
    for item in list_obj:
        obj = Object()
        obj.taskname = str(item["taskname"])
        obj.taskDescription = str(item["taskDescription"]).strip()
        obj.status = str(item["status"]).strip()
        obj.training_type = str(item["training_type"]).strip()
        obj.task_CreatedDate = str(item["task_CreatedDate"]).strip()
        obj.task_CompletedOn = str(item["task_CompletedOn"]).strip()
        list_data.append(obj)
    json_result = json.dumps(list_data, default=obj_dict)
    return json_result


def insert_selection_data(request_data):
    y = json.loads(request_data)
    final_values = y["data"]["final_value"]
    for final_value in final_values:
        log_line_no = final_value["data"]["logfile_line"]
        log_line_data = final_value["data"]["logfile_data"]
        tag_name = final_value["data"]["tag_name"]
        text_start = final_value["data"]["text_start"]
        text_end = final_value["data"]["text_end"]
        ConnectionUtility.insert_selected_values(log_line_no, log_line_data, tag_name, text_start, text_end)
    return 'Success'


def get_total_index_based_marked_data(task_name, request_json_obj):
    list_data_req_obj = []
    marked_records = []
    task_records = get_total_log_records(task_name)
    for log_record in task_records:
        log_line_no = log_record[0]
        log_line_data = log_record[1]
        final_log_record = log_line_data.replace('\n', '')
        lengthofString = len(log_line_data)

        for x in range(0, len(request_json_obj)):
            start_Index = request_json_obj[x]['start_Index']
            end_Index = request_json_obj[x]['end_Index']
            tag_label = request_json_obj[x]['tagLabel']
            tag_ID = request_json_obj[x]['tagID']

            start_Index = int(start_Index)
            end_Index = int(end_Index)
            final_selected_text = str(final_log_record)[start_Index:end_Index]
            print(final_selected_text)
            if lengthofString < int(end_Index):
                final_selected_text = ""
            else:

                tag_selection_obj = (
                    task_name,
                    log_line_no,
                    tag_ID,
                    tag_label,
                    final_selected_text,
                    start_Index,
                    end_Index)
                print(tag_selection_obj)
                marked_records.append(log_line_no)
                list_data_req_obj.append(tag_selection_obj)
    result = insert_highlighted_data_markall(list_data_req_obj)
    if result:
        update_highlight_status_markall_basedtagselection(task_name)
    return marked_records


class lst_regexmatch:
    def __init__(self, lineno, matchstring, pattern):
        self.lineno = lineno
        self.matchstring = matchstring
        self.pattern = pattern


def create_pdf_from_log_file(file_name, task_name, log_delimiter):
    test_dataDir = os.path.join(cwdPath, "test_data")
    if not os.path.isdir(test_dataDir):
        os.makedirs(test_dataDir)
    test_data_dir = test_dataDir

    task_file_data = os.path.join(test_data_dir, task_name)
    if not os.path.exists(task_file_data):
        os.mkdir(task_file_data)
    else:
        input_python_files = glob.glob(task_file_data + '//*.pdf')
        for input_python_file in input_python_files:
            os.remove(input_python_file)

    file_extension = file_name.rsplit(".", 1)[1]
    lines = []
    if file_extension == 'csv':
        with open(os.path.join(uploaded_logval_filesDir, file_name), 'r', encoding='utf-8') as read_obj:
            csv_reader = reader(read_obj)
            for row in csv_reader:
                string = " ".join(row).replace('"', '\'')
                lines.append(string)
    else:
        with open(os.path.join(uploaded_logval_filesDir, file_name), 'r') as f:
            log_str = f.read()
            lines = log_str.split(log_delimiter)
    count = 0
    for line in lines:
        count += 1
        pdf = FPDF()
        # Add a page
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.multi_cell(0, 5, txt=line.encode('latin-1', 'ignore').decode('latin-1'))
        pdf.output(task_file_data + '/' + str(count) + ".pdf")
    return True


def start_log_validation_process(filename, tagnames, taskid):
    log_details_json = json.loads(ConnectionUtility.get_log_validation_by_id(taskid))
    base_file_name = filename.split(".")[0]
    result_filename = base_file_name
    log_delimiter = log_details_json[0]["log_delimiter"]
    print("log delimiter>>>", log_delimiter)
    if log_delimiter != "" or log_delimiter != None:
        log_delimiter = codecs.decode(log_delimiter, 'unicode_escape')
    if log_details_json[0]["result_type"] == 'Regular Expression':
        pattern_lst = get_regex_pattern_list(taskid)
        tag_lst = []
        if tagnames != "":
            tag_lst = tagnames.split('\n')
        file_extension = filename.rsplit(".", 1)[1]
        Lines = []
        print(pattern_lst)
        print(tag_lst)
        if file_extension == 'csv':
            with open(os.path.join(uploaded_logval_filesDir, filename), 'r', encoding='utf-8') as read_obj:
                csv_reader = reader(read_obj)
                for row in csv_reader:
                    string = " ".join(row).replace('"', '\'')
                    Lines.append(string)
        else:
            file1 = open(os.path.join(uploaded_logval_filesDir, filename), 'r')
            log_str = file1.read()
            Lines = str(log_str).split(log_delimiter)
            file1.close()
        result = []
        count = 0
        for line in Lines:
            count += 1
            for j, x in enumerate(pattern_lst):
                for match in re.finditer(x, line.strip()):
                    if len(tag_lst) > 0:
                        result.append(lst_regexmatch(str(count), match.group(), tag_lst[j]))
                    else:
                        result.append(lst_regexmatch(str(count), match.group(), x))
        # file1.close()
        if not os.path.isdir(OutputCSVDir):
            os.makedirs(OutputCSVDir)
        with open(os.path.join(OutputCSVDir, 'result.csv'), 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["LineNo", "Matched_String", "Log_No"])
            for i in result:
                writer.writerow([i.lineno, i.matchstring, i.pattern])
        df = pd.read_csv(os.path.join(OutputCSVDir, 'result.csv'))
        ab = pd.pivot_table(df, index=["LineNo"], values=["Matched_String"], columns=["Log_No"],
                            aggfunc=lambda x: ' '.join(str(v) for v in x))
        ab.to_csv(os.path.join(OutputCSVDir, 'result1.csv'), header=True)
        with open(os.path.join(OutputCSVDir, 'result1.csv'), 'r') as f:
            with open(os.path.join(OutputCSVDir, result_filename + ".csv"), 'w') as f1:
                next(f)
                for idx, line in enumerate(f):
                    if idx != 1:
                        f1.write(line)
    else:
        task_name = log_details_json[0]["selected_task_name"]
        create_pdf_result = create_pdf_from_log_file(filename, task_name, log_delimiter)
        if create_pdf_result:
            model_dir = os.path.join(DeepLearning_ModelDir, task_name) + "/"
            tag_names = os.listdir(model_dir)
            predict_log_features(os.path.join(test_dataDir, task_name) + '/', tag_names, model_dir, result_filename)
    return True


def get_list_task():
    task_list = ConnectionUtility.gettasklist()
    list_obj = json.loads(task_list)
    list_data = list()
    for item in list_obj:
        obj = Object()
        obj.taskname = str(item["taskname"])
        obj.taskDescription = str(item["taskDescription"]).strip()
        obj.training_type = str(item["training_type"]).strip()
        if obj.training_type == 'Regular Expression':
            obj.results = str(item["results"])
        else:
            model_dir = os.path.join(DeepLearning_ModelDir, str(item["taskname"])) + '/'
            if os.path.exists(model_dir):
                obj.results = str(json.dumps(os.listdir(model_dir)))
            else:
                obj.results = ""
        list_data.append(obj)
    json_result = json.dumps(list_data, default=obj_dict)
    return json_result


def get_word_based_marked_data(task_name, request_json_obj):
    list_data_req_obj = []
    marked_records = []
    task_records = get_total_log_records(task_name)
    for log_record in task_records:
        log_line_no = log_record[0]
        log_line_data = log_record[1]
        final_log_record = log_line_data.replace('\n', '')

        for x in range(0, len(request_json_obj)):
            start_word_index = request_json_obj[x]['startWordIndex']
            tag_label = request_json_obj[x]['tagLabel']
            tag_ID = request_json_obj[x]['tagID']
            if start_word_index >= 0:
                # for line in jsonFileInfo:
                selected_start_index = int(start_word_index)
                s_line = str(final_log_record).split()

                selected_word = s_line[selected_start_index]
                start_word_index_number = final_log_record.index(selected_word)
                length_of_string = len(selected_word)
                end_word_index_number = (start_word_index_number + length_of_string) - 1

                tag_selection_obj = (
                    task_name,
                    log_line_no,
                    tag_ID,
                    tag_label,
                    selected_word,
                    start_word_index_number,
                    end_word_index_number)
                # print(tag_selection_obj)
                marked_records.append(log_line_no)
                list_data_req_obj.append(tag_selection_obj)
    result = insert_highlighted_data_markall(list_data_req_obj)
    if result:
        update_highlight_status_markall_basedtagselection(task_name)
    return marked_records


def get_tag_based_marked_data(task_name, request_json_obj):
    list_data_req_obj = []
    marked_records = []
    task_records = get_total_log_records(task_name)
    for log_record in task_records:
        log_line_no = log_record[0]
        log_line_data = log_record[1]
        final_log_record = log_line_data.replace('\n', '')

        for x in range(0, len(request_json_obj)):
            start_word = request_json_obj[x]['startWord']
            end_word = request_json_obj[x]['endWord']
            tag_label = request_json_obj[x]['tagLabel']
            tag_ID = request_json_obj[x]['tagID']

            s_line = str(final_log_record).split()
            final_selected_text = ""
            start_word_index_number = ""
            end_word_index_number = ""
            if any(start_word in s for s in s_line) and any(end_word in s for s in s_line):
                res = [string for string in s_line if start_word in string]
                start_word = str(res[0])
                selected_start = int(s_line.index(start_word) + 1)

                res1 = [string for string in s_line if end_word in string]
                end_word = str(res1[0])
                selected_end = int(s_line.index(end_word))

                selected_word = s_line[selected_start:selected_end]

                final_selected_text = ' '.join(selected_word)
                start_word_index_number = final_log_record.index(final_selected_text)
                length_of_string = len(final_selected_text)
                end_word_index_number = (start_word_index_number + length_of_string) - 1

                tag_selection_obj = (
                    task_name,
                    log_line_no,
                    tag_ID,
                    tag_label,
                    final_selected_text,
                    start_word_index_number,
                    end_word_index_number)
                print(tag_selection_obj)
                marked_records.append(log_line_no)
                list_data_req_obj.append(tag_selection_obj)
    result = insert_highlighted_data_markall(list_data_req_obj)
    if result:
        update_highlight_status_markall_basedtagselection(task_name)
    return marked_records


def get_configuration_details():
    config_list = ConnectionUtility.get_config_details()
    list_obj = json.loads(config_list)
    list_data = list()
    for item in list_obj:
        obj = Object()
        obj.re_step_count = str(item["re_step_count"])
        obj.ml_step_count = str(item["ml_step_count"]).strip()
        obj.access_key = str(item["access_key"]).strip()
        obj.secret_key = str(item["secret_key"]).strip()
        # obj.instance_id = str(item["instance_id"]).strip()
        obj.ami_image_id = str(item["ami_image_id"]).strip()
        obj.pem_filename = str(item["pem_filename"]).strip()
        list_data.append(obj)
    json_result = json.dumps(list_data, default=obj_dict)
    return json_result


def get_reverse_word_position_based_marked_data(task_name, request_json_obj):
    list_data_req_obj = []
    marked_records = []
    task_records = get_total_log_records(task_name)
    for log_record in task_records:
        log_line_no = log_record[0]
        log_line_data = log_record[1]
        print("log_line_data  :>>", log_line_data)
        final_log_record = log_line_data.replace('\n', '')
        print("final_log_record  :>>", final_log_record)

        for x in range(0, len(request_json_obj)):
            start_word_index = request_json_obj[x]['reverseStartWordIndex']
            print("start_word_index :>> ", start_word_index)
            tag_label = request_json_obj[x]['tagLabel']
            tag_ID = request_json_obj[x]['tagID']
            if start_word_index >= 0:
                selected_start_index = int(start_word_index)
                print("selected_start_index  :>>", selected_start_index)
                s_line = str(final_log_record).split()
                print("s_line  :>>", s_line)
                s_line.reverse()

                selected_word = s_line[selected_start_index]

                word_index_number = s_line.index(selected_word)
                length_of_line = len(log_line_data)
                length_of_string = len(selected_word)
                start_word_index_number = (word_index_number + length_of_line) - length_of_string
                end_word_index_number = (start_word_index_number + length_of_string)
                tag_selection_obj = (
                    task_name,
                    log_line_no,
                    tag_ID,
                    tag_label,
                    selected_word,
                    start_word_index_number,
                    end_word_index_number)
                marked_records.append(log_line_no)
                list_data_req_obj.append(tag_selection_obj)
    result = insert_highlighted_data_markall(list_data_req_obj)
    if result:
        update_highlight_status_markall_basedtagselection(task_name)
    return marked_records


def upload_aws_pem_file(uploaded_files):
    cwdPath = os.path.abspath(os.getcwd())
    pem_file_path = os.path.join(cwdPath, "pem_file")
    if not os.path.isdir(pem_file_path):
        os.makedirs(pem_file_path)
    fs = FileSystemStorage(location=pem_file_path)
    folder_path = pem_file_path + '/'
    for file_name in listdir(folder_path):
        if file_name.endswith('.pem'):
            os.remove(folder_path + file_name)
    for file in uploaded_files:
        fs.save(file.name, file)
    return file.name


def check_environment_for_java():
    response = 'Success'
    cwd = os.path.abspath(os.getcwd())
    # jre_path = 'python\\Lib\\site-packages\\elixir\\jre1.8.0_261'
    jre_path = 'jre1.8.0_261'
    java_home_path = os.path.join(cwd, jre_path)
    java_bin_path = os.path.join(cwd, jre_path, 'bin')
    java_home = os.getenv("JAVA_HOME")
    if java_home is None:
        response = "<b>JAVA_HOME and path variable is not set.<br>Please add JAVA_HOME variable to</b> : <i>{}</i> " \
                   "<br><b>Add environment path to : </b> <i>{}</i>".format(java_home_path, java_bin_path)
    else:
        path_var = os.getenv("path")
        path_list = path_var.split(';')
        bin_path = java_home + '\\bin'
        if bin_path not in path_list:
            response = "<b>Java bin path is not added into environment.</b><br><b>Please add environment path to " \
                       ":</b> <i>{}</i>".format(java_bin_path)
    return response


def get_user_defined_format_info(request_json_obj):
    request_obj = json.loads(request_json_obj)
    task_name = request_obj[0]['task_name']
    tag_name = request_obj[0]['userDefinedTagName']
    user_defined_format_result_data = getUserDefinedValuesInfo(task_name, tag_name)
    return user_defined_format_result_data


def insert_user_defined_selected_format_info(request_json_obj):
    request_obj = json.loads(request_json_obj)
    task_name = request_obj[0]['task_name']
    tag_name = request_obj[0]['userDefinedTagName']
    predefined_tag_type_value = request_obj[0]['predefined_tag_type_value']
    predefined_date_format_value = request_obj[0]['predefined_date_format_value']
    predefined_string_start_value = request_obj[0]['predefined_string_start_value']
    predefined_string_end_value = request_obj[0]['predefined_string_end_value']
    req_obj = (tag_name, task_name, predefined_tag_type_value, predefined_date_format_value,
               predefined_string_start_value, predefined_string_end_value)
    result_data = insert_user_defined_format_data(req_obj)
    return result_data


def update_user_defined_selected_format_info(request_json_obj):
    request_obj = json.loads(request_json_obj)
    task_name = request_obj[0]['task_name']
    tag_name = request_obj[0]['userDefinedTagName']
    predefined_tag_type_value = request_obj[0]['predefined_tag_type_value']
    predefined_date_format_value = request_obj[0]['predefined_date_format_value']
    predefined_string_start_value = request_obj[0]['predefined_string_start_value']
    predefined_string_end_value = request_obj[0]['predefined_string_end_value']
    req_obj = (tag_name, predefined_tag_type_value, predefined_date_format_value,
               predefined_string_start_value, predefined_string_end_value, task_name, tag_name)
    result_data = update_user_defined_format_data(req_obj)
    return result_data
