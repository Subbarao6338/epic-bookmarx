"""
=============================================================================
COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
emains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""

import urllib.parse


def postgres_conn_str(USERNAME, PASSWORD, HOST, PORT, DATABASE):
    connection_str = "postgresql+psycopg2://" + USERNAME + \
        ":" + PASSWORD + "@" + HOST + ":" + PORT + "/" + DATABASE
    return connection_str


def mysql_conn_str(USERNAME, PASSWORD, HOST, PORT, DATABASE):
    connection_str = "mysql+pymysql://" + USERNAME + ":" + \
        PASSWORD + "@" + HOST + ":" + PORT + "/" + DATABASE
    return connection_str


def mssql_conn_str(USERNAME, PASSWORD, HOST, PORT, DATABASE, DRIVER):
    connection_str = "mssql+pyodbc://" + USERNAME + ":" + PASSWORD + "@" + HOST + \
        ":" + PORT + "/" + DATABASE + "?driver=" + \
        DRIVER + "&charset=utf&autocommit=true"
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
    connection_str = "postgresql+psycopg2://" + USERNAME + ":" + PASSWORD + \
        "@" + HOST + ":" + PORT + "/" + DATABASE + "?sslmode=" + SSLMODE
    return connection_str


def snowflake_conn_str(USERNAME, PASSWORD, ACCOUNT_NAME, DATABASE_NAME, SCHEMA_NAME, WAREHOUSE_NAME, ROLE_NAME):
    connection_Str = "snowflake://" + USERNAME + ":" + PASSWORD + "@" + ACCOUNT_NAME + "/" + \
        DATABASE_NAME + "/" + SCHEMA_NAME + "?warehouse=" + \
        WAREHOUSE_NAME + "&role=" + ROLE_NAME
    return connection_Str


def get_connection_string(json_body):
    database_name = json_body["database_name"]

    if database_name == 'postgresql':
        username = json_body['pg_username']
        password = urllib.parse.quote_plus(json_body['pg_password'])
        host = json_body['pg_host']
        port = json_body['pg_port']
        database = json_body['pg_database']
        conn_str = postgres_conn_str(username, password, host, port, database)
        return conn_str

    elif database_name == 'mysql':
        username = json_body['mysql_username']
        password = urllib.parse.quote_plus(json_body['mysql_password'])
        host = json_body['mysql_host']
        port = json_body['mysql_port']
        database = json_body['mysql_database']
        conn_str = mysql_conn_str(username, password, host, port, database)
        return conn_str

    elif database_name == 'mssql':
        username = json_body['mssql_username']
        password = urllib.parse.quote_plus(json_body['mssql_password'])
        host = json_body['mssql_host']
        port = json_body['mssql_port']
        database = json_body['mssql_database']
        # driver = json_body['mssql_driver']
        driver = "ODBC Driver 17 for SQL Server"
        conn_str = mssql_conn_str(
            username, password, host, port, database, driver)
        return conn_str

    elif database_name == 'sqlite':
        path = json_body['db_path']
        conn_str = sqlite_conn_str(path)
        return conn_str

    elif database_name == 'athena':
        url = json_body['s3_dir_url']
        conn_str = athena_conn_str(url)
        return conn_str

    elif database_name == 'bigquery':
        cgp_project_name = json_body['cgp_project_name']
        bigquery_dataset = json_body['bigquery_dataset']
        conn_str = bigquery_conn_str(cgp_project_name, bigquery_dataset)
        return conn_str

    elif database_name == 'redshift':
        username = json_body['rs_username']
        password = urllib.parse.quote_plus(json_body['rs_password'])
        host = json_body['rs_host']
        port = json_body['rs_port']
        database = json_body['rs_database']
        sslmode = json_body['rs_sslmode']
        conn_str = redshift_conn_str(
            username, password, host, port, database, sslmode)
        return conn_str

    elif database_name == 'snowflake':
        username = json_body['sn_username']
        password = urllib.parse.quote_plus(json_body['sn_password'])
        account_name = json_body['sn_account_name']
        database = json_body['sn_database']
        schema_name = json_body['sn_schema_name']
        warehouse_name = json_body['sn_warehouse_name']
        role_name = json_body['sn_role_name']
        conn_str = snowflake_conn_str(
            username, password, account_name, database, schema_name, warehouse_name, role_name)
        return conn_str

    else:
        return ValueError("Invalid Database type")
