import logging

import azure.functions as func
from azure.storage.filedatalake import DataLakeFileClient
import pandas as pd
import json
import configparser
import io
import requests
import Anonymize_Storage_Data.json_parsing as json_data_extraction
from Anonymize_Storage_Data.operations_data import operations

config_parser = configparser.ConfigParser()
config_parser.read('Anonymize_Storage_Data/config.ini')

def data_operations(df):
    try:
        response = requests.get('https://cdp-functions.azurewebsites.net/api/Column_Classifications?code=oVdS/EaUYnjMAXbVMdLrrY9LHhYXuUIsjAXZmNIKIQfzKcoFBZM0AQ==', allow_redirects=True)
        response_dict = json.loads(response.content)
        print('response_dict',response_dict)
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
                print(field_replace)
            elif value == 'encrypt':
                field_encrypt = key
                print(field_encrypt)
        operation = operations(df)
        operation.encrypt_field(field_encrypt)
        operation.replace_ip(field_replace)
        return operation.get_df()
    except Exception as e:
        print(e)


def read_data_from_storage(read_file_name):
    try:
        storage_connection_string = "DefaultEndpointsProtocol=https;AccountName=decdpdatalake;AccountKey=xHzXhpSjMJRjzhZSUmfYaSYTsReWtaSDA2I2Rnu5zU3YY/oqxDzGsikXiLHMqJdKQ+CeQMvlssI//h1DcLT2Xg==;EndpointSuffix=core.windows.net" #config_parser.get("config", "storage_connection_string")
        read_file_container = "structuredrawdata"# config_parser.get("config", "read_file_container")
        
        read_file = DataLakeFileClient.from_connection_string(storage_connection_string, file_system_name=read_file_container, file_path=read_file_name)
        download_file = read_file.download_file()
        downloaded_bytes = download_file.readall()
        data_str = str(downloaded_bytes, 'utf-8')
        data = io.StringIO(data_str)
        df = pd.read_csv(data)
        return df
    except Exception as e:
        print(e)


def write_dataframe_to_storage(write_file_name, anonymize_df):
    try:
        storage_connection_string = "DefaultEndpointsProtocol=https;AccountName=decdpdatalake;AccountKey=xHzXhpSjMJRjzhZSUmfYaSYTsReWtaSDA2I2Rnu5zU3YY/oqxDzGsikXiLHMqJdKQ+CeQMvlssI//h1DcLT2Xg==;EndpointSuffix=core.windows.net" #config_parser.get("config", "storage_connection_string")
        read_file_container = "stagingdata"# config_parser.get("config", "read_file_container")
        
        file_write = DataLakeFileClient.from_connection_string(storage_connection_string, file_system_name=read_file_container, file_path=write_file_name)
        file_write.create_file()
        file_write.append_data(anonymize_df.to_csv(index=False), offset=0, length=len(anonymize_df.to_csv(index=False)))
        file_write.flush_data(len(anonymize_df.to_csv(index=False)))
        return True
    except Exception as e:
        print(e)
        return False

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    logging.info(req.get_body())
    req_json = json.loads(req.get_body().decode('utf-8'))
    logging.info("file name to read from storage"+ req_json["runOutput"])
    read_file_name = req_json["runOutput"]
    raw_df = read_data_from_storage(read_file_name)
    anonymize_df = data_operations(raw_df)
    write_result = write_dataframe_to_storage(read_file_name, anonymize_df)
    if write_result:
        return func.HttpResponse("This HTTP triggered function executed successfully.", status_code=200)
    else:
        return func.HttpResponse("There is error on executing the function", status_code=500)    
