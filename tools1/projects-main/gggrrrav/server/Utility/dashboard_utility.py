from Utility import postgres_conn as postgres_connection
import datetime
import json
from datetime import datetime

def dashboard_count(request):
    query1='''select count(*) from public."DataSource";'''
    query2='''select count(*) from public."Metadata";'''
    query3='''select count(*) from public."Organization";'''
    query4='''select count(*) from public."Projects";'''
    query5='''select count(*) from public."Settings";'''
    query6='''select count(*) from public."ServiceRequest";'''
    query7='''select count(*) from public."Users";'''
    
    ret1 = postgres_connection.execute_get_query(query1,[] )
    ret2 = postgres_connection.execute_get_query(query2,[] )
    ret3 = postgres_connection.execute_get_query(query3,[] )
    ret4 = postgres_connection.execute_get_query(query4,[] )
    ret5 = postgres_connection.execute_get_query(query5,[] )
    ret6 = postgres_connection.execute_get_query(query6,[] )
    ret7 = postgres_connection.execute_get_query(query7,[] )
    # print(data_obj)
    ret={"datasource_count":ret1['data'][0]['count'],
         "metadata_count":ret2['data'][0]['count'],
         "org_count":ret3['data'][0]['count'],
         "project_count":ret4['data'][0]['count'],
         "settings_count":ret5['data'][0]['count'],
         "servicerequest":ret6['data'][0]['count'],
         "users_count":ret7['data'][0]['count']}
    return ret
