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
import urllib.request
import json
import os
import ssl
from datetime import datetime, timedelta
import pandas as pd


def allowSelfSignedHttps(allowed):
    # bypass the server certificate verification on client side
    if allowed and not os.environ.get('PYTHONHTTPSVERIFY', '') and getattr(ssl, '_create_unverified_context', None):
        ssl._create_default_https_context = ssl._create_unverified_context


# this line is needed if you use self-signed certificate in your scoring service.
allowSelfSignedHttps(True)

# Request data goes here
# The example below assumes JSON formatting which may be updated
# depending on the format your endpoint expects.
# More information can be found here:
# https://docs.microsoft.com/azure/machine-learning/how-to-deploy-advanced-entry-script


def get_forecasted_metrics(timeframe_h=1):

    ts = datetime.utcnow()
    te = ts+timedelta(hours=timeframe_h)

    # tr = pd.date_range(ts, te, freq="5min").round('5min').strftime('%Y-%m-%d %H:%M:%S').tolist()
    tr = pd.date_range(ts, te, periods=2).round(
        '5min').strftime('%Y-%m-%d %H:%M:%S').tolist()

    dag_ids = ["DBT_ETL", "Druid_ETL"]

    data_points = []

    for dag_id in dag_ids:
        for dt in tr:
            data_points.append({"_time": dt, "dag_id": dag_id})

    data = {
        "Inputs": {
            "data": data_points
        },
        "GlobalParameters": {
            "quantiles": [
                0.025,
                0.975
            ]
        }
    }

    body = str.encode(json.dumps(data))

    url = 'http://3e68cb64-838d-4c93-bfe2-9dbe40727998.centralindia.azurecontainer.io/score'
    api_key = ''  # Replace this with the API key for the web service

    # The azureml-model-deployment header will force the request to go to a specific deployment.
    # Remove this header to have the request observe the endpoint traffic rules
    headers = {'Content-Type': 'application/json',
               'Authorization': ('Bearer ' + api_key)}

    req = urllib.request.Request(url, body, headers)

    try:
        response = urllib.request.urlopen(req)

        result = response.read()
        # print(result)
        return result
    except urllib.error.HTTPError as error:
        print("The request failed with status code: " + str(error.code))

        # Print the headers - they include the requert ID and the timestamp, which are useful for debugging the failure
        print(error.info())
        print(error.read().decode("utf8", 'ignore'))
