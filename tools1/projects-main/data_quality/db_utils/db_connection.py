import sqlalchemy as sa
import psycopg2
import configparser
import os

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")

config_parser = configparser.ConfigParser()
config_parser.read(os.path.join(config_path, "database.ini"))


def connect_sql():
    host = config_parser.get("postgresql", "host")
    database = config_parser.get("postgresql", "database")
    user = config_parser.get("postgresql", "user")
    password = config_parser.get("postgresql", "password")
    port = config_parser.get("postgresql", "port")
    connection = psycopg2.connect(dbname=database, user=user, password=password, host=host, port=port)

    return connection


def execute_insert_query(query, data_obj=None):
    print(query)
    conn = connect_sql()
    cursor = conn.cursor()
    cursor.execute(query, data_obj)
    conn.commit()
    cursor.close()
    conn.close()
    return "Success"


def execute_get_query(query, data_obj=None):
    print(query)
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
    return data


def execute_update_query(query, data_obj):
    print(query)
    conn = connect_sql()
    cursor = conn.cursor()
    cursor.execute(query, data_obj)
    conn.commit()
    cursor.close()
    conn.close()
    return "Success"


def execute_delete_query(query, data_obj=None):
    print(query)
    conn = connect_sql()
    cursor = conn.cursor()
    cursor.execute(query, data_obj)
    conn.commit()
    cursor.close()
    conn.close()
    return "Success"


