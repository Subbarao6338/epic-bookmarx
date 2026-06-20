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

from ruamel import yaml
from .db_connection import execute_get_query, execute_insert_query, execute_update_query, execute_delete_query


def get_expectation_suite_list():
    query = """SELECT * FROM ge_expectations_store"""
    data = execute_get_query(query, )
    return data


def check_duplicates_suite(name):
    query = """SELECT COUNT(expectation_suite_name) from ge_expectations_store WHERE lower(expectation_suite_name)=(%s)"""
    data = execute_get_query(query, [name.lower()])
    result = int(data[0]["count"])
    if(result > 0):
        return True
    else:
        return False
