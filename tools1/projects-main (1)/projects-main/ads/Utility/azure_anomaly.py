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



from azure.ai.anomalydetector import AnomalyDetectorClient
from azure.ai.anomalydetector.models import DetectRequest, TimeSeriesPoint, TimeGranularity, AnomalyDetectorError
from azure.core.credentials import AzureKeyCredential
from Utility import connect_azure_sql as AzureSql
from Utility import db_connection_for_dataset as DB
from Utility import kafka
import json
from dateutil import parser
import csv
from django.http import HttpResponse


def azure_anomaly(file_path, datasource_type, form_id, date_param, selected_param, column_list, anomaly_type, anomaly_interval):
    setting_details = AzureSql.get_setting_values()
    SUBSCRIPTION_KEY = setting_details['subscription_key']
    ANOMALY_DETECTOR_ENDPOINT = setting_details['ad_endpoint']
    client = AnomalyDetectorClient(AzureKeyCredential(SUBSCRIPTION_KEY), ANOMALY_DETECTOR_ENDPOINT)
    total_row_count = 0
    anomaly_row_count = 0
    if datasource_type == "Database":
        connection_str = json.loads(file_path)["connection_string"]
        selected_table = json.loads(file_path)["Table"]
        if json.loads(file_path)["Database"] != "mssql":
            df = DB.get_table(connection_str, selected_table)
        else:
            df = DB.get_mssql_table(connection_str, selected_table)
        series = []
        selected_param_ls = df[selected_param]
        date_str_ls = df[date_param]
        total_row_count = len(df.index)
        for i in range(len(date_str_ls)):
            date_val = parser.parse(str(date_str_ls[i]))
            series.append(TimeSeriesPoint(timestamp=date_val, value=selected_param_ls[i]))
    else:
        TIME_SERIES_DATA_PATH = file_path
        series = []
        with open(TIME_SERIES_DATA_PATH) as data_file:
            csv_reader = csv.reader(data_file)
            next(csv_reader)
            ind_param = column_list.index(selected_param)
            for row in csv_reader:
                date_str = row[0]
                date_val = parser.parse(date_str)
                # iso_date = date_val.isoformat()
                series.append(TimeSeriesPoint(timestamp=date_val, value=row[ind_param]))
                total_row_count = total_row_count+1

    if anomaly_interval == "secondly":
        request = DetectRequest(series=series, granularity=TimeGranularity.PER_SECOND)
    elif anomaly_interval == "minutely":
        request = DetectRequest(series=series, granularity=TimeGranularity.PER_MINUTE)
    elif anomaly_interval == "hourly":
        request = DetectRequest(series=series, granularity=TimeGranularity.HOURLY)
    elif anomaly_interval == "daily":
        request = DetectRequest(series=series, granularity=TimeGranularity.DAILY)
    elif anomaly_interval == "monthly":
        request = DetectRequest(series=series, granularity=TimeGranularity.MONTHLY)
    print('Detecting anomalies in the time series.')

    try:
        if anomaly_type == "entire":
            response = client.detect_entire_series(request)
            res = response.is_anomaly
        elif anomaly_type == "last":
            response = client.detect_last_point(request)
            res = response.is_anomaly
        elif anomaly_type == "change":
            response = client.detect_change_point(request)
            res = response.is_change_point
    except AnomalyDetectorError as e:
        print('Error code: {}'.format(e.error.code), 'Error message: {}'.format(e.error.message))
        return HttpResponse(json.dumps("Failed"), content_type="application/json")
    except Exception as e:
        print(e)
        return HttpResponse(json.dumps("Failed"), content_type="application/json")

    if any(res):
        data_list = []
        print('An anomaly was detected at index:')
        for i, value in enumerate(res):
            if value:
                anomaly_data = {'index': i, 'timestamp': series[i].timestamp, 'value': series[i].value}
                data_list.append(anomaly_data)
        json_data = json.dumps(data_list, default=str)
        json_data_str = json.loads(json_data)
        json_data = json.dumps(json_data_str)
        anomaly_row_count = len(data_list)
        AzureSql.update_results(form_id, json_data, total_row_count, anomaly_row_count)
        '''ts = calendar.timegm(time.gmtime())
        with open("Result_Json/sample_change_" + str(ts) + ".json", "w") as outfile:
            outfile.write(json_data)'''

    else:
        print('No anomalies were detected in the time series.')
        json_data1 = json.dumps("No anomalies were detected in the time series.")
        '''ts = calendar.timegm(time.gmtime())
        with open("Result_Json/sample_" + str(ts) + ".json", "w") as outfile:
            outfile.write(json_data1)'''
        AzureSql.update_results(form_id, json_data1, total_row_count, anomaly_row_count)
