"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""


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


def execute_query(query, data_obj=None):
    conn = connect_sql()
    cursor = conn.cursor()
    try:
        cursor.execute(query, data_obj)
        conn.commit()
        return True
    except Exception as e:
        print(e)
        return False
    finally:
        cursor.close()
        conn.close()


def execute_get_query(query, data_obj=None):
    conn = connect_sql()
    cursor = conn.cursor()
    try:
        cursor.execute(query, data_obj)
        records = cursor.fetchall()
        columns = cursor.description
        data = []
        for row in records:
            temp = {}
            for i in range(len(columns)):
                temp[columns[i].name] = str(row[i])
            data.append(temp)
        return data
    except Exception as e:
        print(e)
        return None
    finally:
        cursor.close()
        conn.close()