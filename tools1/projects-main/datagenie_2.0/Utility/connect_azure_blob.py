import os

from azure.core.exceptions import ResourceExistsError
from azure.storage.blob import ContainerClient
from azure.storage.blob import BlobClient
from Utility import connect_azure_sql as azure_sql_conn
import ast

# connection_string = "DefaultEndpointsProtocol=https;AccountName=cdpdevicestoragegen2;AccountKey=e+IqTNPWQxnYQBUIN7dHOm5BbJq+6zxgoEBOr3rve/6SAvPmL/JMYP7R2jkQ6YZ1I8s2vlTCnue4wdZ4mXA62Q==;EndpointSuffix=core.windows.net"
container_name = "syntheticdatazone"


def get_container_client():
    setting_data = azure_sql_conn.get_setting_details()
    setting_data = ast.literal_eval(setting_data)
    connection_string = setting_data['azure_storage_connection_string']
    container_client = ContainerClient.from_connection_string(connection_string, container_name)
    return container_client


def function(path, name):
    dir = "output/" + name
    container_client = get_container_client()
    blob_client = container_client.get_blob_client(dir)
    with open(path, "rb") as data:
        try:
            blob_client.upload_blob(data)
            return "Pushed to DB Successfully!!"
        except ResourceExistsError:
            return "Blob Already Exist !!"
        except:
            return "Error Occured While Pushing"


def download_blob(path, blob_name):
    setting_data = azure_sql_conn.get_setting_details()
    setting_data = ast.literal_eval(setting_data)
    connection_string = setting_data['azure_storage_connection_string']
    # making a connection with the file in Azure blob storage container
    blob = BlobClient.from_connection_string(conn_str=connection_string,
                                             container_name=container_name,
                                             blob_name=blob_name)

    # writing the zip file to the local file system
    with open(path, "wb") as my_blob:
        blob_data = blob.download_blob()
        my_blob.write(blob_data.content_as_bytes())
    return "Downloaded successfully..."
