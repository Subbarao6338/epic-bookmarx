import csv
import glob
import json
import os
import time

from fpdf import FPDF
from pandas.io.formats import printing

from Utility.ConnectionUtility import generate_PDF, generate_JSON, generate_FIELD_DICT, update_deeplearning_taskstatus, \
    update_ml_executionsummary, get_config_details
from Utility.Instance_Notebook_Utility import copy_files_to_server, stop_server_instance, start_instance, \
    start_executing_notebook, check_file_on_server, get_remote_folder
from deep_learning_assets.acp.acp import AttendCopyParse

cwdPath = os.path.abspath(os.getcwd())
OutputCSVDir = os.path.join(cwdPath, "OutputCSV")
deep_learningDir = os.path.join(cwdPath, "deep_learning")
DeepLearning_ModelDir = os.path.join(cwdPath, "DeepLearning_Model")
pem_file_folder = os.path.join(cwdPath, 'pem_file')


def generate_log_pdf_json(task_name):
    if not os.path.isdir(deep_learningDir):
        os.makedirs(deep_learningDir)
    input_python_path = os.path.join(deep_learningDir, 'input_python')
    if not os.path.isdir(input_python_path):
        os.makedirs(input_python_path)
    pdf_json_path = os.path.join(deep_learningDir, 'pdf_json')
    if not os.path.isdir(pdf_json_path):
        os.makedirs(pdf_json_path)
    if not os.path.isdir(DeepLearning_ModelDir):
        os.makedirs(DeepLearning_ModelDir)

    update_ml_executionsummary(" Model Train Data preparing started.", task_name)
    input_python_files = glob.glob(deep_learningDir + '//input_python//*')
    for input_python_file in input_python_files:
        os.remove(input_python_file)
    pdf_json_files = glob.glob(deep_learningDir + '//pdf_json//*')
    for pdf_json_file in pdf_json_files:
        os.remove(pdf_json_file)

    pdf_value = generate_PDF(task_name)
    list_pdf_obj = json.loads(pdf_value)

    i = 1
    for pdf_item in list_pdf_obj:
        log_line_no = str(pdf_item["log_line_no"])
        log_data = str(pdf_item["log_data"])

        ## PDF Generation started ##
        pdf = FPDF()
        # Add a page
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        pdf.multi_cell(0, 5, txt=log_data.encode('latin-1', 'replace').decode('latin-1'))
        pdf.output(os.path.join(deep_learningDir, 'pdf_json', task_name + "_" + str(i) + ".pdf"))

        json_value = generate_JSON(task_name, log_line_no)
        list_json_obj = json.loads(json_value)
        response_data = {}
        for json_item in list_json_obj:
            tag_id = str(json_item["tag_id"])
            tag_name = str(json_item["tag_name"])
            selected_text = str(json_item["selected_text"])
            response_data[tag_name] = str(selected_text)
        # Serializing json
        json_object = json.dumps(response_data, indent=4)

        # Writing to .json
        with open(os.path.join(deep_learningDir, "pdf_json", task_name + "_" + str(i) + ".json"), "w") as outfile:
            outfile.write(json_object)
        i = i + 1

    field_value = generate_FIELD_DICT(task_name)
    list_field_obj = json.loads(field_value)

    str_field = 'def getfields():'
    str_init = '\n\tFIELDS = dict()'
    str_init += '\n\tFIELD_TYPES = {"general": 0, "optional": 1, "amount": 2, "date": 3}'
    for field_item in list_field_obj:
        tag_name = str(field_item["tag_name"])
        str_init += '\n\tFIELDS["' + tag_name + '"] = FIELD_TYPES["general"]'
    str_field += str_init
    str_field += '\n\treturn FIELDS';
    str_field += '\nif __name__ == \'__main__\':'
    str_field += '\n\tgetfields()';

    f = open(os.path.join(deep_learningDir, 'input_python', 'fields.py'), 'w')
    f.write(str_field)
    f.close()
    f = open(os.path.join(deep_learningDir, 'input_python', '__init__.py'), 'w')
    f.write(str_init.replace('\t', ''))
    f.close()

    config_data = get_config_details()
    config_json_data = json.loads(config_data)
    aws_access_key_id = config_json_data[0]["access_key"]
    aws_secret_access_key = config_json_data[0]["secret_key"]
    instance_id = config_json_data[0]["instance_id"]
    pem_file = config_json_data[0]["pem_filename"]
    pem_file_path = os.path.join(pem_file_folder, pem_file)
    server_ip = start_instance(aws_access_key_id, aws_secret_access_key, instance_id)
    print(server_ip)
    update_ml_executionsummary("Instance started for model training.", task_name)
    time.sleep(50)
    update_ml_executionsummary("Prepared dataset transfer started.", task_name)
    copy_files_to_server(server_ip, pem_file_path)
    start_executing_notebook(server_ip)
    update_ml_executionsummary("Model training process initiated successfully.", task_name)
    update_deeplearning_taskstatus(task_name, "In-Progress")
    update_ml_executionsummary("Model training is in-progress.", task_name)
    file_path = 'code/invoice_net_final/trained_model/status.txt'
    is_wait = True
    while is_wait:
        time.sleep(50)
        is_wait = check_file_on_server(file_path, server_ip, pem_file_path)
    update_ml_executionsummary("Model training completed successfully.", task_name)
    update_ml_executionsummary("Trained model download is in-progress.", task_name)
    remote_path = '/home/ubuntu/code/invoice_net_final/models/invoicenet'
    local_root_path = DeepLearning_ModelDir
    local_path = os.path.join(local_root_path, task_name)
    if not os.path.exists(local_path):
        os.mkdir(local_path)
    get_remote_folder(server_ip, remote_path, local_path, pem_file_path, preserve_mtime=False)
    update_ml_executionsummary(" Trained model downloaded successfully.", task_name)
    stop_server_instance(aws_access_key_id, aws_secret_access_key, instance_id)
    update_ml_executionsummary(" Instance Stopped.", task_name)
    update_deeplearning_taskstatus(task_name, "Completed")


