from Utility import postgres_conn as postgres_connection
import datetime
import json
from datetime import datetime


def fetch_notifications(tenant_id, AccountMail):
    create_query = '''CREATE TABLE IF NOT EXISTS public."Notifications"
                    (
                        id SERIAL PRIMARY KEY,
                        user_name character varying(50),
                        email_id character varying(100),
                        page_name character varying(50),
                        alert_msg character varying(100),
                        alert_type character varying(50),
                        created_on timestamp without time zone,
                        display_status boolean
                    )
                    '''
    postgres_connection.execute_create_query(create_query)

    query = '''SELECT id,page_name,alert_msg,alert_type,display_status FROM public."Notifications"
            where display_status=True and email_id = (%s) ORDER BY id DESC;'''
    ret = postgres_connection.execute_get_query(query, [AccountMail])
    return ret

def update_status(request):
    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)
    display_status = json_req['display_status']
    tenant_id = json_req['tenant_id']
    notifications_id = json_req['notifications_id']
    
    query = """UPDATE public."Notifications" SET display_status = '{0}' WHERE id = '{1}'""".format(display_status, notifications_id)

    ret = postgres_connection.execute_update_query(query)

    return ret


def add_notifications(request):
    
    # Getting the current date and time
    current_datetime = datetime.now()
    
    req_body = request.body.decode('utf-8')
    print(req_body)
    json_req = json.loads(req_body)['params']

    user_name = json_req['user_name']
    email_id = json_req['email_id']
    page_name = json_req['page_name']
    alert_msg = json_req['alert_msg']
    alert_type = json_req['alert_type']
    tenant_id = json_req['tenant_id']

    # postgres query execution
    data_obj = (user_name, email_id, page_name, alert_msg, alert_type, current_datetime, True)
    query = '''INSERT INTO public."Notifications" (user_name, email_id, page_name, 
    alert_msg, alert_type, created_on, display_status) values (%s, %s, %s, %s, %s, %s, %s);'''

    ret = postgres_connection.execute_insert_query(query, data_obj)
    # print(data_obj)
    return ret


def getRecentActivities(email):
    query = '''SELECT alert_msg,to_char(created_on,'dd-MM-yyyy HH12:MI:SS') as created_on FROM public."Notifications" where email_id = (%s) ORDER BY id DESC;'''
    ret = postgres_connection.execute_get_query(query, [email])
    print(ret)
    return ret
