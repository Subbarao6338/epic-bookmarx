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



import json
import pandas as pd
import pycaret
from pycaret.anomaly import *
from Utility import connect_azure_sql as AzureSql
from Utility import db_connection_for_dataset as DB
from Utility import kafka


def graviton_anomaly_detection(file_path, datasource_type, form_id, selected_param, time_param, model):
    if datasource_type == "Database":
        connection_str = json.loads(file_path)["connection_string"]
        selected_table = json.loads(file_path)["Table"]
        if json.loads(file_path)["Database"] != "mssql":
            uploaded_data = DB.get_table(connection_str, selected_table)
        else:
            uploaded_data = DB.get_mssql_table(connection_str, selected_table)

        timestamp_data_list = uploaded_data[time_param]
        uploaded_data = pd.DataFrame(uploaded_data[selected_param])

    else:
        uploaded_data = pd.read_csv(file_path)
        timestamp_data_list = uploaded_data[time_param]
        uploaded_data = pd.DataFrame(uploaded_data[selected_param])

    # This function initializes the training environment and creates the transformation pipeline.
    #* Setup function must be called before executing any other function.
    setup(uploaded_data, silent=True, log_experiment=True, normalize=True)
    # model_name = 'iforest'
    if model == "Angle-base Outlier Detection":
        model_name = 'abod'
    elif model == "Clustering-Based Local Outlier":
        model_name = 'cluster'
    elif model == "Connectivity-Based Local Outlier":
        model_name = 'cof'
    elif model == "Isolation Forest":
        model_name = 'iforest'
    elif model == "Histogram-based Outlier Detection":
        model_name = 'histogram'
    elif model == "K-Nearest Neighbors Detector":
        model_name = 'knn'
    elif model == "Local Outlier Factor":
        model_name = 'lof'
    elif model == "One-class SVM detector":
        model_name = 'svm'
    elif model == "Principal Component Analysis":
        model_name = 'pca'
    elif model == "Minimum Covariance Determinant":
        model_name = 'mcd'
    elif model == "Subspace Outlier Detection":
        model_name = 'sod'
    elif model == "Stochastic Outlier Selection":
        model_name = 'sos'

    #* Trains a given model from the model library.
    m = create_model(model_name)

    #* Assigns anomaly labels to the dataset for a given model.
    results = assign_model(m)

    #* This function generates anomaly labels on using a trained model.
    predict_model(m, data=uploaded_data)

    # This function analyzes the performance of a trained model.
    # evaluate_model(m)

    # print(results['Anomaly'].sum())

    # This function tunes the ``fraction`` parameter of a given model.
    # tune_model(m)

    # This function displays a user interface for analyzing performance of a trained model.
    # plot_model(m, plot=chart)

    # This function retrieves the global variables created when initializing the ``setup`` function.
    # get_config(variable: str)

    ## Callable from any external environment without requiring setup initialization.
    # results=get_outliers(uploaded_data, model=model_name, normalize=True, log_experiment=True)

    if any(results):
        print('An anomaly was detected at index:')
        # print(results[results['Anomaly'] == 1])
        anomalies = results[results["Anomaly"] == 1]
        anomaly_indexes = list(anomalies.index.values)
        # print(type(anomaly_indexes), anomaly_indexes)
        final_result = []
        for i in anomaly_indexes:
            temp = {}
            temp["index"] = i
            temp[time_param] = timestamp_data_list[i]
            temp[selected_param] = list(results[selected_param])[i]
            final_result.append(temp)
        # print(final_result)
        total_row_count = len(uploaded_data.index)
        anomaly_row_count = len(final_result)
        if final_result != []:
            json_data = json.dumps(final_result, default=str)
            print(json_data)
            json_data_str = json.loads(json_data)
            json_data = json.dumps(json_data_str)
            AzureSql.update_results(form_id, json_data, total_row_count, anomaly_row_count)
        else:
            print('No anomalies were detected in the time series.')
            json_data = json.dumps("No anomalies were detected in the time series.")
            AzureSql.update_results(form_id, json_data, total_row_count, anomaly_row_count)
