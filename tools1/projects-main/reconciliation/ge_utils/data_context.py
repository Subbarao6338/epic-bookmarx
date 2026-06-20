from great_expectations.data_context.store.database_store_backend import DatabaseStoreBackend
import json
import great_expectations as ge
from great_expectations.data_context.data_context import DataContext
from great_expectations.data_context.types.base import DataContextConfig, DatabaseStoreBackendDefaults, DatasourceConfig, FilesystemStoreBackendDefaults
from great_expectations.data_context import BaseDataContext
from db_utils.datasource import get_datasources
import os
import configparser

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")

config_parser = configparser.ConfigParser()
config_parser.read(os.path.join(config_path, "database.ini"))

host = config_parser.get("postgresql", "host")
database = config_parser.get("postgresql", "database")
username = config_parser.get("postgresql", "user")
password = config_parser.get("postgresql", "password")
port = config_parser.get("postgresql", "port")

remove_key_function = DatabaseStoreBackend.remove_key


def modified_remove_key_function(self, key):
    if not isinstance(key, tuple):
        key = key.to_tuple()
    remove_key_function(self, key)


DatabaseStoreBackend.remove_key = modified_remove_key_function


datasources_list = get_datasources()

project_congif = DataContextConfig(
    datasources={datasource['datasource_name']: json.loads(datasource['value'])
                    for datasource in datasources_list},
    stores={
        "expectations_store": {
            "class_name": "ExpectationsStore",
            "store_backend": {
                "class_name": "DatabaseStoreBackend",
                # "connection_string": "sqlite:///db_utils/ge_sqlite.db"
                "credentials": {
                    "drivername": "postgresql+psycopg2",
                    "host": host,
                    "username": username,
                    "password": password,
                    "port": port,
                    "database": database,
                },
            }
        },
        "validations_store": {
            "class_name": "ValidationsStore",
            "store_backend": {
                "class_name": "DatabaseStoreBackend",
                # "connection_string": "sqlite:///db_utils/ge_sqlite.db"
                "credentials": {
                    "drivername": "postgresql+psycopg2",
                    "host": host,
                    "username": username,
                    "password": password,
                    "port": port,
                    "database": database,
                },
            }
        },
        "checkpoint_store": {
            "class_name": "CheckpointStore",
            "store_backend": {
                "class_name": "DatabaseStoreBackend",
                # "connection_string": "sqlite:///db_utils/ge_sqlite.db",
                'table_name': "ge_checkpoint_store",
                'key_columns': ["checkpoint_name"],
                "credentials": {
                    "drivername": "postgresql+psycopg2",
                    "host": host,
                    "username": username,
                    "password": password,
                    "port": port,
                    "database": database,
                },
            }
        },
        "evaluation_parameter_store": {
            "class_name": "EvaluationParameterStore"
        }
    },
    expectations_store_name="expectations_store",
    validations_store_name="validations_store",
    checkpoint_store_name="checkpoint_store",
    evaluation_parameter_store_name="evaluation_parameter_store",
    data_docs_sites={
        "local_site": {
            "class_name": "SiteBuilder",
            "show_how_to_buttons": "true",
            "store_backend": {
                "class_name": "TupleFilesystemStoreBackend",
                "base_directory": os.path.join(os.getcwd(), "ge_core/data_docs")
            },
            "site_index_builder": {
                "class_name": "DefaultSiteIndexBuilder"
            }
        }
    }
)
context = BaseDataContext(project_config=project_congif)

def create_context():
    return context
