import configparser
import datetime
import json
import os
import random
import string

import sys
from threading import Thread
import asyncio
import time
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from tabulate import tabulate

from Utility import azure_event_hub_utility as event_hub_utility
from Utility import azure_iot_hub_utility as iot_hub_utility
from Utility import connect_sqlite as dbconn
from Utility import connect_azure_sql as azure_sql_conn
from Utility import amazon_kinesis_utility as amazon_kinesis_utility

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")
ip_address = {}
token = {}
device_ids = []

config_parser = configparser.ConfigParser()
print(os.path.join(config_path, "eventhub_config.ini"))
config_parser.read(os.path.join(config_path, "eventhub_config.ini"))

# device_count = int(config_parser.get("config", "device_count"))
# time_interval = int(config_parser.get("config", "time_interval"))
temperature_min_threshold = []
temperature_max_threshold = []
humidity_min_threshold = []
humidity_max_threshold = []
volt_min_threshold = []
volt_max_threshold = []
rotate_min_threshold = []
rotate_max_threshold = []
pressure_min_threshold = []
pressure_max_threshold = []
vibration_min_threshold = []
vibration_max_threshold = []


def connect_sql():
    TargetServer = config_parser.get("device_connection_info", "TargetServer")
    TargetDb = config_parser.get("device_connection_info", "TargetDb")
    UserName = config_parser.get("device_connection_info", "UserName")
    Password = config_parser.get("device_connection_info", "Password")

    # Configure the Connection
    connection_string = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=' + TargetServer + ';DATABASE=' + TargetDb + ';UID=' + UserName + ';PWD=' + Password
    connection_url = URL.create("mssql+pyodbc", query={"odbc_connect": connection_string})
    engine = create_engine(connection_url)
    return engine


def get_ip_token(connect_engine):
    print("Loading metadata ...")
    sql_statement = 'SELECT Device_Id, IP_Address, Token from [dbo].[tblDeviceConnectionInfo]'
    results = connect_engine.execute(sql_statement)
    for row in results:
        ip_address[row[0]] = row[1]
        token[row[0]] = row[2]
    print(ip_address)
    print(token)


def get_device_id(connect_engine):
    print("Loading metadata ...")
    sql_statement = 'SELECT device_id from [dbo].[tblDeviceInfo]'
    results = connect_engine.execute(sql_statement)
    for row in results:
        device_ids.append(row[0])
    print(device_ids)


def get_random_string(length):
    # choose from all lowercase letter
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str


