"""
=============================================================================
COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
import os
import psycopg2
import configparser

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")

config_parser = configparser.ConfigParser()
print(os.path.join(config_path, "singleview.ini"))
config_parser.read(os.path.join(config_path, "singleview.ini"))


def connect_sql_dqc():
    host = config_parser.get("db_hawkeye_dqc", "host")
    database = config_parser.get("db_hawkeye_dqc", "database")
    username = config_parser.get("db_hawkeye_dqc", "user")
    password = config_parser.get("db_hawkeye_dqc", "password")
    port = config_parser.get("db_hawkeye_dqc", "port")
    connection = psycopg2.connect(dbname=database, user=username, password=password, host=host, port=port)
    return connection

def connect_sql_synergizer():
    host = config_parser.get("db_synergizer", "host")
    database = config_parser.get("db_synergizer", "database")
    username = config_parser.get("db_synergizer", "user")
    password = config_parser.get("db_synergizer", "password")
    port = config_parser.get("db_synergizer", "port")
    connection = psycopg2.connect(dbname=database, user=username, password=password, host=host, port=port)
    return connection


def get_dqc_rules_count():
    try:
        conn = connect_sql_dqc()
        cursor = conn.cursor()
        query = """SELECT COUNT(DISTINCT(expectation_suite_name, expectation_name)) FROM ge_api_resultv1"""
        cursor.execute(query,)
        record = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        return record[0]
    except:
        return 0

