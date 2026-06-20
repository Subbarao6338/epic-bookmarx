from random import weibullvariate
from Utility import postgres_conn as postgres_connection
from datetime import datetime
import json


def create_organization(request):
    current_datetime = datetime.now()
    req_body = request.body.decode('utf-8')
    print(req_body)
    json_req = json.loads(req_body)['params']
    name = json_req['organization_name'] 
    details = json_req['details']
    acc_details = json_req['acc_details']
   
    # postgres query execution
    data_obj = (name,details,current_datetime,acc_details)
    query = '''INSERT INTO public."Organization" (name, details,created_on, created_by) values (%s, %s, %s, %s);'''
    ret = postgres_connection.execute_insert_query(query, data_obj)
    # print(data_obj)
    return ret


def get_getorganizationdetails():
    create_query = '''CREATE TABLE  IF NOT EXISTS public."Organization"(
                        id SERIAL PRIMARY KEY,
                        name varchar(100),
                        details varchar(100),
                        created_on timestamp without time zone,
                        created_by varchar(100),
                        updated_on timestamp without time zone,
                        updated_by varchar(100)
                    )'''
    postgres_connection.execute_create_query(create_query)

    query = '''select row_number() OVER (ORDER BY id DESC) AS slno,id,name,details from public."Organization" order by id desc'''
    ret = postgres_connection.execute_get_query(query,'')
    return ret

def delete_organization(body):
    id = [body]
    query = '''DELETE from public."Organization" WHERE id = %s;'''
    ret = postgres_connection.execute_delete_query(query, id)
    return ret



def update_organization(request):
    current_datetime = datetime.now()
    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)
    name = json_req['name']
    id = json_req['id']
    details = json_req['details']
    acc_details = json_req['acc_details']
    query = """UPDATE public."Organization" SET details = '{0}', name = '{1}', updated_on  = '{2}', updated_by  = '{3}'  WHERE id = '{4}'""".format(details,name,current_datetime,acc_details,id)
    ret = postgres_connection.execute_update_query(query)
    return ret


def isorganizationexists(org_name, page_type, org_id):
    if (page_type =='create') :
        query = '''SELECT count(id) FROM public."Organization" WHERE name ilike %s'''
        result = postgres_connection.execute_get_query(query, [org_name])
        return result
    else:
        query = '''SELECT count(id) FROM public."Organization" WHERE id <> %s and name ilike %s'''
        result = postgres_connection.execute_get_query(query, [org_id, org_name])
        return result
    