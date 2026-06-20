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
from datetime import datetime
import datetime as dt

def insert_metadata(data, tenant_id, final_title, acc_details):
    current_datetime = datetime.now()
    title = final_title
    tenant_id = tenant_id
    filename = data['file_name']
    str_data = data['data']
    data_schema = data['data_schema']
    acc_details = acc_details
    query = '''insert into public."Metadata" (title,tenant_id,filename,data,data_schema,created_on,created_by) 
    values (%s, %s, %s, %s, %s, %s, %s)'''
    data_obj = [title, tenant_id, filename, str_data, data_schema, current_datetime, acc_details]

    ret = postgres_connection.execute_insert_query(query, data_obj)

    return ret


def get_metadata(tenant_id):
    create_query = '''CREATE TABLE IF NOT EXISTS public."Metadata"
                    (
                        id SERIAL PRIMARY KEY,
                        title varchar(100),
                        tenant_id varchar(100),
                        filename varchar(100),
                        data varchar(10485760),
                        data_schema varchar(10485760),
                        created_on timestamp without time zone,
                        created_by varchar(100)
                    )'''
    postgres_connection.execute_create_query(create_query)

    data_obj = [tenant_id]
    query = '''select row_number() OVER (ORDER BY id DESC) AS slno,id,title,filename,data,data_schema, 
    to_char(created_on, 'DD/MM/YYYY') as created_on from public."Metadata" where tenant_id= (%s);'''

    ret = postgres_connection.execute_get_query(query, data_obj)
    return ret


def get_metadata_by_filename(filename, id):
    query = '''select filename,title,data,data_schema from public."Metadata" where filename = (%s) and 
    id = (%s) ORDER BY id DESC LIMIT 1'''
    data_obj = [filename, id]
    ret = postgres_connection.execute_get_query(query, data_obj)
    return ret


def delete_metadata(id):
    query = '''DELETE FROM public."Metadata" WHERE id= %s ;'''
    data_obj = [id]
    ret = postgres_connection.execute_delete_query(query, data_obj)

    return ret


def check_metadata_title(title):
    query = '''SELECT count(*) as chk_status FROM public."Metadata" where title= (%s)'''
    ret = postgres_connection.execute_get_query(query, [title])
    if ret['data'][0]['chk_status'] == 0:
        final_title = title
    else:
        date = dt.datetime.now()
        final_title = title + "_" + str(date.year) + str(date.month + 1) + str(date.day) + str(date.hour) + str(date.minute)

    return final_title
