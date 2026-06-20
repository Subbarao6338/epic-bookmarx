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

def create_datasource(request):
    current_datetime = datetime.now()
    req_body = request.body.decode('utf-8')
    print(req_body)
    json_req = json.loads(req_body)['params']
    datasource_name = json_req['datasource_name']
    datasource_type = json_req['datasource_type']
    connection_details = json_req['connection_details']
    if bool(json_req['active_status']):
        active_status = '1'
    else:
        active_status = '0'
    expiry_date = json_req['expiry_date']
    tenant_id = json_req['tenant_id']
    acc_details = json_req['acc_details']

    # postgres query execution
    data_obj = (datasource_name, datasource_type, connection_details, active_status, expiry_date, tenant_id, current_datetime, acc_details)
    query = '''INSERT INTO public."DataSource" (datasource_name, datasource_type, connection_details, 
    active_status, expiry_date, tenant_id, created_on, created_by) values (%s, %s, %s, %s, %s, %s, %s, %s);'''

    ret = postgres_connection.execute_insert_query(query, data_obj)
    # print(data_obj)
    return ret


def get_datasource(body):
    create_query = '''CREATE TABLE IF NOT EXISTS public."DataSource"
                    (
                        id SERIAL PRIMARY KEY,
                        datasource_name varchar(100),
                        datasource_type varchar(100),
                        connection_details varchar(1000),
                        active_status bit(1),
                        expiry_date date,
                        tenant_id character varying(100),
                        created_on timestamp without time zone,
                        created_by varchar(100),
                        updated_on timestamp without time zone,
                        updated_by varchar(100)
                    )'''
    postgres_connection.execute_create_query(create_query)

    tenant_id = body
    query = '''SELECT row_number() OVER (ORDER BY id DESC) AS slno,id,datasource_name, datasource_type, 
    connection_details, active_status as status, CASE active_status WHEN '1' THEN 'Active' ELSE  'Idle' END AS 
    active_status, to_char(expiry_date, 'DD/MM/YYYY') as formatted_expiry_date, expiry_date, tenant_id FROM 
    public."DataSource" where tenant_id=(%s) ORDER BY id DESC;'''
    ret = postgres_connection.execute_get_query(query, [tenant_id])
    return ret


def update_datasource(request):
    current_datetime = datetime.now()
    req_body = request.body.decode('utf-8')
    print(req_body)
    json_req = json.loads(req_body)
    datasource_name = json_req['datasource_name']
    datasource_type = json_req['datasource_type']
    connection_details = json_req['connection_details']
    if bool(json_req['active_status']):
        active_status = '1'
    else:
        active_status = '0'
    expiry_date = json_req['expiry_date']
    id = json_req['id']
    acc_details = json_req['acc_details']

    # data_obj = [datasource_name, datasource_type, connection_details, active_status, expiry_date, id]
    query = """UPDATE public."DataSource" SET datasource_name = '{0}' , datasource_type = '{1}', connection_details = 
    '{2}', active_status = '{3}', expiry_date = '{4}', updated_on = '{5}', updated_by = '{6}' WHERE id = '{7}'""".format(datasource_name, datasource_type,
                                                                                  connection_details, active_status,
                                                                                  expiry_date,  current_datetime, acc_details, id)

    ret = postgres_connection.execute_update_query(query)

    return ret


def delete_datasource(body):
    id = [body]
    query = '''DELETE from public."DataSource" WHERE id = %s;'''
    ret = postgres_connection.execute_delete_query(query, id)
    return ret
