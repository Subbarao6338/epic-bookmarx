import json
import os
import sqlite3
from sqlite3 import Error
from unipath import Path
from datetime import datetime
BASE_DIR = PROJECT_DIR = Path(__file__).parent
dbname = os.path.join(BASE_DIR, 'simulator_settings.db')
table_name = "simulator_status"
device_count_table_name = "device_count"
simulator_name = "Simulator"
setting_table_name = "setting_values"


def create_connection():
    conn = None
    try:
        conn = sqlite3.connect(dbname)
        print("connected")
    except Error as e:
        print(e)

    return conn


def execute_query(sql, args):
    try:
        conn = create_connection()
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        if args == "":
            cur.execute(sql)
        else:
            cur.execute(sql, (args,))
        result = cur.fetchall()
        conn.commit()
        conn.close()
        return json.dumps([dict(ix) for ix in result])
    except Error as e:
        print(e)


def execute_sql(sql, obj_data):
    try:
        conn = create_connection()
        cur = conn.cursor()
        cur.execute(sql, obj_data)
        conn.commit()
        object_id = cur.lastrowid
        conn.close()
        return object_id
    except Error as e:
        print(e)


def insert_simulator_details(obj):
    try:
        get_response = get_simulator_count()
        print(get_response)
        if get_response == 0:
            obj_data = json.loads(obj)
            print(obj_data["simulation_type"])
            print(type(obj_data["simulation_type"]))
            file_obj = (simulator_name, obj_data["simulation_type"], obj_data["cloud_type"], obj_data["cloud_service_type"], obj_data["data_options"],
                    obj_data["hub_name"], obj_data["device_count"], obj_data["time_delay"], obj_data["simulator_status"])
            sql = """Insert into """ + table_name + """( simulator_name, simulation_type, cloud_type, cloud_service_type , data_options, hub_name, 
                    device_count, time_delay, simulator_status) VALUES (?,?,?,?,?,?,?,?,?)"""
            print(sql)
            print(file_obj)
            object_id = execute_sql(sql, file_obj)
            print(object_id)
            return object_id
        else:
            return update_simulator_details(obj)
    except Error as e:
        print(e)


def get_simulator_count():
    conn = create_connection()
    cur = conn.cursor()
    simulator_count = 0
    select_table_sql = 'select count(*) from ' + table_name
    for row in cur.execute(select_table_sql):
        simulator_count = row[0]
    return simulator_count


def update_simulator_details(obj):
    try:
        obj_data = json.loads(obj)
        file_obj = (simulator_name, obj_data["simulation_type"], obj_data["cloud_type"], obj_data["cloud_service_type"], obj_data["data_options"],
                    obj_data["hub_name"], obj_data["device_count"], obj_data["time_delay"],
                    obj_data["simulator_status"], simulator_name)

        sql = """Update """ + table_name + """ set simulator_name= ?, simulation_type=?, cloud_type= ?, cloud_service_type= ?,  data_options = ?, hub_name = ?, device_count = ?, time_delay = ?, simulator_status=? where simulator_name = ? """
        object_id = execute_sql(sql, file_obj)
        return object_id
    except Error as e:
        print(e)


def update_simulator_status(obj):
    simulator_status = 0
    try:
        obj_data = json.loads(obj)
        file_obj = (obj_data["simulator_status"], simulator_name)
        sql = """Update """ + table_name + \
            """ set simulator_status=? where simulator_name = ? """
        object_id = execute_sql(sql, file_obj)
        return object_id
    except Error as e:
        print(e)


def get_simulator_details():
    conn = create_connection()
    cur = conn.cursor()
    data = {}

    create_table_sql = 'create table if not exists ' + table_name + ' (simulator_name varchar(50), simulation_type varchar(50), cloud_type varchar(50), cloud_service_type varchar(50),data_options varchar(50), hub_name varchar(50),' \
                                                                    'device_count integer, time_delay integer, simulator_status varchar(50) )'
    conn.execute(create_table_sql)

    select_table_sql = 'select simulator_name,simulation_type,cloud_type,cloud_service_type,data_options,hub_name,device_count,time_delay,simulator_status from ' + table_name
    for row in cur.execute(select_table_sql):
        data['simulator_name'] = row[0]
        data['simulation_type'] = row[1]
        data['cloud_type'] = row[2]
        data['cloud_service_type'] = row[3]
        data['data_options'] = row[4]
        data['hub_name'] = row[5]
        data['device_count'] = row[6]
        data['time_delay'] = row[7]
        data['simulator_status'] = row[8]

    return json.dumps(data)


