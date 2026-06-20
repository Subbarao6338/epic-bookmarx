import datetime
import json
from ruamel import yaml
from .db_connection import execute_get_query, execute_insert_query, execute_update_query, execute_delete_query

def db_get_validations():
    query = """SELECT * FROM ge_validations_store"""
    data = execute_get_query(query,)
    for index, value in enumerate(data):
        data[index]["run_time"] = datetime.datetime.strptime(
            value['run_time'], "%Y%m%dT%H%M%S.%fZ")
        data[index]['value'] = json.loads(value['value'])
    return data

def db_delete_validation(suite_name, run_mame):
    query = """DELETE FROM ge_validations_store WHERE expectation_suite_name=%s AND run_name=%s"""
    result = execute_delete_query(query, [suite_name, run_mame])
    return result


def db_delete_validation_on_ds_delete(datasource_name):
    query = """SELECT * FROM ge_validations_store"""
    result = execute_get_query(query,)
    for item in result:
        res = yaml.safe_load(dict(item)['value'])
        if(res['meta']["active_batch_definition"]["datasource_name"]==datasource_name):
            query = """DELETE FROM ge_validations_store WHERE run_name=(%s)"""
            execute_delete_query(query, [item['run_name']])  
    return True

def db_delete_validation_on_suite_delete(suite_name):
    query = """DELETE FROM ge_validations_store WHERE expectation_suite_name=(%s)"""
    execute_delete_query(query, [suite_name])
    return True

def db_delete_validation_on_checkpoint_delete(checkpoint_name):
    query = """SELECT run_name FROM ge_validations_store"""
    result = execute_get_query(query)
    run_name_ls = []
    for row in result:
        row = dict(row)
        name = row['run_name'].split('-')[0]
        if(checkpoint_name == name):
            # print(row['run_name'])
            run_name_ls.append(row['run_name'])
            query = """DELETE FROM ge_validations_store WHERE run_name=(%s)"""
            execute_delete_query(query, [row['run_name']])
    return run_name_ls