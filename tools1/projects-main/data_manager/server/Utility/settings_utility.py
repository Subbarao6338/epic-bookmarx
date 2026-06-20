from Utility import postgres_conn as postgres_connection
from datetime import datetime
import json
from datetime import datetime


def create_settings(json_req, final_title):
    current_datetime = datetime.now()
    # title = request.POST['title']
    title = final_title
    print(title)
    storage_account = json_req['storage_account']
    azure_sql_instance = json_req['azure_sql_instance']
    service_principal = json_req['service_principal']
    airflow_url = json_req['airflow_url']
    prefect_url = json_req['prefect_url']
    notebook = json_req['notebook']
    aion_url = json_req['aion_url']
    databricks = json_req['databricks']
    powerbi = json_req['powerbi']
    druid = json_req['druid']
    kibana = json_req['kibana']
    tenant_id = json_req['tenant_id']
    acc_details = json_req['acc_details']

    data_obj = (title, storage_account, azure_sql_instance, service_principal, airflow_url, prefect_url, notebook,
                aion_url, databricks, powerbi, druid, kibana, tenant_id, current_datetime, acc_details)
    query = '''INSERT INTO public."Settings" (title,storage_account,azure_sql_instance,service_principal,airflow_url, 
    prefect_url,notebook,aion_url,databricks,powerbi,druid,kibana,tenant_id, created_on, created_by) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 
    %s, %s, %s, %s, %s, %s, %s);'''
    print(data_obj)
    ret = postgres_connection.execute_insert_query(query, data_obj)

    return ret


def get_settings(body):
    create_query = ''' CREATE TABLE IF NOT EXISTS public."Settings"
                    (
                        id SERIAL PRIMARY KEY,
                        title varchar(100),
                        storage_account varchar(100),
                        azure_sql_instance varchar(100),
                        service_principal varchar(100),
                        airflow_url varchar(100),
                        prefect_url varchar(100),
                        notebook varchar(100),
                        aion_url varchar(100),
                        databricks varchar(100),
                        powerbi varchar(100),
                        druid varchar(100),
                        kibana varchar(100),
                        tenant_id varchar(100),
                        created_on timestamp without time zone,
                        created_by varchar(100),
                        updated_on timestamp without time zone,
                        updated_by varchar(100)
                    ) '''
    postgres_connection.execute_create_query(create_query)

    tenant_id = [body]
    query = '''SELECT row_number() OVER (ORDER BY id DESC) AS slno,id,title,storage_account,azure_sql_instance,
    service_principal,airflow_url,prefect_url,notebook,aion_url,databricks,powerbi,druid,kibana,tenant_id FROM 
    public."Settings" where tenant_id=(%s);'''

    ret = postgres_connection.execute_get_query(query, tenant_id)

    return ret


def update_settings(request):
    current_datetime = datetime.now()
    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)
    storage_account = json_req['storage_account']
    azure_sql_instance = json_req['azure_sql_instance']
    service_principal = json_req['service_principal']
    airflow_url = json_req['airflow_url']
    prefect_url = json_req['prefect_url']
    notebook = json_req['notebook']
    aion_url = json_req['aion_url']
    databricks = json_req['databricks']
    powerbi = json_req['powerbi']
    druid = json_req['druid']
    kibana = json_req['kibana']
    id = json_req['id']
    acc_details = json_req['acc_details']

    # data_obj = [storage_account, azure_sql_instance, service_principal, airflow_url, prefect_url, notebook, aion_url, databricks, powerbi, druid, kibana, id]
    # print("data_obj")
    # print(data_obj)
    query = """UPDATE public."Settings" SET storage_account = '{0}', azure_sql_instance = '{1}', service_principal = '{2}', 
    airflow_url = '{3}', prefect_url = '{4}', notebook = '{5}', aion_url = '{6}', databricks = '{7}', powerbi = '{8}',druid = '{9}', 
    kibana = '{10}', updated_on = '{11}', updated_by = '{12}' WHERE id = '{13}'""".format(storage_account, azure_sql_instance, service_principal, airflow_url, prefect_url, notebook, aion_url, databricks, powerbi, druid, kibana, current_datetime, acc_details, id)

    ret = postgres_connection.execute_update_query(query)

    return ret


def delete_settings(id):
    data_obj = [id]
    query = '''DELETE from public."Settings" WHERE id = %s;'''
    ret = postgres_connection.execute_delete_query(query, data_obj)

    return ret


def check_settings_title(title):
    data_obj = [title]
    query = '''SELECT count(*) as chk_status FROM public."Settings" where title=(%s);'''
    ret = postgres_connection.execute_get_query(query, data_obj)
    if ret['data'][0]['chk_status'] == 0:
        final_title = title
    else:
        date = datetime.now()
        final_title = title + "_" + str(date.year) + str(date.month + 1) + str(date.day) + str(date.hour) + str(
            date.minute)
    print(final_title)
    return final_title
