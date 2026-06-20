import configparser

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
SDVPath = os.path.join(cwdPath, 'SDV')
SDV_CSVPath = os.path.join(SDVPath, 'sdv_telemetry_data.csv')

config_path = os.path.join(cwdPath, "config")
config_parser = configparser.ConfigParser()
config_parser.read(os.path.join(config_path, "eventhub_config.ini"))


# print('SDVPath :>>', SDVPath)

def read_CSV_to_JSON(csv_path=SDV_CSVPath,attributes='',noise=''):
    columns = []
    data = pd.read_csv(csv_path)
    for col in data.columns:
        columns.append(col)

    csvfile = open(csv_path, 'r')
    reader = csv.DictReader(csvfile, tuple(columns))
    data_list = list()
    attributes_array=attributes.split(",")
    noise_array=noise.split(",")
    noise_index=0
    row_index=0
    #print(attributes)
    #print(len(attributes_array))
    for row in reader:
        row_index+=1
        csv_data = json.dumps(row)
        device_reading = json.loads(csv_data)
    
        #print("attributes_array")
        if len(attributes_array)>0 and row_index>1:
          noise_index=0
          for attr in attributes_array:
              noise_index+=1
              #print("attr")
              if attr in device_reading.keys() and len(noise_array)>=noise_index:
                  noise_percent=noise_array[noise_index-1]
                  #print(device_reading[attr])
                  device_reading[attr] = float(device_reading[attr])+(float(device_reading[attr])*float(noise_percent)/100)
                  #print(device_reading[attr])

        data_list.append(device_reading)
    csvfile.close()
    # print(json.dumps(data_list))
    return json.dumps(data_list)


def read_CSV_to_JSONold(csv_path=SDV_CSVPath):
    csvfile = open(csv_path, 'r')

    # fieldnames = ("device_id", "ip_address", "token", "timestamp", "uv", "temperature", "humidity", "volt", "rotate",
    #               "pressure", "vibration", "event_type")
    # fieldnames = ("timestamp", "device_id", "volt", "rotate", "pressure", "vibration", "device_status", "ip_address")
    reader = csv.DictReader(csvfile)
    data_list = list()
    for row in reader:
        csv_data = json.dumps(row)
        device_reading = json.loads(csv_data)
        if 'timestamp' in device_reading.keys():
            device_reading['timestamp'] = str(datetime.datetime.utcnow())
        data_list.append(device_reading)
    csvfile.close()
    return json.dumps(data_list)


def sent_synthetic_data(simulator_type, time_delay, hub_name, attributes, noise):
    dateColumnName = config_parser.get("SDVMODELCONFIG", "column_name")

    # hub_connection_details = azure_sql_conn.get_hub_connection_details(simulator_type, hub_name)
    # final_hub_details = json.loads(hub_connection_details)
    print(simulator_type)
    hub_connection_details = azure_sql_conn.get_hub_connection_details()
    final_hub_details = json.loads(hub_connection_details)
    cwdPath = os.path.abspath(os.getcwd())
    sdv_folder_path = os.path.join(cwdPath, 'SDV')
    timestr =time.strftime("%Y%m%d-%H%M%S")
    csv_datafile = os.path.join(sdv_folder_path, 'model_result'+timestr+'.csv')
    num_records = int(config_parser.get("SDVMODELCONFIG", "num_records"))
    print(num_records)
    #num_records = 1463
    # attributes='Sensor_1, Sensor_2, Sensor_3, Sensor_4'
    # noise='90,70,69,40'

    # attributes = ''
    # noise = ''
    if simulator_type == 'Event Hub':
        hub_name = final_hub_details["event_hub_name"]
        hub_connection_string = final_hub_details['event_hub_connection_string']
        while True:
            generate_telemetry_data(num_records,csv_datafile)
            telemetry_json = read_CSV_to_JSON(csv_datafile,attributes,noise)
            telemetry_jsonObject = json.loads(telemetry_json)
            for telemetry_data in telemetry_jsonObject:
                if dateColumnName != "":
                    if dateColumnName in telemetry_data.keys():
                        telemetry_data[dateColumnName] = str(datetime.datetime.utcnow())
                message = json.dumps(telemetry_data)
                print(message)
                if event_hub_utility.send_event_to_hub(hub_connection_string, hub_name, message):
                    print("device event to Event-Hub send successfully at {}".format(time.ctime(time.time())))
                is_stop_time = check_stoptime()
                if is_stop_time:
                    print('stopped')
                    break
                time.sleep(time_delay)
            is_stop_time = check_stoptime()
            if is_stop_time:
                print('stopped')
                break
    elif simulator_type == 'IoT Hub':
        hub_name = final_hub_details["iot_hub_name"]
        hub_connection_string = final_hub_details["iot_connection_string"]
        while True:
            generate_telemetry_data(num_records, csv_datafile)
            telemetry_json = read_CSV_to_JSON(csv_datafile)
            telemetry_jsonObject = json.loads(telemetry_json)
            for telemetry_data in telemetry_jsonObject:
                if dateColumnName != "":
                    if dateColumnName in telemetry_data.keys():
                        telemetry_data[dateColumnName] = str(datetime.datetime.utcnow())
                message = json.dumps(telemetry_data)
                print(message)
                if iot_hub_utility.send_message_to_iothub(hub_connection_string, hub_name, message):
                     print("device event to IoT-Hub send successfully at {}".format(time.ctime(time.time())))
                is_stop_time = check_stoptime()
                if is_stop_time:
                    print('stopped')
                    break
                time.sleep(time_delay)
            is_stop_time = check_stoptime()
            if is_stop_time:
                print('stopped')
                break




def check_stoptime():
    stop_status = dbconn.get_stop_status()
    return stop_status