def python_simulator(device_id, cloud_service_type, data_options, final_hub_details, msg_template):
    str_event_type = ''
    if cloud_service_type == 'Event Hub':
        str_event_type = 'Telemetry'
    elif cloud_service_type == 'IoT Hub':
        str_event_type = 'IoT-Telemetry'
    elif cloud_service_type == 'Kinesis':
        str_event_type = 'Kinesis-Telemetry'
    else:
        str_event_type = 'Telemetry'

    # event_hub_conn = "Endpoint=sb://cdpdeviceehns.servicebus.windows.net/;" \
    #                 "SharedAccessKeyName=RootManageSharedAccessKey;" \
    #                 "SharedAccessKey=y87YFJEiJ6MJtrdXywnfoukI955cVjRbeqyFu/w+1cA="
    # event_hub_name = "cdpdeviceeh"'

    # event_hub_conn = "Endpoint=sb://de-eventhub-ns.servicebus.windows.net/;" \
    #                 "SharedAccessKeyName=de-devicedata-con;" \
    #                 "SharedAccessKey=ckuIpA3XXrEOYGGp5z0BNwMDv9cfoJwWgG2OpK4hYnw="
    # event_hub_name = "de-devicedata"

    # if simulator_type == 'event_hub':
    #     event_hub_conn = "Endpoint=sb://cdpdeviceehns.servicebus.windows.net/;" \
    #                     "SharedAccessKeyName=RootManageSharedAccessKey;" \
    #                     "SharedAccessKey=y87YFJEiJ6MJtrdXywnfoukI955cVjRbeqyFu/w+1cA="
    #     event_hub_name = "cdpdeviceevent_hub"
    # elif simulator_type == 'iot_hub':
    #     iot_hub_conn = "HostName=cdpdeviceih.azure-devices.net;" \
    #                    "SharedAccessKeyName=device;" \
    #                    "SharedAccessKey=WykGXk6hEnDZS4sJqtIYZL+41h8+d4RDZZNYXhn5Xho="
    #     iot_hub_device_name = "IoT_Telemetry_Device"
    arr_data_options = []
    if ',' in data_options:
        arr_data_options = data_options.split(',')
        chk_index = random.randint(1, len(arr_data_options))
        data_options = arr_data_options[chk_index - 1]
    else:
        data_options = data_options

    device_reading = {}
    if data_options == 'telemetry':
        if len(msg_template) == 0:
            device_reading['timestamp'] = str(datetime.datetime.utcnow())
            device_reading['device_id'] = device_id
            device_reading['volt'] = random.uniform(80, 260)
            device_reading['rotate'] = random.uniform(120, 700)
            device_reading['pressure'] = random.uniform(50, 200)
            device_reading['vibration'] = random.uniform(50, 100)
            device_reading['device_status'] = 'NORMAL'
            device_reading['ip_address'] = ip_address[device_id]
            # device_reading['token'] = token[device_id]
            # device_reading['uv'] = random.random()
            # device_reading['temperature'] = random.randint(70, 100)
            # device_reading['humidity'] = random.randint(70, 100)
            # device_reading['EventType'] = str_event_type
        else:
            for i in range(len(msg_template)):
                if msg_template[i]["property_type"] == "Datetime":
                    device_reading[msg_template[i]["property_name"]] = str(datetime.datetime.utcnow())
                elif msg_template[i]["property_type"] == "String":
                    arr_property_value = msg_template[i]["property_value"].split(",")
                    arr_len = len(arr_property_value)
                    randon_number = random.randint(0, arr_len - 1)
                    device_reading[msg_template[i]["property_name"]] = arr_property_value[randon_number]
                elif msg_template[i]["property_type"] == "IP Address":
                    arr_property_value = msg_template[i]["property_value"].split(",")
                    arr_len = len(arr_property_value)
                    randon_number = random.randint(0, arr_len - 1)
                    device_reading[msg_template[i]["property_name"]] = arr_property_value[randon_number]
                elif msg_template[i]["property_type"] == "Phone Number":
                    arr_property_value = msg_template[i]["property_value"].split(",")
                    arr_len = len(arr_property_value)
                    randon_number = random.randint(0, arr_len - 1)
                    device_reading[msg_template[i]["property_name"]] = arr_property_value[randon_number]
                elif msg_template[i]["property_type"] == "E-Mail":
                    arr_property_value = msg_template[i]["property_value"].split(",")
                    arr_len = len(arr_property_value)
                    randon_number = random.randint(0, arr_len - 1)
                    device_reading[msg_template[i]["property_name"]] = arr_property_value[randon_number]
                elif msg_template[i]["property_type"] == "Numeric":
                    device_reading[msg_template[i]["property_name"]] = random.randint(
                        msg_template[i]["property_value_from"], msg_template[i]["property_value_to"])
                else:
                    device_reading[msg_template[i]["property_name"]] = msg_template[i]["property_value"]
    elif data_options == 'anomaly':
        temperature_min_threshold = config_parser.get("anomaly_data", "temperature_min_threshold").split(',')
        temperature_max_threshold = config_parser.get("anomaly_data", "temperature_max_threshold").split(',')
        humidity_min_threshold = config_parser.get("anomaly_data", "humidity_min_threshold").split(',')
        humidity_max_threshold = config_parser.get("anomaly_data", "humidity_max_threshold").split(',')
        volt_min_threshold = config_parser.get("anomaly_data", "volt_min_threshold").split(',')
        volt_max_threshold = config_parser.get("anomaly_data", "volt_max_threshold").split(',')
        rotate_min_threshold = config_parser.get("anomaly_data", "rotate_min_threshold").split(',')
        rotate_max_threshold = config_parser.get("anomaly_data", "rotate_max_threshold").split(',')
        pressure_min_threshold = config_parser.get("anomaly_data", "pressure_min_threshold").split(',')
        pressure_max_threshold = config_parser.get("anomaly_data", "pressure_max_threshold").split(',')
        vibration_min_threshold = config_parser.get("anomaly_data", "vibration_min_threshold").split(',')
        vibration_max_threshold = config_parser.get("anomaly_data", "vibration_max_threshold").split(',')

        device_reading['device_id'] = device_id
        device_reading['ip_address'] = ip_address[device_id]
        # device_reading['token'] = token[device_id]
        device_reading['timestamp'] = str(datetime.datetime.utcnow())
        # device_reading['uv'] = random.random()
        chk_index = random.randint(0, 1)
        if chk_index == 0:
            # device_reading['temperature'] = random.randint(int(temperature_min_threshold[0]),
            #                                                int(temperature_min_threshold[1]))
            # device_reading['humidity'] = random.randint(int(humidity_min_threshold[0]), int(humidity_min_threshold[1]))
            device_reading['volt'] = random.uniform(int(volt_min_threshold[0]), int(volt_min_threshold[1]))
            device_reading['rotate'] = random.uniform(int(rotate_min_threshold[0]), int(rotate_min_threshold[1]))
            device_reading['pressure'] = random.uniform(int(pressure_min_threshold[0]), int(pressure_min_threshold[1]))
            device_reading['vibration'] = random.uniform(int(vibration_min_threshold[0]),
                                                         int(vibration_min_threshold[1]))
        else:
            # device_reading['temperature'] = random.randint(int(temperature_max_threshold[0]),
            #                                                int(temperature_max_threshold[1]))
            # device_reading['humidity'] = random.randint(int(humidity_max_threshold[0]), int(humidity_max_threshold[1]))
            device_reading['volt'] = random.uniform(int(volt_max_threshold[0]), int(volt_max_threshold[1]))
            device_reading['rotate'] = random.uniform(int(rotate_max_threshold[0]), int(rotate_max_threshold[1]))
            device_reading['pressure'] = random.uniform(int(pressure_max_threshold[0]), int(pressure_max_threshold[1]))
            device_reading['vibration'] = random.uniform(int(vibration_max_threshold[0]),
                                                         int(vibration_max_threshold[1]))
        # device_reading['EventType'] = str_event_type
        device_reading['device_status'] = 'NORMAL'

    json_data = json.dumps(device_reading)
    print(json_data)

    event_str = json.dumps(device_reading)
    # event_hub_utility.send_event_to_hub(event_hub_conn, event_hub_name, event_str)
    if cloud_service_type == 'Event Hub':
        event_hub_name = final_hub_details["event_hub_name"]
        event_connection_string = final_hub_details['event_hub_connection_string']
        if event_hub_utility.send_event_to_hub(event_connection_string, event_hub_name, event_str):
            print("device event to Event-Hub send successfully at {}".format(time.ctime(time.time())))
    elif cloud_service_type == 'IoT Hub':
        iot_hub_name = final_hub_details["iot_hub_name"]
        iot_connection_string = final_hub_details["iot_connection_string"]
        if iot_hub_utility.send_message_to_iothub(iot_connection_string, iot_hub_name, event_str):
            print("device event to IoT-Hub send successfully at {}".format(time.ctime(time.time())))
    elif cloud_service_type == 'Kinesis':
        aws_access_key = final_hub_details["aws_access_key"]
        aws_secret_key = final_hub_details["aws_secret_key"]
        aws_region = final_hub_details["aws_region"]
        aws_stream_name = final_hub_details["aws_stream_name"]
        if amazon_kinesis_utility.send_message_to_kinesis(aws_access_key, aws_secret_key, aws_region, aws_stream_name,
                                                          event_str):
            print("device event to kinesis send successfully at {}".format(time.ctime(time.time())))


