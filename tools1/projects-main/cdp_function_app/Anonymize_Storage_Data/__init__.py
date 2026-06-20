import logging

import azure.functions as func
import json
import configparser
import requests
import Anonymize_Storage_Data.json_parsing as json_data_extraction
from Anonymize_Storage_Data.operations_data import operations
import Anonymize_Storage_Data.storage_utility

config_parser = configparser.ConfigParser()
config_parser.read('Anonymize_Storage_Data/config.ini')

def data_operations(df):
    try:
        response = requests.get('https://cdpfunctions.azurewebsites.net/api/Column_Classifications?code=wGglozSJvHu5rRPSJ9t4DXrdAxlpL2tv7SsVlDa1YPDwQoXnTA6WNg==', allow_redirects=True)
        response_dict = json.loads(response.content)
        mask_field_rule = []
        mask_field_rule_val = config_parser.get("config", "field_mask")
        if mask_field_rule_val.__contains__(','):
            mask_field_rule = (mask_field_rule_val.split(','))
        else:
            mask_field_rule.append(mask_field_rule_val)

        ap_classfied_data = []
        ap_classfied_data = json_data_extraction.json_parse(response_dict, mask_field_rule)
        for key, value in ap_classfied_data.items():
            if value == 'mask':
                field_replace = key
            elif value == 'encrypt':
                field_encrypt = key
        operation = operations(df)
        if field_encrypt != '' and field_encrypt != None:
            operation.encrypt_field(field_encrypt)
        if field_replace != '' and field_replace != None:
            operation.replace_ip(field_replace)
        return operation.get_df()
    except Exception as e:
        print(e)

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    logging.info(req.get_body())
    req_json = json.loads(req.get_body().decode('utf-8'))
    logging.info("file name to read from storage"+ req_json["runOutput"])
    read_file_name = req_json["runOutput"]
    # read_file_name = "data_11.parquet"
    raw_df = Anonymize_Storage_Data.storage_utility.read_raw_data_zone(read_file_name)
    anonymize_df = data_operations(raw_df)
    write_result = Anonymize_Storage_Data.storage_utility.write_dataframe_to_curated(read_file_name, anonymize_df)
    if write_result:
        return func.HttpResponse("This HTTP triggered function executed successfully.", status_code=200)
    else:
        return func.HttpResponse("There is error on executing the function", status_code=500)
