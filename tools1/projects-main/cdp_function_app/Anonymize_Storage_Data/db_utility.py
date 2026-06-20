import configparser
import json
from sqlalchemy import create_engine, sql
from sqlalchemy.engine import URL


config_parser = configparser.ConfigParser()
config_parser.read('Anonymize_Storage_Data/config.ini')

db_server = config_parser.get("config", "server_name")
db_name = config_parser.get("config", "database_name")
db_user_name = config_parser.get("config", "user_name")
db_user_password = config_parser.get("config", "password")

subscription_id = config_parser.get("config", "subscription_id")

def connect_sql():
    try:
        # Configure the Connection
        connection_string = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=' + db_server + ';DATABASE=' + db_name + ';UID=' + db_user_name + ';PWD=' + db_user_password
        connection_url = URL.create("mssql+pyodbc", query={"odbc_connect": connection_string})
        engine = create_engine(connection_url)
        return engine
    except Exception as e:
        print(e)
        return None

def get_credential_by_zone(zone_name):
    sql_statement = "SELECT * from [dbo].[service_principal_config] WHERE zone = '{}' and subscription_id = '{}'".format(zone_name, subscription_id)
    sql_engine = connect_sql()
    result = sql_engine.execute(sql_statement).first()    
    sql_engine.dispose()
    return dict(result)

   
