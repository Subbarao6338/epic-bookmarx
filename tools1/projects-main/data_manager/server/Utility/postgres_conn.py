from msilib.schema import Error
import os
import psycopg2
import configparser

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")

config_parser = configparser.ConfigParser()
print(os.path.join(config_path, "database.ini"))
config_parser.read(os.path.join(config_path, "database.ini"))


def connect_sql():
    host = config_parser.get("postgresql", "host")
    database = config_parser.get("postgresql", "database")
    username = config_parser.get("postgresql", "user")
    password = config_parser.get("postgresql", "password")
    port = config_parser.get("postgresql", "port")
    connection = psycopg2.connect(dbname=database, user=username, password=password, host=host, port=port)
    return connection


# DATASOURCE/SETTINGS PAGE SQL FUNCTIONS


def execute_insert_query(query, data_obj):
    conn = connect_sql()
    cursor = conn.cursor()
    cursor.execute(query, data_obj)
    conn.commit()
    cursor.close()
    conn.close()
    return "Success"


def execute_get_query(query, data_obj):
    conn = connect_sql()
    cursor = conn.cursor()
    cursor.execute(query, data_obj)
    records = cursor.fetchall()
    columns = cursor.description
    conn.commit()
    cursor.close()
    conn.close()
    ret = {}
    data = []
    for row in records:
        temp = {}
        for i in range(len(columns)):
            # print(i, columns[i].name, row[i])
            temp[columns[i].name] = str(row[i])
        data.append(temp)
    ret['data'] = data
    ret['message'] = "Success"
    return ret


def execute_update_query(query):
    conn = connect_sql()
    cursor = conn.cursor()
    cursor.execute(query)
    conn.commit()
    cursor.close()
    conn.close()
    return "Success"


def execute_delete_query(query, data_obj):
    conn = connect_sql()
    cursor = conn.cursor()
    cursor.execute(query, data_obj)
    conn.commit()
    cursor.close()
    conn.close()
    return "Success"
    
    
def execute_create_query(query):
    conn = connect_sql()
    cursor = conn.cursor()
    cursor.execute(query)
    conn.commit()
    cursor.close()
    conn.close()
    return "Success"


def execute_delete_all_query(query):
    conn = connect_sql()
    cursor = conn.cursor()
    cursor.execute(query)
    conn.commit()
    cursor.close()
    conn.close()
    return "Success"
    