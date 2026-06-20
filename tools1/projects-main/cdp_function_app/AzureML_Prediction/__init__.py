import logging

import azure.functions as func
from AzureML_Prediction import synapse_db_Utility


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    is_prediction_result_done = synapse_db_Utility.process_synapse_data_with_AzureML()
    if is_prediction_result_done:
        return func.HttpResponse("This HTTP triggered function executed successfully.", status_code=200)
    else:
        return func.HttpResponse("There is error on executing the function", status_code=500)
