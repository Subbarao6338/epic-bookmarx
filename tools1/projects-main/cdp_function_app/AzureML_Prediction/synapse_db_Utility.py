import configparser
import pyodbc
import json
from json import JSONEncoder
import datetime
import requests
import pandas as pd
import time
import logging
import os
from azure.identity import ClientSecretCredential
from azure.storage.filedatalake import DataLakeServiceClient


config_parser = configparser.ConfigParser()
config_parser.read('AzureML_Prediction/config.ini')

server_name = config_parser.get("config", "server_name")
database_name = config_parser.get("config", "database_name")
user_name = config_parser.get("config", "user_name")
password = config_parser.get("config", "password")
table_name = config_parser.get("config", "prediction_table")
azure_ml_url = config_parser.get("config", "azure_ml_url")
auth_key = config_parser.get("config", "authorization_key")

tenant_id = config_parser.get("config", "tenant_id")
client_id = config_parser.get("config", "client_id")
client_secret = config_parser.get("config", "client_secret")
storage_account_name = config_parser.get("config", "storage_account_name")
container_name = config_parser.get("config", "container_name")

conn_str = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=' + server_name + ';DATABASE=' + database_name + ';UID=' + user_name + ';PWD=' + password


class DateTimeEncoder(JSONEncoder):
    # Override the default method
    def default(self, obj):
        if isinstance(obj, (datetime.date, datetime.datetime)):
            return obj.isoformat()


def get_request_json_for_AzureML(service_data):
    try:
        with open(os.path.join('AzureML_Prediction', 'service_req.json')) as req_json:
            req_data = json.load(req_json)
            req_data["Inputs"]["WebServiceInput0"] = json.loads(service_data)
            return req_data
    except Exception as e:
        print(e)


def get_data_from_synapse_to_process():
    req_data = []
    with pyodbc.connect(conn_str, autocommit=True) as conn:
        with conn.cursor() as cursor:
            query = "SELECT CONVERT(DATETIME,CAST([timestamp] as DATETIMEOFFSET),1) as timestamp,device_id, " \
                    "ip_address,CONVERT(FLOAT,volt) as volt, CONVERT(FLOAT,rotate) as rotate,CONVERT(FLOAT,pressure) as " \
                    "pressure, CONVERT(FLOAT,vibration) as vibration,device_status FROM device_telemetry_data " \
                    "WHERE CONVERT(DATETIME,CAST([timestamp] as DATETIMEOFFSET),1) > (SELECT last_read_datetime FROM " \
                    "tblLookupTable) ORDER BY CONVERT(DATETIME,CAST([timestamp] as DATETIMEOFFSET),1) "
            try:
                cursor.execute(query)
                try:
                    result = cursor.fetchall()
                    for row in result:
                        obj = {"timestamp": row[0], "device_id": row[1], "volt": row[3],
                               "rotate": row[4], "pressure": row[5], "vibration": row[6], "device_status": row[7]}
                        req_data.append(obj)
                except Exception as e:
                    print("NO value", e)
            except Exception as e:
                print(e)
    service_input_data = json.dumps(req_data, cls=DateTimeEncoder)
    service_request_json = get_request_json_for_AzureML(service_input_data)
    return service_request_json


def insert_prediction_result_into_synapse(service_req):
    print('Prediction result fetched, insert initialized')
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    cursor.fast_executemany = True
    insert_query = f"INSERT INTO {table_name} VALUES (?,?,?,?,?,?,?,?,?) "
    start = time.time()
    cursor.executemany(insert_query, service_req)
    end = time.time()
    logging.info(f'{(end - start) / 60} minutes elapsed')
    cursor.commit()
    cursor.close()
    conn.close()


def write_dataframe_to_curated(write_file_name, write_dataframe):
    try:
        credential = ClientSecretCredential(tenant_id, client_id, client_secret)
        service_client = DataLakeServiceClient(account_url="{}://{}.dfs.core.windows.net".format(
            "https", storage_account_name), credential=credential)
        file_system_client = service_client.get_file_system_client(container_name)
        file_client = file_system_client.create_file(write_file_name)
        file_client.append_data(write_dataframe.to_csv(index=False), offset=0, length=len(write_dataframe.to_csv(index=False)))
        file_client.flush_data(len(write_dataframe.to_csv(index=False)))
        return True
    except Exception as e:
        print(e)
        return False


def process_synapse_data_with_AzureML():
    try:
        synapse_json_data = get_data_from_synapse_to_process()
        pred_api_url = azure_ml_url
        headers = {"Authorization": auth_key}
        response = requests.request(method="POST", url=pred_api_url, headers=headers, data=json.dumps(synapse_json_data))
        if response.status_code == 200:
            result = json.loads(response.content)
            json_data = pd.DataFrame(result["Results"]["WebServiceOutput0"])
            # json_data['timestamp'] = pd.to_datetime(json_data['timestamp'])
            # insert_prediction_result_into_synapse(json_data.values.tolist())
            write_dataframe_to_curated("AzureML_Prediction.csv", json_data)
            return True
        else:
            logging.info("Azure ML prediction API throws error.")
            return False
    except Exception as e:
        logging.info(e)
        return False