def between_callback(args):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(python_simulator(args))
    loop.close()


def simulator(cloud_service_type, data_options, device_count, time_interval, simulator_status, hub_name, platform):
    connect_engine = connect_sql()
    get_ip_token(connect_engine)
    get_device_id(connect_engine)

    hub_connection_details = azure_sql_conn.get_hub_connection_details()
    final_hub_details = json.loads(hub_connection_details)

    msg_template = azure_sql_conn.fetch_template_content()

    if device_count <= 0 or time_interval <= 0:
        print("[!] Argument cannot be zero or less than zero. Exiting")
        sys.exit(2)

    print('\n')
    print(tabulate([
        ['Simulator Type', cloud_service_type],
        ['Data Options', data_options],
        ['Hub Name', hub_name],
        ['Device Count', device_count],
        ['Time Delay', time_interval],
        ['Simulator Status', simulator_status]
    ], headers=['Parameters', 'Values']))
    print('\n')

    if simulator_status == "Active":
        running_status = True
    else:
        running_status = False
    # total_running_event = 0
    while running_status:
        if platform == "UI":
            is_stop_time = check_stoptime()
            if is_stop_time:
                print('stopped')
                break
        # total_running_event += 1
        event_count = random.randint(1, device_count)
        for i in range(event_count):
            device_number = random.randint(1, device_count)
            device_id = device_ids[device_number - 1]
            device_thread = Thread(target=python_simulator, args=(
                device_id, cloud_service_type, data_options, final_hub_details, msg_template,))
            device_thread.start()

        if platform == "UI":
            is_stop_time = check_stoptime()
            if is_stop_time:
                print('stopped')
                break
        time.sleep(time_interval)


def check_stoptime():
    stop_status = dbconn.get_stop_status()
    return stop_status


if __name__ == '__main__':
    simulator()