def headervalue(tag_name, selectedvalue):
    response_data = {}
    response_data[tag_name] = selectedvalue
    return response_data


def predict_log_features(input_dir, field_list, model_dir, result_file_name):
    fields = []
    predictions = {}
    paths = [os.path.abspath(f) for f in glob.glob(input_dir + "**/*.pdf", recursive=True)]
    if not os.path.exists(model_dir):
        print("Could not find any trained models!")
        return
    else:
        models = os.listdir(model_dir)
        for field in field_list:
            if field in models:
                fields.append(field)
            else:
                print("Could not find a trained model for field '{}', skipping...".format(field))

    for field in fields:
        model = AttendCopyParse(field=field, model_dir=model_dir, restore=True)
        predictions[field] = model.predict(paths=paths)
    list_predict = []
    list_paths = []
    for idx, filename in enumerate(paths):
        labels = {}

        result = filename.rsplit("\\", 1)
        final_result = result[1].replace('.pdf', '')
        list_paths.append(int(final_result))
        print(list_paths)
        for field in predictions.keys():
            labels[field] = predictions[field][idx]
        list_predict.append(json.dumps(labels))
    if not os.path.isdir(OutputCSVDir):
        os.makedirs(OutputCSVDir)
    with open(os.path.join(OutputCSVDir, result_file_name + ".csv"), 'w', newline='') as csv_file:
        writer = csv.writer(csv_file)
        field_list.insert(0, 'Log_No')
        writer.writerow(field_list)
        row_list = []
        for idx, item in enumerate(list_predict):
            row_item = []
            item_val = json.loads(item)
            row_item.append(list_paths[idx])
            for field_name in field_list:
                if field_name != 'Log_No':
                    row_item.append(item_val[field_name])
            row_list.append(row_item)
        for row in sorted(row_list):
            writer.writerow(row)
    print("csv generation completed")
