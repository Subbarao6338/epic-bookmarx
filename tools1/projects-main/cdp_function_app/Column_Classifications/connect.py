import os

from azure.identity import ClientSecretCredential
from azure.purview.catalog import PurviewCatalogClient
from azure.purview.scanning import PurviewScanningClient
from dotenv import load_dotenv

load_dotenv()

tenant_id = os.getenv('TENANT_ID')
client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')

atlas_endpoint = os.getenv('ATLAS_ENDPOINT')
scan_endpoint = os.getenv('SCAN_ENDPOINT')

credential = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

catalog_client = PurviewCatalogClient(endpoint=atlas_endpoint, credential=credential)
scan_client = PurviewScanningClient(endpoint=scan_endpoint, credential=credential)
