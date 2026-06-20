from curses import raw
import logging
import json
import pandas as pd

import azure.functions as func
import requests
import configparser
import Anonymize_Stream_Data.json_parsing as json_data_extraction
from Anonymize_Stream_Data.operations_data import operations

config_parser = configparser.ConfigParser()
config_parser.read('Anonymize_Storage_Data/config.ini')


def get_data(list_data):
    return pd.DataFrame.from_dict(list_data)


def data_operations(df):
    try:
        response = requests.get('https://cdpfunctions.azurewebsites.net/api/Column_Classifications?code=wGglozSJvHu5rRPSJ9t4DXrdAxlpL2tv7SsVlDa1YPDwQoXnTA6WNg==', allow_redirects=True)
        response_dict = json.loads(response.content)
        mask_field_rule = []
        mask_field_rule_val = config_parser.get("config", "field_mask")
        if mask_field_rule_val.__contains__(','):
            mask_field_rule = (mask_field_rule_val.split(','))
        else:
            mask_field_rule.append(mask_field_rule_val)

        ap_classfied_data = []
        ap_classfied_data = json_data_extraction.json_parse(response_dict, mask_field_rule)
        for key, value in ap_classfied_data.items():
            if value == 'mask':
                field_replace = key
            elif value == 'encrypt':
                field_encrypt = key
        operation = operations(df)
        if field_encrypt != '' and field_encrypt != None:
            operation.encrypt_field(field_encrypt)
        if field_replace != '' and field_replace != None:
            operation.replace_ip(field_replace)
        return operation.get_df()
    except Exception as e:
        print(e)
        return df

def send_anonymized_data_PBI(anonymized_df):
    try:
        logging.info("sending dataframe to powerBI")
        events_json = anonymized_df.to_json(orient="records", date_format='iso')
        # parsed = json.loads(events_str)
        # events_json = json.dumps(parsed)
        powerbi_url1 = "https://api.powerbi.com/beta/189de737-c93a-4f5a-8b68-6f4ca9941912/datasets/586e3dbd-1b6d-41e8-a4bf-075b4d2d418e/rows?key=ASNEqw5dvz66PNel54L8LbRSgtkVQeGuV1YPfoy6882Lbl210K2wikBMqI%2BKrvCo06qvLmsRBgqViyIB0RFRoQ%3D%3D"
        headers = {"Content-Type": "application/json"}
        response = requests.request(method="POST", url=powerbi_url1, headers=headers, data=events_json)
        powerbi_url = "https://api.powerbi.com/beta/189de737-c93a-4f5a-8b68-6f4ca9941912/datasets/45930527-74bc-4ac3-902a-98a387cd39f3/rows?key=a%2FxRz9H0hDd0GkNg9nHIoXiNtU59KkxEn6RCWlcPWgzvxgBKMCKcinL4erMjP8iAu8e5L%2F1q3CD95R2PnafZ2g%3D%3D"
        headers = {"Content-Type": "application/json"}
        response = requests.request(method="POST", url=powerbi_url, headers=headers, data=events_json)
        logging.info(response.status_code)
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
    raw_df = get_data(list_data)
    logging.info("list to dataframe conversion of data completed")
    anonymized_df = raw_df #data_operations(raw_df)
    logging.info("Anonymization of data completed")
    result = send_anonymized_data_PBI(anonymized_df)
    if result:
        return func.HttpResponse("This HTTP triggered function executed successfully.", status_code=200)
    else:
        return func.HttpResponse("There is error on executing the function", status_code=500)
