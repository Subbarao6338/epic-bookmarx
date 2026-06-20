from datetime import datetime
import logging
import json
import pandas as pd
import requests

import azure.functions as func
from ConnectedFactory_Stream_Data_Classifier.model_prediction import predictJson as predict, update_with_global_feature, update_with_local_feature, get_local_features

def get_data(list_data):
    return pd.DataFrame.from_dict(list_data)

def send_prediction_data_PBI(prediction_df):
    if len(prediction_df) < 1:
        return True
    try:
        pass_dataframe = prediction_df.loc[prediction_df['Prediction'] == 1]
        fail_dataframe = prediction_df.loc[prediction_df['Prediction'] == 0]
        try:
            if len(fail_dataframe) > 0:
                conter_factual_df = get_local_features(fail_dataframe)
        except Exception as ex:
            logging.error(ex)

        #events_json = prediction_df.to_json(orient="records", date_format='iso')
        trans_jsonarr_data = []
        if len(pass_dataframe) > 0:
            pass_data_list = []
            pass_parsed = json.loads(json.dumps(pass_dataframe.to_dict(orient="records")))
            data_json = pass_parsed
            for x in range(len(pass_parsed)):
                for i in range(590):
                    trans_json_data = {}
                    trans_json_data['Time'] = data_json[x]['Time']
                    trans_json_data['Sensor_ID'] = str(i)
                    trans_json_data['Sensor_Name'] = "Sensor "+str(i)
                    if data_json[x][str(i)] == "":
                        trans_json_data['Sensor_Value'] = float('0')
                    else:
                        trans_json_data['Sensor_Value'] = float(data_json[x][str(i)])
                    trans_json_data['Prediction'] = int(data_json[x]['Prediction'])
                    trans_json_data['current_Time'] = str(datetime.now())
                    pass_data_list.append(trans_json_data)
            if len(pass_data_list) > 0:
                pass_data_frame = pd.json_normalize(json.loads(json.dumps(pass_data_list)))
                pass_data_frame = update_with_global_feature(pass_data_frame)
                trans_jsonarr_data = trans_jsonarr_data + (pass_data_frame.to_dict(orient="records"))
        if len(fail_dataframe) > 0:
            fail_data_list = []
            fail_parsed = json.loads(json.dumps(fail_dataframe.to_dict(orient="records")))
            data_json = fail_parsed
            for x in range(len(fail_parsed)):
                for i in range(590):
                    trans_json_data = {}
                    trans_json_data['Time'] = data_json[x]['Time']
                    trans_json_data['Sensor_ID'] = str(i)
                    trans_json_data['Sensor_Name'] = "Sensor "+str(i)
                    if data_json[x][str(i)] == "":
                        trans_json_data['Sensor_Value'] = float('0')
                    else:
                        trans_json_data['Sensor_Value'] = float(data_json[x][str(i)])
                    trans_json_data['Prediction'] = int(data_json[x]['Prediction'])
                    trans_json_data['Current_Time'] = str(datetime.now())
                    fail_data_list.append(trans_json_data)
            if len(fail_data_list) > 0:
                fail_data_frame = pd.json_normalize(json.loads(json.dumps(fail_data_list)))
                fail_data_frame = update_with_local_feature(fail_data_frame, conter_factual_df)
                fail_data_frame["Priority_Value"] = fail_data_frame["Priority_Value"].values.astype(int)
                fail_data_frame["CFs1"] = fail_data_frame["CFs2"].values.astype(float)
                fail_data_frame["CFs2"] = fail_data_frame["CFs2"].values.astype(float)
                trans_jsonarr_data = trans_jsonarr_data + (fail_data_frame.to_dict(orient="records"))
        # if len(pass_dataframe) > 0:
        #     trans_jsonarr_data = trans_jsonarr_data + (pass_data_frame.to_dict(orient="records"))
        # if len(fail_data_frame) > 0:
        #     trans_jsonarr_data = trans_jsonarr_data + (fail_data_frame.to_dict(orient="records"))
        if len(trans_jsonarr_data) > 0:
            logging.info(trans_jsonarr_data)
            splitedSize = 10000
            splited_json_array = [trans_jsonarr_data[x:x + splitedSize] for x in range(0, len(trans_jsonarr_data), splitedSize)]
            for i in range(len(splited_json_array)):                                
                events_json = json.dumps(splited_json_array[i])
                # My local workspace
                # powerbi_url = "https://api.powerbi.com/beta/189de737-c93a-4f5a-8b68-6f4ca9941912/datasets/e572825a-3204-42cb-bc4a-146b66eea6b7/rows?cmpid=pbi-glob-head-snn-signin&key=ad9HT6O5r6vJyUPf28BSLSQbrCpYG%2FpwtVzP6FrK2LvIDR5TiZ1lRS%2BJICRRA%2BgzLYRzbMYHuxR%2BsMVxJDFz4g%3D%3D"
                # Shekhar URL
                # powerbi_url = "https://api.powerbi.com/beta/189de737-c93a-4f5a-8b68-6f4ca9941912/datasets/a01122bb-fd99-4af7-bc9d-101c7a55f29b/rows?key=nlPFiZ8eaitP15VTCjEb7ldFLv1JUEzr780i1VpIgYeGEPY5kyEciHnflpCIJfmkjgM%2F39A0xk0OA4lul0TTlg%3D%3D"
                
                powerbi_url = "https://api.powerbi.com/beta/189de737-c93a-4f5a-8b68-6f4ca9941912/datasets/a3afeae3-fe54-4008-9182-f6f3cc195d07/rows?key=T2aqxOe%2BbJh63y3ezxK%2Fx98Ttdh2igM1lgsYpiNHVdMXApSfXUEGzNueFGoIx7IOakW9NLlviu7zpQuf9Nz70Q%3D%3D"
                headers = {"Content-Type": "application/json"}
                response = requests.request(method="POST", url=powerbi_url, headers=headers, data=events_json)
                logging.info("Power BI API Response Code :>> " + str(response.status_code))
        else:
            logging.info("No data to process")
            return True         

        if response.status_code == 200:
            return True
        else:
            return False
    except Exception as e:
        logging.error(e)
        return False


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    list_data = json.loads(req.get_body().decode('utf-8'))
    import numpy as np
    for x in range(len(list_data)):
        for i in range(590):
            if list_data[x][str(i)] == "":
                list_data[x][str(i)] = np.nan
            else:
                list_data[x][str(i)]  = float(list_data[x][str(i)])

    logging.info("list conversion of data completed")
    # with open('ConnectedFactory_Stream_Data/input.json') as json_file:
    #      list_data = json.dumps(json.load(json_file))
    raw_df = get_data(list_data)
    logging.info("list to dataframe conversion of data completed")
    prediction_df = predict(raw_df)
    logging.info("Prediction of data completed")
    result = send_prediction_data_PBI(prediction_df)
    result = True
    if result:
        return func.HttpResponse("This HTTP triggered function executed successfully.", status_code=200)
    else:
        return func.HttpResponse("There is error on executing the function", status_code=500)