import logging
import json
import pandas as pd
import requests

import azure.functions as func
from ConnectedFactory_Stream_Data.aion_prediction import predict as predict

def get_data(list_data):
    return pd.DataFrame.from_dict(list_data)

def send_prediction_data_PBI(prediction_df):
    try:
        logging.info("sending dataframe to powerBI")
        #events_json = prediction_df.to_json(orient="records", date_format='iso')
        parsed = json.loads(prediction_df)
        data_json = parsed['data']

        trans_jsonarr_data = []
        for x in range(len(data_json)):
            for i in range(590):
                trans_json_data = {}
                trans_json_data['Time'] = data_json[x]['Time']
                trans_json_data['Sensor_ID'] = str(i)
                trans_json_data['Sensor_Name'] = "Sensor "+str(i)
                if data_json[x][str(i)] == "":
                    trans_json_data['Sensor_Value'] = float('0')
                else:
                    trans_json_data['Sensor_Value'] = float(data_json[x][str(i)])
                trans_json_data['Prediction'] = data_json[x]['prediction']
                trans_jsonarr_data.append(trans_json_data)

        splitedSize = 10000
        splited_json_array = [trans_jsonarr_data[x:x + splitedSize] for x in range(0, len(trans_jsonarr_data), splitedSize)]

        for i in range(len(splited_json_array)):
            events_json = json.dumps(splited_json_array[i])
            logging.info(str(i)+": Data Prepared")
            print(events_json)
            # My local workspace
            #powerbi_url = "https://api.powerbi.com/beta/189de737-c93a-4f5a-8b68-6f4ca9941912/datasets/e572825a-3204-42cb-bc4a-146b66eea6b7/rows?key=ad9HT6O5r6vJyUPf28BSLSQbrCpYG%2FpwtVzP6FrK2LvIDR5TiZ1lRS%2BJICRRA%2BgzLYRzbMYHuxR%2BsMVxJDFz4g%3D%3D"
            powerbi_url = "https://api.powerbi.com/beta/189de737-c93a-4f5a-8b68-6f4ca9941912/datasets/a01122bb-fd99-4af7-bc9d-101c7a55f29b/rows?key=nlPFiZ8eaitP15VTCjEb7ldFLv1JUEzr780i1VpIgYeGEPY5kyEciHnflpCIJfmkjgM%2F39A0xk0OA4lul0TTlg%3D%3D"
            headers = {"Content-Type": "application/json"}
            response = requests.request(method="POST", url=powerbi_url, headers=headers, data=events_json)
            logging.info("Power BI API Response Code :>> " + str(response.status_code))
          

        if response.status_code == 200:
            return True
        else:
            return False
    except Exception as e:
        logging.error(e)
        return False


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    logging.info(req.get_body())
    list_data = json.loads(req.get_body().decode('utf-8'))
    logging.info("list conversion of data completed")
    # with open('ConnectedFactory_Stream_Data/input.json') as json_file:
    #      list_data = json.dumps(json.load(json_file))
    raw_df = get_data(list_data)
    logging.info("list to dataframe conversion of data completed")
    prediction_df = predict(raw_df)
    logging.info("Prediction of data completed")
    result = send_prediction_data_PBI(prediction_df)
    #result = True
    if result:
        return func.HttpResponse("This HTTP triggered function executed successfully.", status_code=200)
    else:
        return func.HttpResponse("There is error on executing the function", status_code=500)