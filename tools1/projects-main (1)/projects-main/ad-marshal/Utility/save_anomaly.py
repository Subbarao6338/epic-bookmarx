"""
=============================================================================
COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""

from Utility import connect_azure_sql as AzureSql
from Utility import db_connection_for_dataset as DB
from Utility import kafka
import json
import pandas as pd
import time
import calendar
from dateutil import parser


def handle_uploaded_file(path, file):
    gmt = time.gmtime()
    ts = calendar.timegm(gmt)
    file_name = file.name.split('.')[0] + "_" + str(ts) + ".csv"
    with open(path + file_name, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)
        return path + file_name


def get_column_list_by_anomaly_id(anomaly_id):
    file_path_response = AzureSql.get_file_path(anomaly_id)
    if file_path_response[1] == 'Database':
        loads = json.loads(file_path_response[0])
        connection_str = loads["connection_string"]
        selected_table = loads["Table"]
        if loads["Database"] != 'mssql':
            anomaly_df = DB.get_table(connection_str, selected_table)
        else:
            anomaly_df = DB.get_mssql_table(connection_str, selected_table)

    else:
        anomaly_df = pd.read_csv(file_path_response[0])

    column_list_obj = list(anomaly_df.columns)
    column_list = []
    for column in column_list_obj:
        column_list.append(column)
    return column_list


def timestamp_difference(timeseries_data, columns):
    column = timeseries_data[columns[0]]
    if type(column[0]) == str:
        prev_time = parser.parse(column[0])
        next_time = parser.parse(column[1])
    else:
        prev_time = column[0]
        next_time = column[1]
    difference = str(next_time - prev_time)
    hl=["1:00:00","0 days, 1:00:00","0 days, 1:00:00"]
    dl=["1 days 0:00:00","1 days, 0:00:00","1 days 00:00:00","1 day, 0:00:00","1 day 0:00:00"]
    ml=["31 days, 0:00:00","31 days 0:00:00","30 days 0:00:00","30 days,0:00:00","29 days 0:00:00","29 days,0:00:00","28 days 0:00:00","28 days,0:00:00"]
    if difference in hl:
        return "hourly"
    elif difference in dl:
        return "daily"
    elif difference in ml:
        return "monthly"
    else:
        return "Interval Not Available"

    # td = "1 days 00:00:00"
    # th = "01:00:00"
    # tm = "31 days 00:00:00"
