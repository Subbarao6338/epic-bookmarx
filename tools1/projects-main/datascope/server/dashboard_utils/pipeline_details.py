"""
=============================================================================
COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
import configparser
import json
import os
import requests

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")
config_parser = configparser.ConfigParser()
config_parser.read(os.path.join(config_path, "singleview.ini"))

tenant_id = config_parser.get("azure_details", "tenant_id")
client_id = config_parser.get("azure_details", "client_id")
client_secret = config_parser.get("azure_details", "client_secret")
grant_type = config_parser.get("azure_details", "grant_type")
resource = config_parser.get("azure_details", "resource")
subscription_id = config_parser.get("azure_details", "subscription_id")
resource_group = config_parser.get("azure_details", "resource_group")

def get_access_token():
    try:
        gettokens_exturl = "https://login.microsoftonline.com/" + tenant_id + "/oauth2/token"

        payload = {
                    'grant_type': grant_type,
                    'client_id': client_id,
                    'client_secret': client_secret,
                    'resource': resource
                }
        response = requests.request("GET", gettokens_exturl, data=payload)
        bearer = response.json()['access_token']
        return bearer
    except:
        return "Error"

def get_adf_count(bearer):
    try:
        external_url = "https://management.azure.com/subscriptions/" + subscription_id + "/resourceGroups/" + resource_group + "/providers/Microsoft.DataFactory/factories?api-version=2018-06-01"
        token = 'Bearer ' + bearer
        payload = {}
        headers = {
            'Authorization': token
        }
        response = requests.request("GET", external_url,headers=headers, data=payload)
        count = len(response.json()["value"])
        return count
    except:
        return 0
