import logging

import azure.functions as func
from Column_Classifications.classification import get_csv_schema_classifications, get_sql_column_classification
import json
import configparser

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        req_body = req.get_json()
    except ValueError:
        req_body = {}

    # entity_type = req.params.get('entity_type') or req_body.get('entity_type')
    # qualified_name = req.params.get(
    #     'qualified_name') or req_body.get('qualified_name')

    # if not (entity_type and qualified_name):
    #     return func.HttpResponse("Error: Kindly pass 'entity_type' and 'qualified_name' parameter")

    config_parser = configparser.ConfigParser()
    config_parser.read('Column_Classifications/config.ini')

    entity_type = config_parser.get("config", "entity_type")
    qualified_name = config_parser.get("config", "qualified_name")
    columns = get_csv_schema_classifications(
        type_name=entity_type, qualified_name=qualified_name)
    return func.HttpResponse(json.dumps(columns, indent=2), status_code=200)
