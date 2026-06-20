from random import weibullvariate
from Utility import postgres_conn as postgres_connection
from datetime import datetime
import json


def create_user(request):
    current_datetime = datetime.now()
    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)['params']
    name = json_req['user_name'] 
    email_add = json_req['email']
    emp_id = json_req['emp_id']
   
    # postgres query execution
    # data_obj = (name, email_add, emp_id, current_datetime)
    # query = '''INSERT INTO public."Users" (user_name, user_mail, created_on, created_by) values (%s, %s, %s, %s);'''
    # ret = postgres_connection.execute_insert_query(query, data_obj)
    # print(data_obj)
    return "Success"


def get_users():
    # create_query = '''CREATE TABLE  IF NOT EXISTS public."Users"(
    #                     user_id SERIAL PRIMARY KEY,
    #                     user_name varchar(100),
    #                     user_mail varchar(100),
    #                     employee_id varchar(100),
    #                     project_assigned varchar(100),
    #                     user_role varchar(50),
    #                     created_on timestamp without time zone,
    #                     created_by varchar(100),
    #                     updated_on timestamp without time zone,
    #                     updated_by varchar(100)
    #                 )'''
    # postgres_connection.execute_create_query(create_query)

    query = '''select * from public."Users" order by user_id asc'''
    ret = postgres_connection.execute_get_query(query,'')
    return ret

def delete_user(body):
    id = [body]
    query = '''DELETE from public."Users" WHERE user_id = %s;'''
    ret = postgres_connection.execute_delete_query(query, id)
    return ret


