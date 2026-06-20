from .db_connection import execute_get_query, execute_insert_query, execute_delete_query

# datasource_table = """CREATE TABLE IF NOT EXISTS ge_datasources_store (
#         datasource_name VARCHAR(100) NOT NULL,
#         type VARCHAR,
#         json VARCHAR,
#         value VARCHAR NOT NULL
#         );"""
# execute_insert_query(datasource_table, )


def get_datasource_list():
    query = """SELECT datasource_name, type, json FROM ge_datasources_store"""
    data = execute_get_query(query, )
    # print(data)
    return data

def get_datasources():
    query = """SELECT datasource_name,value FROM ge_datasources_store"""
    data = execute_get_query(query,)
    return data

def insert_datasource(name, type, json, config):
    query = """INSERT INTO ge_datasources_store (datasource_name,type,json,value) VALUES(%s,%s,%s,%s);"""
    result = execute_insert_query(query, [name, type, json, config])
    return result

def check_duplicates_datasource(name):
    query = """SELECT COUNT(datasource_name) from ge_datasources_store WHERE lower(datasource_name)=(%s)"""
    data = execute_get_query(query, [name.lower()])
    # print("data-->", data)
    result = int(data[0]["count"])
    if(result > 0):
        return True
    else:
        return False


def db_delete_datasource(datasource_name):
    query = """DELETE FROM ge_datasources_store WHERE datasource_name=%s"""
    result = execute_delete_query(query, [datasource_name])
    return result

def get_ds_details(ds_name):
    query = """SELECT json, value, type FROM ge_datasources_store WHERE datasource_name=%s;"""
    data = execute_get_query(query, [ds_name])
    # print(data)
    return data[0]
