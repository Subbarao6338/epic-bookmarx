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


def local_file_ds_config(name, base_dir):
    return({
        'name': name,
        'class_name': "Datasource",
        'module_name': "great_expectations.datasource",
        'execution_engine': {
            'module_name': "great_expectations.execution_engine",
            'class_name': "PandasExecutionEngine",
        },
        'data_connectors': {
            'default_inferred_data_connector_name': {
                'class_name': "InferredAssetFilesystemDataConnector",
                'base_directory': base_dir,
                'default_regex': {
                    'group_names': ["data_asset_name"],
                    'pattern': "(.*)"
                },
            },
        },
    })


def azure_storage_ds_config(name, account_url, account_key, container, base_dir):
    return({
        'name': name,
        'class_name': "Datasource",
        'execution_engine': {
            'class_name': "PandasExecutionEngine",
            'azure_options': {
                'account_url': account_url,
                'credential': account_key,
            },
        },
        'data_connectors': {
            'default_inferred_data_connector_name': {
                'class_name': "InferredAssetAzureDataConnector",
                'azure_options': {
                    'account_url': account_url,
                    'credential': account_key,
                },
                'container': container,
                'name_starts_with': base_dir,
                'default_regex': {
                    'pattern': "(.*)",
                    'group_names': ["data_asset_name"],
                },
            },
        },
    })


def apache_kafka_ds_config(name):
    return({
        "name": name,
        "class_name": "Datasource",
        "module_name": "great_expectations.datasource",
        "execution_engine": {
            "module_name": "great_expectations.execution_engine",
            "class_name": "PandasExecutionEngine",
        },
        "data_connectors": {
            "default_runtime_data_connector_name": {
                "class_name": "RuntimeDataConnector",
                "module_name": "great_expectations.datasource.data_connector",
                "batch_identifiers": ["default_identifier_name"],
            },
        },
    })


def database_config(name, conn_str):
    datasource_config = {
        "name": name,
        "class_name": "Datasource",
        "execution_engine": {
            "class_name": "SqlAlchemyExecutionEngine",
            "connection_string": conn_str,
        },
        "data_connectors": {
            "default_runtime_data_connector_name": {
                "class_name": "RuntimeDataConnector",
                "batch_identifiers": ["default_identifier_name"],
            },
            "default_inferred_data_connector_name": {
                "class_name": "InferredAssetSqlDataConnector",
                "include_schema_name": True,
            },
        },
    }
    return datasource_config
