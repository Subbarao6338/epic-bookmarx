import warnings
warnings.filterwarnings("ignore")
import json
import os
import sys
import pandas as pd
from pandas.io.json import json_normalize
from AION_Prediction.selector import selector
from AION_Prediction.inputprofiler import inputprofiler
from AION_Prediction.trained_model import trained_model
from AION_Prediction.output_format import output_format
from json import JSONEncoder
import datetime
import pyodbc
import logging
import configparser
import time
from azure.identity import ClientSecretCredential
from azure.storage.filedatalake import DataLakeServiceClient


config_parser = configparser.ConfigParser()
config_parser.read('AION_Prediction/config.ini')

server_name = config_parser.get("config", "server_name")
database_name = config_parser.get("config", "database_name")
user_name = config_parser.get("config", "user_name")
password = config_parser.get("config", "password")
table_name = config_parser.get("config", "prediction_table")

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


def query_utility():
    req_data = []
    with pyodbc.connect(conn_str, autocommit=True) as conn:
        with conn.cursor() as cursor:
            query = "SELECT CONVERT(DATETIME,CAST([timestamp] as DATETIMEOFFSET),1) as timestamp,device_id, " \
                    "ip_address,CONVERT(FLOAT,volt) as volt, CONVERT(FLOAT,rotate) as rotate,CONVERT(FLOAT,pressure) as " \
                    "pressure, CONVERT(FLOAT,vibration) as vibration,device_status FROM device_telemetry_data " \
                    "WHERE CONVERT(DATETIME,CAST([timestamp] as DATETIMEOFFSET),1) > (SELECT last_read_datetime FROM " \
                    "tblAIONLookupTable) ORDER BY CONVERT(DATETIME,CAST([timestamp] as DATETIMEOFFSET),1)"
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
    service_input_json = json.dumps(req_data, cls=DateTimeEncoder)
    return service_input_json


def predict():
    try:
        data = query_utility()
        jsonData = json.loads(data)
        df = json_normalize(jsonData)
        df0 = df.copy()
        profilerobj = inputprofiler()
        df = profilerobj.apply_profiler(df)
        selectobj = selector()
        df = selectobj.apply_selector(df)
        modelobj = trained_model()
        output = modelobj.predict(df,"")
        outputobj = output_format()
        output = outputobj.apply_output_format(df0,output)
        return json.loads(output)["data"]
    except KeyError as e:
        output = {"status":"FAIL","message":str(e).strip('"')}
        logging.info("predictions:",json.dumps(output))
        logging.info(json.dumps(output))
        return []
    except Exception as e:
        output = {"status":"FAIL","message":str(e).strip('"')}
        logging.info("predictions:",json.dumps(output))
        logging.info(json.dumps(output))
        return []


def insert_prediction_result_into_synapse(service_req):
    print('Prediction result fetched, insert initialized')
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    cursor.fast_executemany = True
    insert_query = f"INSERT INTO {table_name} VALUES (?,?,?,?,?,?,?,?,?,?) "
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


def process_synapse_data_with_AionModel():
    try:
        predicted_result = predict()
        if len(predicted_result) > 0:
            json_data = pd.DataFrame(predicted_result)
            json_data.drop('remarks', inplace=True, axis=1)
            write_dataframe_to_curated("AION_Prediction.csv", json_data)
            # json_data['timestamp'] = pd.to_datetime(json_data['timestamp'])
            # insert_prediction_result_into_synapse(json_data.values.tolist())
            return True
        else:
            logging.info("There is no row fetched to process.")
            return False
    except Exception as e:
        logging.info(e)
        return False