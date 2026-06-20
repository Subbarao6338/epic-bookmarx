"""Copyright"""
"""
* =============================================================================
* COPYRIGHT NOTICE
* =============================================================================
*  © Copyright HCL Technologies Ltd. 2021, 2022
* Proprietary and confidential. All information contained herein is, and
* remains the property of HCL Technologies Limited. Copying or reproducing the
* contents of this file, via any medium is strictly prohibited unless prior
* written permission is obtained from HCL Technologies Limited.
"""

from django.template import engines
from sqlalchemy import create_engine
import pandas as pd
import pyodbc


def postgres_conn_str(USERNAME, PASSWORD, HOST, PORT, DATABASE):
    connection_str = "postgresql+psycopg2://" + USERNAME + ":" + PASSWORD + "@" + HOST + ":" + PORT + "/" + DATABASE
    return connection_str


def mysql_conn_str(USERNAME, PASSWORD, HOST, PORT, DATABASE):
    connection_str = "mysql+pymysql://" + USERNAME + ":" + PASSWORD + "@" + HOST + ":" + PORT + "/" + DATABASE
    return connection_str


def mssql_conn_str(USERNAME, PASSWORD, HOST, DATABASE):
    #cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER='+HOST+','+PORT+';DATABASE='+DATABASE+';UID='+USERNAME+';PWD='+PASSWORD)
    connection_str = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=' + HOST + ';DATABASE=' + DATABASE + ';UID=' + USERNAME + ';PWD=' + PASSWORD
    # connection_str = pyodbc.connect(str(cnxn))
    # engine = create_engine(cnxn)
    # print("engine",engine)
    return connection_str


def sqlite_conn_str(PATH_TO_DB_FILE):
    connection_str = "sqlite://" + PATH_TO_DB_FILE
    return connection_str


def athena_conn_str(URL):
    connection_str = URL
    return connection_str


def bigquery_conn_str(GCP_PROJECT_NAME, BIGQUERY_DATASET):
    connection_str = "bigquery://" + GCP_PROJECT_NAME + "/" + BIGQUERY_DATASET
    return connection_str


def redshift_conn_str(USERNAME, PASSWORD, HOST, PORT, DATABASE, SSLMODE):
    connection_str = "postgresql+psycopg2://" + USERNAME + ":" + PASSWORD + "@" + HOST + ":" + PORT + "/" + DATABASE + "?sslmode=" + SSLMODE
    return connection_str


def snowflake_conn_str(USERNAME, PASSWORD, ACCOUNT_NAME, DATABASE_NAME, SCHEMA_NAME, WAREHOUSE_NAME, ROLE_NAME):
    connection_Str = "snowflake://" + USERNAME + ":" + PASSWORD + "@" + ACCOUNT_NAME + "/" + DATABASE_NAME + "/" + SCHEMA_NAME + "?warehouse=" + WAREHOUSE_NAME + "&role=" + ROLE_NAME
    return connection_Str


def get_connection_string(json_body):
    database_type = json_body["database_type"]

    if database_type=='postgresql':
        username = json_body['username']
        password = json_body['password']
        host = json_body['host']
        port = json_body['port']
        database = json_body['database_name']
        conn_str = postgres_conn_str(username, password, host, port, database)
        return conn_str

    elif database_type=='mysql':
        username = json_body['username']
        password = json_body['password']
        host = json_body['host']
        port = json_body['port']
        database = json_body['database_name']
        conn_str = mysql_conn_str(username, password, host, port, database)   
        return conn_str

    elif database_type == 'mssql':  
        username = json_body['username']
        password = json_body['password']
        host = json_body['host']
        #port = json_body['port']
        database = json_body['database_name']
        # driver = '{ODBC Driver 17 for SQL Server}'
        conn_str = mssql_conn_str(username, password, host, database)
        return conn_str

    elif database_type == 'sqlite':
        path = json_body['db_path']
        conn_str = sqlite_conn_str(path)
        return conn_str

    # elif database_type == 'redshift':
    #     username = json_body['rs_username']
    #     password = json_body['rs_password']
    #     host = json_body['rs_host']
    #     port = json_body['rs_port']
    #     database = json_body['rs_database']
    #     sslmode = json_body['rs_sslmode']
    #     conn_str = redshift_conn_str(username, password, host, port, database, sslmode)
    #     return conn_str

    # def mssql_conn_str(USERNAME, PASSWORD, HOST, PORT, DATABASE):
    #     # connection_str = pyodbc.connect('DRIVER={SQL Server};SERVER=LP-213764071\\SQLEXPRESS;DATABASE=umesh;UID=uma2;PWD=224894@Uu')
    #     # cursor = cnxn.cursor()
    #     # connection_str = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=tcp:'+HOST+','+PORT+';DATABASE='+DATABASE+';UID='+USERNAME+';PWD='+PASSWORD+';Trusted_Connection=yes')
    #     connection_str = pyodbc.connect(
    #         'DRIVER={SQL Server};SERVER=' + HOST + ',' + PORT + ';DATABASE=' + DATABASE + ';UID=' + USERNAME + ';PWD=' + PASSWORD)
    #     # cursor.execute("SELECT * FROM [dbo].[CUSTOMERS]")
    #     # for row in cursor.fetchall():
    #     #     print(row)
    #     # connection_str = pyodbc.connect('DRIVER={SQL Server};SERVER=prathamcdpserver.database.windows.net;DATABASE=cdp_db;UID=cdpadmin;PWD=device@123')
    #     cursor = connection_str.cursor()
    #     df = []
    #     for row in cursor.tables():
    #         # row.table_name
    #         df.append(row.table_name)
    #     print("tables", df)
    #     # cursor.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES ")
    #     # tables = cursor.fetchone()
    #     # print("ppppppppppppppppppp",connection_str,"ccccccccccccc",cursor,"tttttttttt",tables)
    #     # connection_str="mssql+pyodbc://"+USERNAME+":"+PASSWORD+"@"+HOST+":"+PORT+"/"+DATABASE+"?driver=ODBC+Driver+17+for+SQL+Server"
    #     return connection_str

    # elif database_type == 'snowflake':
    #     username = json_body['sn_username']
    #     password = json_body['sn_password']
    #     account_name = json_body['sn_account_name']
    #     database = json_body['sn_database']
    #     schema_name = json_body['sn_schema_name']
    #     warehouse_name = json_body['sn_warehouse_name']
    #     role_name = json_body['sn_role_name']
    #     conn_str = snowflake_conn_str(username, password, account_name, database, schema_name, warehouse_name, role_name)
    #     return conn_str

    else:
        return ValueError("Invalid Database type")


def connect_to_mssql(connection_str):
    # print(connection_str)
    cnxn = pyodbc.connect(str(connection_str))
    cursor = cnxn.cursor()
    df = []
    for row in cursor.tables():
        df.append(row.table_name)
    # print("tables", df)
    return df


def connect_to_database(connection_str):
    engine = create_engine(connection_str)
    ls = engine.table_names()
    # print("ls",ls)
    return ls


def get_table(connection_str, table):
    engine = create_engine(connection_str).connect()
    df = pd.read_sql_table(table, engine)
    # print("df",df)
    return df


def get_mssql_table(connection_str, table):
    cnxn = pyodbc.connect(connection_str)
    query="""select * from """+table+""";"""
    df = pd.read_sql_query(query, cnxn)
    # print("df",df.dtypes)
    return df
