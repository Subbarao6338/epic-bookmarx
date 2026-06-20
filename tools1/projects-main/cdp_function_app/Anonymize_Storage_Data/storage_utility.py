import json
from azure.identity import ClientSecretCredential
from azure.storage.filedatalake import DataLakeServiceClient
import pyarrow.parquet as pq
import io
import pandas as pd
import configparser
import datetime
import Anonymize_Storage_Data.db_utility

config_parser = configparser.ConfigParser()
config_parser.read('Anonymize_Storage_Data/config.ini')

raw_data_zone = config_parser.get("config", "raw_data_zone")
curated_data_zone = config_parser.get("config", "curated_data_zone")

def get_folder_pattern():
    now = datetime.datetime.now()
    year = now.year
    month = '{:02d}'.format(now.month)
    day = '{:02d}'.format(now.day)
    return "/{}/{}/{}/".format(str(year), str(month), str(day))

def read_raw_data_zone(file_name):
    try:
        credential_result = Anonymize_Storage_Data.db_utility.get_credential_by_zone(raw_data_zone)
        tenant_id = credential_result["tenant_id"]
        raw_client_id = credential_result["client_id"]
        raw_client_secret = credential_result["secret_id"]
        storage_account_name = credential_result["storage_name"]
        raw_container_name = credential_result["container_name"]
        credential = ClientSecretCredential(tenant_id, raw_client_id, raw_client_secret)
        service_client = DataLakeServiceClient(account_url="{}://{}.dfs.core.windows.net".format(
            "https", storage_account_name), credential=credential)
        file_system_client = service_client.get_file_system_client(raw_container_name + get_folder_pattern())
        file_client = file_system_client.get_file_client(file_name)
        stream_downloader = file_client.download_file()
        stream = io.BytesIO()
        stream_downloader.readinto(stream)
        processed_df = pd.read_parquet(stream, engine='pyarrow')
        return processed_df
    except Exception as e:
        print(e)
        return None

def write_dataframe_to_curated(write_file_name, write_dataframe):
    try:
        credential_result = Anonymize_Storage_Data.db_utility.get_credential_by_zone(curated_data_zone)
        tenant_id = credential_result["tenant_id"]
        curated_client_id = credential_result["client_id"]
        curated_client_secret = credential_result["secret_id"]
        storage_account_name = credential_result["storage_name"]
        curated_container_name = credential_result["container_name"]
        credential = ClientSecretCredential(tenant_id, curated_client_id, curated_client_secret)
        service_client = DataLakeServiceClient(account_url="{}://{}.dfs.core.windows.net".format(
            "https", storage_account_name), credential=credential)
        file_system_client = service_client.get_file_system_client(curated_container_name + get_folder_pattern())
        file_client = file_system_client.create_file(write_file_name)
        file_client.append_data(write_dataframe.to_parquet(index=False), offset=0, length=len(write_dataframe.to_parquet(index=False)))
        file_client.flush_data(len(write_dataframe.to_parquet(index=False)))
        return True
    except Exception as e:
        print(e)
        return False
