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
import json
import os


def get_servicedetails():
    create_query = '''CREATE TABLE  IF NOT EXISTS public."ServiceRequest"
                    (
                        id SERIAL PRIMARY KEY,
                        sr_id varchar(10), 
                        title varchar(100), 
                        description varchar,
                        uploaded_files varchar,
                        sr_status varchar(25),
                        created_on timestamp without time zone,
                        created_by varchar(100),
                        updated_on timestamp without time zone,
                        updated_by varchar(100)
                    );'''
    postgres_connection.execute_create_query(create_query)

    query = '''select row_number() OVER (ORDER BY id DESC) AS slno,id,sr_id,title,description,uploaded_files,sr_status, to_char(created_on,'dd-MM-yyyy HH12:MI:SS') as created_on from public."ServiceRequest" order by id desc;'''
    ret = postgres_connection.execute_get_query(query, "")
    return ret


def create_servicedetails(data):
    sr_id = generate_srid()
    current_datetime = datetime.now()
    title = data['title']
    description = data['description']
    file_path = data["file_path"]
    acc_details = data['acc_details']
    data_obj = (sr_id, title, description, file_path, "New", current_datetime,
                acc_details)
    query = '''INSERT INTO public."ServiceRequest" ( sr_id, title, description, uploaded_files,sr_status, created_on, created_by) VALUES (%s, %s, %s, %s, %s,%s, %s);'''
    print(data_obj)
    ret = postgres_connection.execute_insert_query(query, data_obj)
    return ret


def update_servicerequest(request):
    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)
    id = json_req['id']
    title = json_req['title']
    description = json_req['description']
    currenttime = datetime.now()
    acc_details = json_req['acc_details']
    query = """UPDATE public."ServiceRequest" SET title = '{0}', description = '{1}',updated_on='{2}',updated_by='{3}'
            where id = '{4}'""".format(title, description, currenttime, acc_details, id)
    ret = postgres_connection.execute_update_query(query)
    return ret


def generate_srid():
    # query = '''select id from public."ServiceRequest" order by id desc limit 1'''
    # ret = postgres_connection.execute_get_query(query,[])
    # sr_id = "SR000001"
    # if len(ret['data']) != 0:
    #     zero_prefix = ""
    #     for i in range(6-len(ret['data'][0]['id'])):
    #         zero_prefix +="0"
    #     sr_id ="SR"+zero_prefix+str(int(ret['data'][0]['id'])+1)
    # print(sr_id)
    # return sr_id
    query = '''select coalesce((select id from public."ServiceRequest" order by id desc limit 1), 0) as id'''
    ret = postgres_connection.execute_get_query(query, [])
    print(len(ret['data']))
    generated_id = ret['data'][0]['id']
    sr_request_id = 'SR' + str(int(generated_id) + 1).zfill(6)
    return sr_request_id


def delete_servicerequest(request):
    id = request.GET['id']
    query1 = '''SELECT uploaded_files from public."ServiceRequest" WHERE id = %s;'''
    file_name = postgres_connection.execute_get_query(query1, [id])
    file_path = file_name['data'][0]['uploaded_files']
    try:
        if (os.path.exists(file_path)):
            os.remove(file_path)
    except:
        print("The file does not exist")
    query = '''DELETE from public."ServiceRequest" WHERE id = %s;'''
    ret = postgres_connection.execute_delete_query(query, [id])
    return ret


def get_commentdetails(sr_id):
    create_query = '''CREATE TABLE  IF NOT EXISTS public."Comment"
                    (
                        id SERIAL PRIMARY KEY,
                        sr_id varchar(100),
                        comment varchar(100), 
                        status varchar(100), 
                        created_on timestamp without time zone,
                        created_by varchar(100),
                        updated_on timestamp without time zone,
                        updated_by varchar(100)
                    );'''
    postgres_connection.execute_create_query(create_query)

    query = """select row_number() OVER (ORDER BY id DESC) AS slno,id,comment,status, to_char(created_on,'dd-MM-yyyy hh:mm:ss') as created_on from public."Comment" WHERE sr_id ='""" + sr_id + """'  order by id desc;"""
    ret = postgres_connection.execute_get_query(query, "")
    return ret


def create_comment(data):
    current_datetime = datetime.now()
    comment = data['comment']
    status = data['status']
    acc_details = data['acc_details']
    sr_id = data["sr_id"]
    data_obj = (sr_id, comment, status, current_datetime, acc_details)
    query = '''INSERT INTO public."Comment" ( sr_id, comment, status, created_on, created_by) VALUES (%s, %s, %s, %s, %s);'''
    ret = postgres_connection.execute_insert_query(query, data_obj)
    query = """UPDATE public."ServiceRequest" SET sr_status='{0}' 
            where sr_id = '{1}'""".format(status, sr_id)
    ret = postgres_connection.execute_update_query(query)
    return ret


def update_comment(request):
    current_datetime = datetime.now()
    req_body = request.body.decode('utf-8')
    print(req_body)
    json_req = json.loads(req_body)
    sr_id = json_req['sr_id']
    comment = json_req['comment']
    status = json_req['status']
    id = json_req['id']
    acc_details = json_req['acc_details']
    query = """UPDATE public."Comment" SET comment = '{0}' , status = '{1}', 
     updated_on = '{2}', updated_by = '{3}' WHERE id = '{4} '""".format(
        comment, status, current_datetime, acc_details, id)

    ret = postgres_connection.execute_update_query(query)

    query = """UPDATE public."ServiceRequest" SET sr_status='{0}' 
            where sr_id = '{1}'""".format(status, sr_id)

    ret = postgres_connection.execute_update_query(query)
    return ret


def delete_comment(request):
    id = request.GET['id']
    query = '''DELETE from public."Comment" WHERE id = %s;'''
    ret = postgres_connection.execute_delete_query(query, [id])
    return ret


def details_servicerequest(request):
    sr_id = request.GET['sr_id']
    query = '''SELECT title,description,uploaded_files from public."ServiceRequest" WHERE sr_id= %s;'''
    ret = postgres_connection.execute_get_query(query, [sr_id])
    return ret