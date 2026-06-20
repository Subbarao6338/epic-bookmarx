import json
from ruamel import yaml
from .db_connection import execute_get_query, execute_insert_query, execute_update_query, execute_delete_query

# stream_validations_table = """CREATE TABLE IF NOT EXISTS stream_validations_store (
#         checkpoint_name VARCHAR(100) NOT NULL,
#         element_count INT,
#         unexpected_count INT,
#         value VARCHAR NOT NULL
#         );"""
# stream_checkpoints_table = """CREATE TABLE IF NOT EXISTS stream_checkpoints (
#         checkpoint_name VARCHAR,
#         datasource_name VARCHAR,
#         expectation_suite_name VARCHAR,
#         status BIT default 0::BIT
#         );"""
# execute_insert_query(stream_validations_table,)
# execute_insert_query(stream_checkpoints_table,)

def db_create_stream_checkpoint(
    checkpoint_name,
    datasource_name,
    expectation_suite_name,
    status=False
):
    query = """INSERT INTO stream_checkpoints (checkpoint_name,datasource_name,expectation_suite_name,status) VALUES(%s,%s,%s,%s)"""
    result = execute_insert_query(
        query,
        [checkpoint_name,
        datasource_name,
        expectation_suite_name,
        status]
    )
    return result

def db_delete_stream_validations(checkpoint_name):
    query = """DELETE FROM stream_validations_store WHERE checkpoint_name=%s"""
    result = execute_delete_query(query, [checkpoint_name])
    return result

def db_delete_stream_checkpoint(checkpoint_name):
    query = """DELETE FROM stream_checkpoints WHERE checkpoint_name=%s"""
    result = execute_delete_query(query, [checkpoint_name])
    return result

def db_getall_stream_checkpoints():
    query = """SELECT * FROM stream_checkpoints"""
    data = execute_get_query(query,)
    return data

def db_get_stream_validations(checkpoint_name):
    query = """SELECT element_count,unexpected_count,value FROM stream_validations_store WHERE checkpoint_name=%s"""
    result = execute_get_query(query, [checkpoint_name])
    for index, _ in enumerate(result):
        result[index]['value'] = json.loads(result[index]['value'])
    return result

def db_get_strem_validation_summary(checkpoint_name):
    query = """SELECT SUM(element_count) as total_element_count,
    SUM(unexpected_count) as total_unexpected_count FROM stream_validations_store WHERE checkpoint_name=%s"""
    result = execute_get_query(query, [checkpoint_name])
    result = dict(result[0])
    return result

def db_update_stream_checkpoint_status(status, checkpoint_name):
    query = """UPDATE stream_checkpoints SET status=%s WHERE checkpoint_name=%s"""
    result = execute_update_query(query,  [status, checkpoint_name])
    return result
