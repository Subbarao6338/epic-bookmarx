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
import os
from pkgutil import get_data
import shutil
import pathlib
from great_expectations.data_context.data_context import DataContext
from db_utils.datasource import insert_datasource, db_delete_datasource
from db_utils.checkpoint import db_delete_checkpoint_on_ds_delete
from db_utils.validation import db_delete_validation_on_ds_delete
from ge_api.models import Datasource, Report, ResultV1
from ge_utils.datasource_config import apache_kafka_ds_config, azure_storage_ds_config, database_config, local_file_ds_config, database_config
from ge_utils.db_connection_str import get_connection_string


def list_data_assets(context: DataContext, datasource_name):
    data_assets = context.datasources[datasource_name].get_available_data_asset_names(
        data_connector_names="default_inferred_data_connector_name"
    )["default_inferred_data_connector_name"]
    return data_assets


def create_datasource(context: DataContext, json_body, files=None):
    datasource_config = {}
    name = json_body['name']
    datasource_type = json_body['datasource_type']
    target_dir = os.path.join('ge_core/temp/', name)

    if datasource_type == 'local_file':
        datasource_config = local_file_ds_config(name, target_dir)

    elif datasource_type == 'azure_storage':
        account_url = json_body['account_url']
        account_key = json_body['account_key']
        container = json_body['container']
        base_dir = json_body['base_dir']
        datasource_config = azure_storage_ds_config(
            name, account_url, account_key, container, base_dir)

    elif datasource_type == 'apache_kafka':
        datasource_config = apache_kafka_ds_config(name)

    elif datasource_type == 'database':
        print("IN DATABASE!!!!")
        conn_str = get_connection_string(json_body)
        print(conn_str)
        datasource_config = database_config(name, conn_str)

    else:
        raise ValueError("Invalid datasource type")
    #
    if files:
        os.makedirs(target_dir, exist_ok=True)
        for file in files:
            with open(os.path.join(target_dir, file.name), '+wb') as dest:
                for chunk in file.chunks():
                    dest.write(chunk)
    try:
        context.add_datasource(**datasource_config)
    except:
        raise ValueError('Invalid datasource_config')

    insert_datasource(name=name,
                      type=datasource_type,
                      json=json.dumps(json_body),
                      config=json.dumps(datasource_config))
    return "created"


def delete_datasource(context: DataContext, datasource_name):
    context.delete_datasource(datasource_name)
    db_delete_datasource(datasource_name)
    db_delete_checkpoint_on_ds_delete(datasource_name)
    db_delete_validation_on_ds_delete(datasource_name)
    ResultV1.objects.filter(datasource_name=datasource_name).delete()
    Report.objects.filter(datasource_name=datasource_name).delete()
    target_dir = os.path.join('ge_core/temp/', datasource_name)
    if os.path.exists(target_dir) and os.path.isdir(target_dir):
        shutil.rmtree(target_dir)
    return "deleted"
