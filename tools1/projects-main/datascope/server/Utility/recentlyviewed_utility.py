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
from Utility import postgres_conn as postgres_connection
import datetime
import json
from datetime import datetime

def create_recentlyviewed(asset_type, data_url, created_on):
# postgres query execution
    name = "graviton"
    data_obj = (asset_type,name,data_url,created_on)
    query = """INSERT INTO public."recentlyviewed" (assettype,name,url,created_on) values (%s, %s, %s,%s);"""
    ret = postgres_connection.execute_insert_query(query, data_obj)
    # print(data_obj)
    return ret

def getRecentViewed():
    create_query = '''CREATE TABLE IF NOT EXISTS public."recentlyviewed"(
    id SERIAL PRIMARY KEY,
    assettype varchar(100),
    name varchar(100),
    url varchar(1000),
    created_on timestamp without time zone
    )'''
    postgres_connection.execute_create_query(create_query)
    query = """SELECT id,assettype,name,url,to_char(created_on,'dd-MM-yyyy HH12:MI:SS') as created_on FROM public."recentlyviewed" ORDER BY id DESC limit 5;"""
    ret = postgres_connection.execute_get_query(query,'')
    # print(ret)
    return ret