def get_stop_status():
    conn = create_connection()
    cur = conn.cursor()
    stop_status = False

    select_table_sql = 'select simulator_status from ' + table_name
    for row in cur.execute(select_table_sql):
        if row[0] == "Idle":
            stop_status = True

    return stop_status


def create_device_count_tbl():
    conn = create_connection()
    create_table_sql = 'create table if not exists ' + device_count_table_name + \
        ' (simulator_name varchar(50), device_count varchar(50))'
    conn.execute(create_table_sql)


def get_device_count():
    conn = create_connection()
    cur = conn.cursor()
    device_count = 0

    select_table_sql = 'select device_count from ' + device_count_table_name
    for row in cur.execute(select_table_sql):
        device_count = row[0]
    return device_count


def insert_devicecount(count_metadata):
    try:
        file_obj = (simulator_name, count_metadata)
        sql = """Insert into """ + device_count_table_name + \
            """(simulator_name, device_count) VALUES (?,?)"""
        response = execute_sql(sql, file_obj)
        return response
    except Error as e:
        print(e)


def update_devicecount(count_metadata):
    try:
        file_obj = (count_metadata, simulator_name)
        sql = """Update """ + device_count_table_name + \
            """ set device_count=? where simulator_name = ? """
        response = execute_sql(sql, file_obj)
        return response
    except Error as e:
        print(e)


# def insert_sdv_model(data):
#     conn = create_connection()
#     create_table_sql = """create table if not exists sdv_models (
#         id integer primary key ,
#         start_time datetime default current_timestamp,
#         train_file varchar(100),
#         sdv_model varchar(100),
#         end_time datetime,
#         status varchar(100))"""
#     conn.execute(create_table_sql)
#     sql = """insert into sdv_models (train_file, sdv_model, status) values(?,?,?)"""
#     response = execute_sql(sql, data)
#     print(response)
#     return response


# def update_sdv_model(data):
#     sql = """Update sdv_models set end_time=?,status=? where id=?"""
#     response = execute_sql(sql, data)
#     return response


# def get_sdv_models(data=None):
#     conn = create_connection()
#     cur = conn.cursor()
#     sql = """select * from sdv_models order by id desc"""
#     cur.execute(sql)
#     columns = [column[0] for column in cur.description]
#     records = cur.fetchall()
#     data = []
#     for record in records:
#         print("records")
#         print(records)
#         data.append(dict(zip(columns, record)))
#     return data

# def get_sdv_models_drop(data=None):
#     conn = create_connection()
#     cur = conn.cursor()
#     sql = """select * from sdv_models where status='completed' order by id desc"""
#     cur.execute(sql)
#     columns = [column[0] for column in cur.description]
#     records = cur.fetchall()
#     data = []
#     for record in records:
#         data.append(dict(zip(columns, record)))
#     return data



