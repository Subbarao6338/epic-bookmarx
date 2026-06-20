"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""

from django.apps import AppConfig
from connection_utility.sql_lite_connection import business_object_repo as db_conn


class MyConfig(AppConfig):
    name = 'cfg'


class connection_config(AppConfig):
    # host_name = 'LP-5CD9174BCZ'
    # database_name = 'NW_DB'
    # user_id = 'sa'
    # password = 'India@123'
    # # if sqlite connection
    # db_file = "C://sqlite//Northwind.sqlite"
    # # if dynamodb connection
    # dbhost = "http://localhost:8080"

    host_name = ""
    database_name = ""
    user_id = ""
    password = ""
    # if sqlite connection
    db_file = ""
    # if dynamodb connection
    dbhost = ""
    domain_object_id = ""

    def __init__(self, domain_object_id):
        self.domain_object_id = domain_object_id

    def connect_db(self):
        result = db_conn.get_db_connection_config(self.domain_object_id)
        result_data = result[0]

        if result_data["ProviderName"] == "SQL SERVER":
            self.host_name = result_data["HostName"]
            self.database_name = result_data["DatabaseName"]
            self.user_id = result_data["UserName"]
            self.password = result_data["Password"]
        elif result_data["ProviderName"] == "SQLITE":
            self.db_file = result_data["DatabaseName"]
        elif result_data["ProviderName"] == "DynamoDB":
            self.dbhost = result_data["HostName"]
