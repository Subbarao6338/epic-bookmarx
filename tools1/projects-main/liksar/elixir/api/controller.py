import json
from Utility import ApiConnectionUtility as api_conn
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import calendar
import time
from datetime import datetime
import pandas as pd
import codecs
import shutil
from django.core.files.storage import FileSystemStorage
import re
import csv
from fpdf import FPDF
import os
from os.path import basename
from Utility.Deep_Learning_Utility import generate_log_pdf_json, predict_log_features

response_data = {}
out_regexstr = ""
out_tagnames = ""

cwdPath = os.path.abspath(os.getcwd())
OutputCSVDir = os.path.join(cwdPath, "OutputCSV")
uploaded_logval_filesDir = os.path.join(cwdPath, "uploaded_logval_files")
test_dataDir = os.path.join(cwdPath, "test_data")
DeepLearning_ModelDir = os.path.join(cwdPath, "DeepLearning_Model")

if not os.path.isdir(OutputCSVDir):
    os.makedirs(OutputCSVDir)

if not os.path.isdir(uploaded_logval_filesDir):
    os.makedirs(uploaded_logval_filesDir)

if not os.path.isdir(test_dataDir):
    os.makedirs(test_dataDir)

if not os.path.isdir(DeepLearning_ModelDir):
    os.makedirs(DeepLearning_ModelDir)


def test_api(request):
    return HttpResponse(json.dumps("api method got implemented"), content_type="application/json")


def get_task_list(request):
    result = api_conn.get_task_list()
    if result:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def get_task_status(request):
    task_name = request.GET.get('taskname')
    print(">>>>>>>>>>>>>>>>>>>>>>")
    result = api_conn.get_task_status(task_name)
    print("<<<<<<<<<<<<<<<<<<<<")
    print(result)
    print("<<<<<<<<<<<<<<<<<<<<")
    if result:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def get_job_status(request):
    jobid = request.GET.get('JobId')
    result = api_conn.get_job_status(jobid)
    if result:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


@csrf_exempt
def create_validation_job(request):
    taskdtl = {}
    taskname = request.POST["TaskName"]
    logpath = request.FILES["Logpath"]
    outputpath = request.POST["Outputpath"]

    gmt = time.gmtime()
    random_str = calendar.timegm(gmt)
    fname = logpath.name.split(".")
    upload_filename = fname[0] + "_" + str(random_str) + "." + fname[1]

    fs = FileSystemStorage(location=uploaded_logval_filesDir)
    filename = fs.save(upload_filename, logpath)
    uploaded_file_path = fs.path(filename)


    now = datetime.now()
    dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
    gmt = time.gmtime()
    ts = calendar.timegm(gmt)
    validation_taskname = "validation_task_" + str(ts)

    taskdtl = get_regexvalue(taskname)
   
    if taskdtl["log_delimiter"] == "":
        log_del = r"\n"
    else:
        log_del = str(codecs.encode(taskdtl["log_delimiter"]))

    print(log_del)
    log_validation_taskid = api_conn.save_logval_taskdtl(dt_string, upload_filename, validation_taskname,
                                                         taskdtl["tagames"], taskdtl["regexstr"], "InProgress",
                                                         "Upload", taskname, "Regular Expression", log_del)

    read_logval_files(upload_filename, taskdtl["tagames"], taskdtl["regexstr"], log_validation_taskid, outputpath)

    upd_sts = api_conn.update_task_status(log_validation_taskid, "Completed")
    result = upd_sts

    if result:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Validation Task Completed successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def get_regexvalue(taskname):
    regexstr = []
    tagstr = []

    result = api_conn.get_task_generated_regex(taskname)
    s = json.loads(result)
    k = json.loads(s[0]["results"])
    resultvalue = json.loads(k["result"])
    print(resultvalue)
    for i in resultvalue:
        for key, value in i.items():
            tagstr.append(key)
            regexstr.append(value["solutionJS"])

    tags = "\n".join(tagstr)
    reg = "\n".join(regexstr)
    log_del = codecs.decode(s[0]["log_delimiter"], 'unicode_escape')

    result_taskdtl = {"tagames": tags, "regexstr": reg, "log_delimiter": log_del}
    return result_taskdtl


def read_logval_files(filename, tagnames, regexexpr, taskid, outputpath):

    log_details_json = json.loads(api_conn.get_log_validation_by_id(taskid))
    base_file_name = filename.split(".")[0]
    result_filename = base_file_name
    log_delimiter = log_details_json[0]["log_delimiter"]
    log_delimiter = codecs.decode(log_delimiter, 'unicode_escape')
    if log_details_json[0]["result_type"] == 'Regular Expression':
        pattern_lst = regexexpr.split('\n')
        tag_lst = []
        if tagnames != "":
            tag_lst = tagnames.split('\n')

        file1 = open(os.path.join(uploaded_logval_filesDir, filename), 'r')
        log_str = file1.read()
        Lines = str(log_str).split(log_delimiter)
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
        file1.close()
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
            with open(os.path.join(OutputCSVDir, result_filename + '.csv'), 'w') as f1:
                next(f)
                for idx, line in enumerate(f):
                    if idx != 1:
                        f1.write(line)

        srcpath = os.path.join(OutputCSVDir, result_filename + ".csv")
        destpath = outputpath + result_filename
        shutil.copyfile(srcpath, destpath)


    else:
        task_name = log_details_json[0]["selected_task_name"]
        create_pdf_result = create_pdf_from_log_file(filename, task_name, log_delimiter)
        if create_pdf_result:
            model_dir = os.path.join(DeepLearning_ModelDir, task_name + '/')
            tag_names = os.listdir(model_dir)
            predict_log_features(os.path.join(test_dataDir, task_name + '/'), tag_names, model_dir, result_filename)


def create_pdf_from_log_file(file_name, task_name, log_delimiter):
    test_data_dir = test_dataDir
    task_file_data = os.path.join(test_data_dir, task_name)
    if not os.path.exists(task_file_data):
        os.mkdir(task_file_data)
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
            pdf.multi_cell(0, 5, txt=line)
            pdf.output(task_file_data + '/' + str(count) + ".pdf")
    return True


class lst_regexmatch:
    def __init__(self, lineno, matchstring, pattern):
        self.lineno = lineno
        self.matchstring = matchstring
        self.pattern = pattern


def list_validation_task(request):
    result = api_conn.get_validation_task_list()
    if result:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def get_validation_result(request):
    task_id = request.GET.get("task_id")
    result = api_conn.get_validation_result_by_id(task_id)
    if result:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)
