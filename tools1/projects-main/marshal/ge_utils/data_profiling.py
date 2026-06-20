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

import json
from textwrap import indent
from pandas_profiling import ProfileReport
import pandas as pd
from great_expectations.core.batch import BatchRequest
import numpy as np
import simplejson as simplejson
from ge_utils.data_context import create_context


def profile_dataframe(df: pd.DataFrame):
    df = df.fillna('')
    df = df.replace(np.nan, 0)
    profile = ProfileReport(df, minimal=True, lazy=False)
    profile.to_file("./profile_report/templates/profile_report.html")
    profile.to_file("./profile_report/profile_report.json")
    required_variable_keys = ["n", "n_distinct", "is_unique", "n_unique", "type", "count",
                              "memory_size", "min", "max", "mean", "std", "variance", "sum",
                              "range", "5%", "25%", "50%", "75%", "95%", ]

    complete_json_report = json.loads(profile.to_json())
    # table = complete_json_report.get('table', {})
    table = json.loads(simplejson.dumps(
        complete_json_report.get('table', {}), ignore_nan=True))
    # variables = complete_json_report.get('variables', {})
    variables = json.loads(simplejson.dumps(
        complete_json_report.get('variables', {}), ignore_nan=True))

    json_df = json.loads(df.to_json())
    filtered_json_report = {
        "dataframe": json_df,
        "table": table,
        "variables": variables,
        "head": df.head().to_dict('records'),
        "tail": df.tail().to_dict('records')
    }
    # print("Report_---->",filtered_json_report)
    # with open("test.json", "w") as f:
    #     f.write(json.dumps(filtered_json_report))
    return filtered_json_report


def profile_data_asset(datasource_name, data_asset_name, row_percentage, columns):
    context = create_context()
    batch_request = {'datasource_name': datasource_name,
                     'data_connector_name': 'default_inferred_data_connector_name',
                     'data_asset_name': data_asset_name,
                     }
    expectation_suite_name = "temp_suite"
    # create temporary suite to use validator
    context.create_expectation_suite(
        expectation_suite_name, overwrite_existing=True)
    # initialize validator
    validator = context.get_validator(
        batch_request=BatchRequest(**batch_request),
        expectation_suite_name=expectation_suite_name
    )
    df = validator.head(fetch_all=True)

    # print(columns)
    if(columns):
        if("All Columns" in columns.split(",")):
            df = df
        else:
            df = df[columns.split(",")]
    else:
        df = df

    total_row = len(df.index)
    req_row = int((row_percentage*total_row)/100)
    # print("ROW--->", req_row)
    df = df.head(req_row)
    # print("DF-->", df)
    context.delete_expectation_suite(expectation_suite_name)
    return profile_dataframe(df)


def get_columns_list(datasource_name, data_asset_name):
    context = create_context()
    batch_request = {'datasource_name': datasource_name,
                     'data_connector_name': 'default_inferred_data_connector_name',
                     'data_asset_name': data_asset_name,
                     }
    expectation_suite_name = "temp_suite"
    # create temporary suite to use validator
    context.create_expectation_suite(
        expectation_suite_name, overwrite_existing=True)
    # initialize validator
    validator = context.get_validator(
        batch_request=BatchRequest(**batch_request),
        expectation_suite_name=expectation_suite_name
    )

    df = validator.head()
    all_col = list(df.columns)
    context.delete_expectation_suite(expectation_suite_name)

    return all_col
