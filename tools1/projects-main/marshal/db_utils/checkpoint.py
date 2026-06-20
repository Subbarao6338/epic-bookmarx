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

from .db_connection import execute_get_query, execute_insert_query, execute_update_query, execute_delete_query
from ruamel import yaml


def db_get_checkpoints():
    query = """SELECT * FROM ge_checkpoint_store"""
    results = execute_get_query(query,)
    final_res = []
    for item in results:
        result = yaml.safe_load(dict(item)['value'])
        final_res.append(result)
    return final_res


def check_duplicate_checkpoint(name):
    query = """SELECT COUNT(checkpoint_name) from ge_checkpoint_store WHERE lower(checkpoint_name)=(%s)"""
    data = execute_get_query(query, [name.lower()])
    result = int(data[0]["count"])
    if(result > 0):
        return True
    else:
        return False


def db_delete_checkpoint_on_ds_delete(datasource_name):
    all_detail = db_get_checkpoints()
    for detail in all_detail:
        if(detail['validations'][0]['batch_request']['datasource_name'] == datasource_name):
            query = """DELETE FROM ge_checkpoint_store WHERE checkpoint_name=(%s)"""
            execute_delete_query(query, [detail['name']])
    return True


def db_delete_checkpoint_on_suite_delete(suite_name):
    all_detail = db_get_checkpoints()
    for detail in all_detail:
        if(detail['validations'][0]['expectation_suite_name'] == suite_name):
            query = """DELETE FROM ge_checkpoint_store WHERE checkpoint_name=(%s)"""
            execute_delete_query(query, [detail['name']])
    return True
