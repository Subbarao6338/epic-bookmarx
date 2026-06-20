import configparser
import json
import os
import requests
from requests.auth import HTTPBasicAuth

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")
config_parser = configparser.ConfigParser()
config_parser.read(os.path.join(config_path, "singleview.ini"))

host = config_parser.get('aiflow_server', 'host')
port = config_parser.get('aiflow_server', 'port')
user = config_parser.get('aiflow_server', 'user')
password = config_parser.get('aiflow_server', 'password')
owner = config_parser.get('aiflow_server', 'owner')


def get_dag_count():
    count=0
    try:
        external_url = "http://" + host + ":" + port + "/api/v1/dags"
        response = requests.request("GET", external_url, auth=HTTPBasicAuth(user, password))
        dags = response.json()["dags"]
        
        for dag in dags:
            if owner in dag['owners']:
                count = count + 1
        return count
    except:
        return count