# def create_setting_table():
#     conn = create_connection()
#     create_table_sql = 'create table if not exists ' + setting_table_name + ' (azure_subscription_id varchar(100), iot_hub_name varchar(100), iot_connection_string varchar(100), event_hub_name varchar(100), event_hub_connection_string varchar(100), azure_sql_connection_string varchar(100), sdv_model_name varchar(100))'
#     conn.execute(create_table_sql)
#
#
# def insert_setting_details(obj):
#     try:
#         conn = create_connection()
#         ""
#         create_table_sql = 'create table if not exists ' + setting_table_name + ' (id INTEGER PRIMARY KEY AUTOINCREMENT, azure_subscription_id varchar(100), iot_hub_name varchar(100), iot_connection_string varchar(100), event_hub_name varchar(100), event_hub_connection_string varchar(100), azure_sql_connection_string varchar(100), sdv_model_name varchar(100))'
#         conn.execute(create_table_sql)
#         #
#         obj_data = json.loads(obj)
#         file_obj = (obj_data["azure_subscription_id"], obj_data["iot_hub_name"], obj_data["iot_connection_string"],
#                     obj_data["event_hub_name"], obj_data["event_hub_connection_string"],
#                     obj_data["azure_sql_connection_string"], obj_data["sdv_model_name"])
#         sql = """Insert into """ + setting_table_name + """( azure_subscription_id,iot_hub_name,iot_connection_string,event_hub_name,event_hub_connection_string,azure_sql_connection_string,sdv_model_name ) VALUES (?,?,?,?,?,?,?)"""
#         object_id = execute_sql(sql, file_obj)
#         return object_id
#
#     except Error as e:
#         print(e)
#
#
# def get_setting_details():
#     conn = create_connection()
#     cur = conn.cursor()
#     data = {}
#     create_table_sql = 'create table if not exists ' + setting_table_name + ' (id INTEGER PRIMARY KEY AUTOINCREMENT, azure_subscription_id varchar(100), iot_hub_name varchar(100), iot_connection_string varchar(100), event_hub_name varchar(100), event_hub_connection_string varchar(100), azure_sql_connection_string varchar(100), sdv_model_name varchar(100))'
#     conn.execute(create_table_sql)
#
#     select_table_sql = 'select azure_subscription_id,iot_hub_name,iot_connection_string,event_hub_name,event_hub_connection_string,azure_sql_connection_string,sdv_model_name from ' + setting_table_name + ' order by id desc limit 1'
#     for row in cur.execute(select_table_sql):
#         data['azure_subscription_id'] = row[0]
#         data['iot_hub_name'] = row[1]
#         data['iot_connection_string'] = row[2]
#         data['event_hub_name'] = row[3]
#         data['event_hub_connection_string'] = row[4]
#         data['azure_sql_connection_string'] = row[5]
#         data['sdv_model_name'] = row[6]
#     #print(data)
#     return json.dumps(data)
#
#
# def get_hub_details(simulator_type):
#     conn = create_connection()
#     cur = conn.cursor()
#
#     if simulator_type == "iot_hub":
#         select_table_sql = 'select iot_hub_name from ' + setting_table_name
#     else:
#         select_table_sql = 'select event_hub_name from ' + setting_table_name
#
#     for row in cur.execute(select_table_sql):
#         res = row[0]
#
#     return res


# def insert_rel_sdv_model(data):
#     conn = create_connection()
#     create_table_sql = """create table if not exists rel_sdv_models (
#         id integer primary key ,
#         start_time datetime default current_timestamp,
#         meta_file varchar(100),
#         sdv_model varchar(100),
#         end_time datetime,
#         status varchar(100))"""
#     conn.execute(create_table_sql)
#     sql = """insert into rel_sdv_models (meta_file, sdv_model, status) values(?,?,?)"""
#     response = execute_sql(sql, data)
#     print(response)
#     return response
#
#
# def update_rel_sdv_model(data):
#     sql = """Update rel_sdv_models set end_time=?,status=? where id=?"""
#     response = execute_sql(sql, data)
#     return response


# def get_rel_sdv_models(data=None):
#     conn = create_connection()
#     cur = conn.cursor()
#     sql = """select * from rel_sdv_models order by id desc"""
#     cur.execute(sql)
#     columns = [column[0] for column in cur.description]
#     records = cur.fetchall()
#     data = []
#     for record in records:
#         data.append(dict(zip(columns, record)))
#     return data

# def get_rel_sdv_models_drop(data=None):
#     conn = create_connection()
#     cur = conn.cursor()
#     sql = """select * from rel_sdv_models where status='completed' order by id desc"""
#     cur.execute(sql)
#     columns = [column[0] for column in cur.description]
#     records = cur.fetchall()
#     data = []
#     for record in records:
#         data.append(dict(zip(columns, record)))
#     return data