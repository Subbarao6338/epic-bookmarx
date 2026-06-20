from random import weibullvariate
from venv import create
from Utility import postgres_conn as postgres_connection
import datetime
import json
from datetime import datetime


def get_resource(body):
    create_query = '''CREATE TABLE  IF NOT EXISTS public."Resource"
                    (
                        id SERIAL PRIMARY KEY,
                        name varchar(30) UNIQUE,
                        description varchar(300) NOT NULL,
                        created_by vaarchar(100),
                        button varchar(30),
                        status varchar(30),
                        report_thumbnail varchar(300)
                        );'''
    postgres_connection.execute_create_query(create_query)
    tenant_id = body
    query = '''select row_number() OVER (ORDER BY id DESC) AS slno,id,name,description,button,status,report_thumbnail from public."Resource" order by id desc;'''
    ret = postgres_connection.execute_get_query(query, "")
    return ret


def getresource_userbased(request):
    status = request.GET['status']
    query = '''select * from public."Resource" where status=%s order by id'''
    ret = postgres_connection.execute_get_query(query,[status])
    return ret
