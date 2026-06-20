import configparser
import json
import os
import requests

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")
config_parser = configparser.ConfigParser()
config_parser.read(os.path.join(config_path, "singleview.ini"))

tenant_id = config_parser.get("purview_details", "tenant_id")
client_id = config_parser.get("purview_details", "client_id")
client_secret = config_parser.get("purview_details", "client_secret")
endpoint = config_parser.get("purview_details", "endpoint")
grant_type = config_parser.get("purview_details", "grant_type")
resource = config_parser.get("purview_details", "resource")

def get_purview_token():
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

def get_sources_count(bearer):
    try:
        external_url = endpoint + "/scan/datasources?api-version=2022-02-01-preview"
        token = 'Bearer ' + bearer
        payload = {}
        headers = {
            'Authorization': token
        }
        response = requests.request("GET", external_url,headers=headers, data=payload)
        count = response.json()["count"]
        return count
    except:
        return 0


def get_classification_rules_count(bearer):
    try:
        external_url = endpoint + "/scan/classificationrules?api-version=2022-02-01-preview"
        token = 'Bearer ' + bearer
        payload = {}
        headers = {
            'Authorization': token
        }
        response = requests.request("GET", external_url,headers=headers, data=payload)
        count = response.json()["count"]
        return count
    except:
        return 0

def get_glossary_term_count(bearer):
    try:
        external_url = endpoint + "/catalog/api/atlas/v2/glossary"
        token = 'Bearer ' + bearer
        payload = {}
        headers = {
            'Authorization': token
        }
        response = requests.request("GET", external_url,headers=headers, data=payload)
        count = len(response.json()[0]["terms"])
        return count
    except:
        return 0

def get_dataset_count():
    return 3