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




import json
from Utility import connect_azure_sql as AzureSql
from Utility import db_connection_for_dataset as DB
from Utility import kafka
import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np


def multi_anomaly_detection(file_path, datasource_type, form_id, selected_param, model_name):
    if datasource_type == "Database":
        connection_str = json.loads(file_path)["connection_string"]
        selected_table = json.loads(file_path)["Table"]
        if json.loads(file_path)["Database"] != "mssql":
            uploaded_data = DB.get_table(connection_str, selected_table)
        else:
            uploaded_data = DB.get_mssql_table(connection_str, selected_table)

        selected_param = selected_param.split(',')
        uploaded_data = pd.DataFrame(uploaded_data[selected_param])
    elif datasource_type == "Local":
            uploaded_data = pd.read_csv(file_path)
            selected_param = selected_param.split(',')
            uploaded_data = pd.DataFrame(uploaded_data[selected_param])
    col = uploaded_data.columns
    # nfeatures = len(col)
    # maxfeatures=nfeatures
    random_state = np.random.RandomState(42)
    if model_name == "Isolation Forest":
        model = IsolationForest(n_estimators=100, max_samples='auto', contamination=float(0.2), random_state=random_state)
    model.fit(uploaded_data[col])
    # print(model.get_params())
    uploaded_data['scores'] = model.decision_function(uploaded_data[col])
    uploaded_data['anomaly_score'] = model.predict(uploaded_data[col])
    anomaly_indexes = list(uploaded_data.index.values)
    i = pd.Series(anomaly_indexes, name='index')
    uploaded_data = pd.concat([i, uploaded_data], axis=1)
    results = uploaded_data[uploaded_data['anomaly_score'] == -1]
    # print(results)
    if any(results):
        print('An anomaly was detected at index:')
        r = results[results['anomaly_score'] == -1]
        del r['anomaly_score']
        r1 = r.to_json(orient='records')
        # print(r1)
        total_row_count = len(uploaded_data.index)
        anomaly_row_count = len(r.index)
        if r1 != []:
            # json_data = json.dumps(r1, default=str)
            json_data = r1
            print(json_data)
            # json_data = json.dumps(json_data_str)
            AzureSql.update_results(form_id, json_data, total_row_count, anomaly_row_count)
        else:
            print('No anomalies were detected in the time series.')
            json_data = json.dumps("No anomalies were detected in the time series.")
            AzureSql.update_results(form_id, json_data, total_row_count, anomaly_row_count)
