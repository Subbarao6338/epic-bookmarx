import configparser
import json
import os
from datetime import datetime
from sqlalchemy.engine import URL
from sqlalchemy import create_engine

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")
config_parser = configparser.ConfigParser()
config_parser.read(os.path.join(config_path, "singleview.ini"))

def connect_sql():
    TargetServer = config_parser.get("db_datagenie_and_ads", "TargetServer")
    TargetDb = config_parser.get("db_datagenie_and_ads", "TargetDb")
    UserName = config_parser.get("db_datagenie_and_ads", "UserName")
    Password = config_parser.get("db_datagenie_and_ads", "Password")

    # Configure the Connection
    connection_string = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=' + TargetServer + ';DATABASE=' + TargetDb + ';UID=' + UserName + ';PWD=' + Password
    connection_url = URL.create("mssql+pyodbc", query={"odbc_connect": connection_string})
    engine = create_engine(connection_url, echo=True)
    return engine


def get_data_genie_models_count():
    try:
        connect_engine = connect_sql()
        query1 = """SELECT COUNT(id) FROM [dbo].[sdv_models] WHERE status='completed'"""
        query2 = """SELECT COUNT(id) FROM [dbo].[rel_sdv_models] WHERE status='completed'"""
        result1 = connect_engine.execute(query1)
        for row in result1:
            count1 = int(row[0])
        result2 = connect_engine.execute(query2)
        for row in result2:
            count2 = int(row[0])
        return count1 + count2
    except:
        return 0

def get_ads_source_count():
    try:
        connect_engine = connect_sql()
        query = """SELECT COUNT(ID) FROM [dbo].[Anomaly_Input_Files]"""
        result = connect_engine.execute(query)
        for row in result:
            count = int(row[0])
        return count
    except:
        return 0