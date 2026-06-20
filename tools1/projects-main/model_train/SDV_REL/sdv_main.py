from SDV.telemetry_datagen import generate_telemetry_data
from Utility import azure_event_hub_utility as event_hub_utility
from Utility import azure_iot_hub_utility as iot_hub_utility
from Utility import connect_sqlite as dbconn
from Utility import connect_azure_sql as azure_sql_conn
import json
import time
import os
import pandas as pd
import csv
import datetime

cwdPath = os.path.abspath(os.getcwd())
SDVPath = os.path.join(cwdPath,'SDV')
SDV_CSVPath = os.path.join(SDVPath,'sdv_telemetry_data.csv')
#print('SDVPath :>>', SDVPath)


def read_CSV_to_JSON():
    csvfile = open(SDV_CSVPath, 'r')

    fieldnames = ("device_id", "ip_address", "token", "timestamp", "uv", "temperature", "humidity", "volt", "rotate",
                  "pressure", "vibration", "event_type")
    reader = csv.DictReader(csvfile, fieldnames)
    data_list = list()
    for row in reader:
        csv_data = json.dumps(row)
        device_reading = json.loads(csv_data)
        if 'timestamp' in device_reading.keys():
            device_reading['timestamp'] = str(datetime.datetime.utcnow())
        data_list.append(device_reading)
    csvfile.close()
    return json.dumps(data_list)


def sent_synthetic_data(simulator_type,time_delay,hub_name):
    generate_telemetry_data()

    hub_connection_details = azure_sql_conn.get_hub_connection_details(simulator_type, hub_name)
    final_hub_details = json.loads(hub_connection_details)
    hub_name = final_hub_details['hub_name']
    hub_connection_string = final_hub_details['hub_connection_string']

    telemetry_json = read_CSV_to_JSON()
    telemetry_jsonObject = json.loads(telemetry_json)

    if simulator_type == 'event_hub':
        for telemetry_data in telemetry_jsonObject:
            message = json.dumps(telemetry_data)
            print(message)
            if event_hub_utility.send_event_to_hub(hub_connection_string, hub_name, message):
                print("device event to Event-Hub send successfully at {}".format(time.ctime(time.time())))
            is_stop_time = check_stoptime()
            if is_stop_time:
                print('stopped')
                break
            time.sleep(time_delay)
    elif simulator_type == 'iot_hub':
        for telemetry_data in telemetry_jsonObject:
            message = json.dumps(telemetry_data)
            print(message)
            if iot_hub_utility.send_message_to_iothub(hub_connection_string, hub_name, message):
                print("device event to IoT-Hub send successfully at {}".format(time.ctime(time.time())))
            is_stop_time = check_stoptime()
            if is_stop_time:
                print('stopped')
                break
            time.sleep(time_delay)

def check_stoptime():
    stop_status = dbconn.get_stop_status()
    return stop_status