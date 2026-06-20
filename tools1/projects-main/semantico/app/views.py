"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""

import datetime
import ntpath

from app.config import connection_config
from connection_utility.common_utility.create_business_object_query import get_query_json, create_query, \
    create_mask_query

is_sql = False
selected_db = ""
from django.template import loader
from django import template
from django.shortcuts import render, HttpResponse
import json
from django.views.decorators.csrf import csrf_exempt
import uuid

# if is_sql:
#     from connection_utility.sql_connection import connect_sql as db_conn
# else:
#     from connection_utility.hive_connection import connect_hive as db_conn
from connection_utility.sql_connection import connect_sql as db_conn
from connection_utility.sql_lite_connection import business_object_repo, business_object_service, \
    connect_sqlite as dbconn_sqlite
from connection_utility.dynamo_connection import connect_dynamodb as dbconn_dynamodb
from connection_utility.adls_connection import connect_adlsgen2 as adls_conn


# @login_required(login_url="/login/")
def index(request):
    return render(request, "index.html")


# @login_required(login_url="/login/")
def pages(request):
    context = {}
    # All resource paths end in .html.
    # Pick out the html file name from the url. And load that template.
    try:
        load_template = request.path.split('/')[-1]
        html_template = loader.get_template(load_template)
        return HttpResponse(html_template.render(context, request))

    except template.TemplateDoesNotExist:
        html_template = loader.get_template('page-404.html')
        return HttpResponse(html_template.render(context, request))

    except:
        html_template = loader.get_template('page-500.html')
        return HttpResponse(html_template.render(context, request))


def get_DB(request):
    dbname = request.GET.get("dbname")
    global selected_db
    selected_db = dbname
    # if dbname == "SQL SERVER":
    #     selected_db = "SQL SERVER"
    # elif dbname == "SQLITE":
    #     selected_db = "SQLITE"
    # elif dbname == "DynamoDB":
    #     selected_db = "DynamoDB"
    # elif dbname =="ADLSGen2":
    #     selected_db = "ADLSGen2"
    # print(selected_db)

    # context = {'is_sql': is_sql, 'is_sqlite': is_sqlite}
    # print(context)
    return render(request, "widgets.html")


def get_database_list(request):
    host_name = request.GET.get("host")
    port = request.GET.get("port")
    user_name = request.GET.get("user_name")
    storage_name = request.GET.get("storage_name")
    access_key = request.GET.get("access_key")
    if selected_db == "SQL SERVER":
        database_list = db_conn.list_databases(host_name, port, user_name)
    elif selected_db == "SQLITE":
        database_list = dbconn_sqlite.list_databases(host_name, user_name)
    elif selected_db == "DynamoDB":
        database_list = dbconn_dynamodb.list_databases()
    elif selected_db == "ADLSGen2":
        database_list = adls_conn.get_container_list(storage_name, access_key)
    return HttpResponse(json.dumps(database_list), content_type="application/json")


def get_table_list(request):
    host_name = request.GET.get("host")
    port = request.GET.get("port")
    user_name = request.GET.get("user_name")
    db_name = request.GET.get("db_name")
    if selected_db == "SQL SERVER":
        table_list = db_conn.list_tables(host_name, port, user_name, db_name)
    elif selected_db == "SQLITE":
        table_list = dbconn_sqlite.list_tables(db_name)
    elif selected_db == "DynamoDB":
        table_list = dbconn_dynamodb.list_tables(host_name)
    elif selected_db == "ADLSGen2":
        table_list = adls_conn.get_file_list(db_name)
    return HttpResponse(json.dumps(table_list), content_type="application/json")


def get_tables_fields_list(request):
    host_name = request.GET.get("host")
    port = request.GET.get("port")
    user_name = request.GET.get("user_name")
    db_name = request.GET.get("db_name")
    table_list = request.GET.get("sel_tables")
    storage_name = request.GET.get("storage_name")
    access_key = request.GET.get("access_key")
    if selected_db == "SQL SERVER":
        table_field_list = db_conn.list_tables_fields(host_name, port, user_name, db_name, table_list)
    elif selected_db == "SQLITE":
        table_field_list = dbconn_sqlite.list_tables_fields(db_name, table_list)
    elif selected_db == "DynamoDB":
        table_field_list = dbconn_dynamodb.list_tables_fields(host_name, table_list)
    elif selected_db == "ADLSGen2":
        table_field_list = adls_conn.get_file_schema(table_list, storage_name, access_key, db_name)
    return HttpResponse(table_field_list, content_type="application/json")


def get_field_list_on_table_name(request):
    host_name = request.GET.get("host")
    port = request.GET.get("port")
    user_name = request.GET.get("user_name")
    db_name = request.GET.get("db_name")
    table_name = request.GET.get("table_name")
    field_list = db_conn.list_fields(host_name, port, user_name, db_name, table_name)
    return HttpResponse(field_list, content_type="application/json")


@csrf_exempt
def save_business_object_detail(request):
    request_data = request.POST['req_data']
    response = business_object_service.insert_update_business_object(request_data)
    print(response)
    if response > 0:
        return HttpResponse(json.dumps([{"Status": "Success", "Message": "Domain Object Submitted Successfully"}]),
                            content_type="application/json")
        # try:
        #     query_json = get_query_json(response, is_sql)
        #     dynamic_query = create_query(query_json, is_sql)
        #     obj_data = json.loads(request_data)
        #     object_data = obj_data["data"]
        #     if is_sql:
        #         del_existing_qry = "DROP VIEW IF EXISTS [" + object_data["ObjectName"] + "]"
        #     else:
        #         del_existing_qry = "DROP TABLE IF EXISTS [" + object_data["ObjectName"] + "]"
        #     db_conn.delete_table_obj_if_exists(object_data["HostName"], object_data["Port"],
        #                                        object_data["UserName"], object_data["DatabaseName"], del_existing_qry)
        #     if is_sql:
        #         exec_sql_query = "CREATE VIEW [" + object_data["ObjectName"] + "] AS " + dynamic_query
        #         print(exec_sql_query)
        #     else:
        #         exec_sql_query = "CREATE TABLE [" + object_data["ObjectName"] + "] AS " + dynamic_query
        #     db_conn.create_table_for_business_object(object_data["HostName"], object_data["Port"],
        #                                              object_data["UserName"], object_data["DatabaseName"],
        #                                              exec_sql_query)
        #     alter_query_for_masking = create_mask_query(query_json)
        #     print(alter_query_for_masking)
        #     db_conn.execute_alter_query(object_data["HostName"], object_data["Port"],
        #                                 object_data["UserName"], object_data["DatabaseName"], alter_query_for_masking)
        #     return HttpResponse(json.dumps(
        #         [{"Status": "Success", "Message": "Business Object Submitted Successfully", "Result": response}]),
        #                         content_type="application/json")
        # except:
        #     return HttpResponse(json.dumps([{"Status": "Failed", "Message": "Something went wrong"}]),
        #                         content_type="application/json")
    else:
        return HttpResponse(json.dumps([{"Status": "Failed", "Message": "Something went wrong"}]),
                            content_type="application/json")


def get_businessobj_list(request):
    bo_list = business_object_repo.get_business_objectlist()
    # print(ntpath.basename(bo_list[1]['DatabaseName']))
    bolist = []

    for row in bo_list:
        bolist.append(bodetails(row['DetailId'], row['BusinessObjectName'], ntpath.basename(row['DatabaseName']),
                                row['AccessLevel']))
    # print(bolist[1].dbname)
    return render(request, "business_obj_list.html", {'bo_list': bolist})


class bodetails:
    def __init__(self, id, x, y, z):
        self.DetailId = id
        self.BusinessObjectName = x
        self.DatabaseName = y
        self.AccessLevel = z


def get_businessobj_fields(request):
    print("fsdgdfgfd")
    object_id = request.GET.get("object_id")
    fieldlist = business_object_repo.get_bo_field_list(object_id)
    return HttpResponse(json.dumps(fieldlist), content_type="application/json")


def create_business_object(request):
    # context = {'is_sql': is_sql}
    return render(request, "widgets.html")


def dashboard(request):
    return render(request, "index.html")


def get_businessobj_joindetails(request):
    object_id = request.GET.get("object_id")
    joinlist = business_object_repo.get_joins_by_detail_id(object_id)
    return HttpResponse(json.dumps(joinlist), content_type="application/json")


def get_businessobj_wheredetails(request):
    object_id = request.GET.get("object_id")
    wherelist = business_object_repo.get_where_clauses_by_detail_id(object_id)
    return HttpResponse(json.dumps(wherelist), content_type="application/json")


def execute_custom_query(request):
    # if is_sql:
    #     context = {'host_name': connection_config.host_name, 'database_name': connection_config.database_name,
    #                'user_id': connection_config.user_id, 'password': connection_config.password, 'is_sql': is_sql}
    # else:
    #     context = {}
    domain_obj_list = business_object_repo.get_business_objectlist()
    user_list = business_object_repo.get_user_list()
    context = {'list_domain_obj': domain_obj_list, 'user_list': user_list}
    return render(request, "executequery.html", context);


def get_user_list(request):
    host_name = connection_config.host_name
    database_name = connection_config.database_name
    user_id = connection_config.user_id
    password = connection_config.password
    if is_sql:
        user_list = db_conn.list_db_user(host_name, user_id, password, database_name)
        return HttpResponse(json.dumps(user_list), content_type="application/json")
    else:
        return HttpResponse(None, content_type="application/json")


def converter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()


def execute_query(request):
    object_id = request.GET.get("object_id")
    user_key = request.GET.get("user_id")
    
    response = adls_conn.execute_select_query(object_id, user_key)
    return HttpResponse(json.dumps(response, default=converter), content_type="application/json")


def access_permissions(request):
    domain_obj_list = business_object_repo.get_business_objectlist()
    user_list = business_object_repo.get_user_list()
    print(domain_obj_list)
    context = {'list_domain_obj': domain_obj_list, 'user_list': user_list}
    return render(request, "access_permissions.html", context)


def object_permissions(request):
    domain_obj_list = business_object_repo.get_business_objectlist()
    user_list = business_object_repo.get_user_list()
    print(domain_obj_list)
    print(user_list)
    context = {'list_domain_obj': domain_obj_list, 'user_list': user_list}
    return render(request, "object_permissions.html", context)


def users(request):
    # print("user ADD here")
    # print(get_random_user_key())
    user_key = get_random_user_key()
    if is_sql:
        # print("a")
        context = {'host_name': connection_config.host_name, 'database_name': connection_config.database_name,
                   'user_id': connection_config.user_id, 'password': connection_config.password, 'is_sql': is_sql,
                   'user_key': user_key}
    else:
        # print("b")
        context = {'user_key': user_key}
    return render(request, "user_management.html", context)


def get_random_user_key():
    return uuid.uuid1()


@csrf_exempt
def execute_col_sec(request):
    obj = request.POST['req_data']
    print(obj)
    response = business_object_service.insert_update_col_level_permission(obj)
    print(response)

    return HttpResponse(
        json.dumps([{"Status": "Success", "Result": "Details submitted successfully for column level permission"}]),
        content_type="application/json")


@csrf_exempt
def execute_object_permission(request):
    obj = request.POST['req_data']
    print(obj)
    response = business_object_service.insert_update_obj_level_permission(obj)
    print(response)
    return HttpResponse(
        json.dumps([{"Status": "Success", "Result": "Details submitted successfully for object level permission"}]),
        content_type="application/json")


@csrf_exempt
def execute_row_sec(request):
    obj = request.POST['req_data']
    print(obj)

    response = business_object_service.insert_update_row_level_permission(obj)
    print(response)

    return HttpResponse(
        json.dumps([{"Status": "Success", "Result": "Details submitted successfully for row level permission"}]),
        content_type="application/json")


def get_field_values(request):
    # domain_obj_name = request.GET.get('domain_obj_name')
    field_name = request.GET.get('field_name')
    tb_name = request.GET.get('tb_name')
    providername = request.GET.get('provider_name')
    domain_object_id = request.GET.get('domain_object_id')
    print(providername)
    if providername == "SQL SERVER":
        field_values = db_conn.get_field_values(tb_name, field_name, domain_object_id)
    elif providername == "SQLITE":
        field_values = dbconn_sqlite.get_field_values(tb_name, field_name, domain_object_id)
    elif providername == "DynamoDB":
        field_values = dbconn_dynamodb.get_field_values(tb_name, field_name, domain_object_id)
    elif providername == "ADLSGen2":
        field_values = adls_conn.get_field_values(tb_name, field_name, domain_object_id)
    return HttpResponse(json.dumps(field_values), content_type="application/json")


@csrf_exempt
def save_user_management_object_detail(request):
    request_data = request.POST['req_data']
    response = business_object_service.insert_update_user_management_object(request_data)

    if int(response) > 0:
        return HttpResponse(json.dumps(
            [{"Status": "Success", "Message": "User management object submitted successfully", "Result": response}]),
            content_type="application/json")

    else:
        return HttpResponse(json.dumps([{"Status": "Failed", "Message": "Something went wrong"}]),
                            content_type="application/json")


def user_details(request):
    domain_obj_list = business_object_repo.get_user_details_repo()
    print(domain_obj_list)
    return render(request, "user_details.html", {'list_user_details_obj': domain_obj_list})


@csrf_exempt
def update_user_status(request):
    sts_obj = request.POST['sts_obj']
    response = business_object_service.update_user_active_status(sts_obj)

    if response:
        return HttpResponse(json.dumps(
            [{"Status": "Success", "Message": "User Status updated successfully", "Result": response}]),
            content_type="application/json")
    else:
        return HttpResponse(json.dumps([{"Status": "Failed", "Message": "Something went wrong"}]),
                            content_type="application/json")


def editusers(request, id):
    userid = id
    return render(request, "user_management.html")


def get_user_detail_by_id(request):
    userid = request.GET.get('userid')
    print(userid)
    response = business_object_repo.get_userdetails_by_userid(userid)
    print(response)
    return HttpResponse(json.dumps(response), content_type="application/json")


def get_business_object_data_by_name(request):
    business_object_name = request.GET.get('dataBusinessObjectName')
    print(business_object_name)
    request_data = business_object_repo.get_business_object_data_by_name(business_object_name)
    print(request_data)
    if request_data != "[]":
        return HttpResponse(json.dumps([{"Status": "Success", "Message": "Domain Object name already available "}]),
                            content_type="application/json")
    else:
        return HttpResponse(json.dumps([{"Status": "Failed", "Message": "Something went wrong"}]),
                            content_type="application/json")


def userwise_maskencryption(request):
    domain_obj_list = business_object_repo.get_business_objectlist()
    user_list = business_object_repo.get_user_list()
    print(domain_obj_list)
    print(user_list)
    context = {'list_domain_obj': domain_obj_list, 'user_list': user_list}
    return render(request, "userwise_maskencryption.html", context)


@csrf_exempt
def save_maskencryptionstatus(request):
    request_data = request.POST['req_data']
    response = business_object_service.insert_update_maskencrypt_status(request_data)

    if response > 0:
        return HttpResponse(json.dumps(
            [{"Status": "Success", "Message": "Record inserted successfully", "Result": response}]),
            content_type="application/json")

    else:
        return HttpResponse(json.dumps([{"Status": "Failed", "Message": "Something went wrong"}]),
                            content_type="application/json")


def get_object_permision_details(request):
    userid = request.GET.get('userid')
    detailid = request.GET.get('detailid')
    response = business_object_repo.get_obj_permission_details(userid, detailid)
    print(response)
    return HttpResponse(json.dumps(response), content_type="application/json")


def get_row_permision_details(request):
    userid = request.GET.get('userid')
    field_id = request.GET.get('field_id')
    response = business_object_repo.get_row_permission_field_details(userid, field_id)
    print(response)
    return HttpResponse(json.dumps(response), content_type="application/json")


def get_col_permision_details(request):
    userid = request.GET.get('userid')
    detailid = request.GET.get('detailid')
    response = business_object_repo.get_col_permission_field_details(userid, detailid)
    print(response)
    return HttpResponse(json.dumps(response), content_type="application/json")


def get_mask_encryption_details(request):
    userid = request.GET.get('userid')
    detailid = request.GET.get('detailid')
    response = business_object_repo.get_mask_encryption_details(userid, detailid)
    print(response)
    return HttpResponse(json.dumps(response), content_type="application/json")


def get_users_on_domain_object(request):
    object_id = request.GET.get("object_id")
    user_list = business_object_repo.get_users_on_domain_object_by_detail_id(object_id)
    return HttpResponse(json.dumps(user_list), content_type="application/json")


def get_domain_object_list_userwise(request):
    userid = request.GET.get('userid')
    response = business_object_repo.get_domain_object_list_userwise(userid)
    print(response)
    return HttpResponse(json.dumps(response), content_type="application/json")


def login(request):
    try:
        del request.session['user_name']
    except KeyError:
        pass
    return render(request, "login.html")


def is_authenticated(request):
    request.session['user_name'] = request.GET.get('user_name')
    user_name = request.GET.get('user_name')
    password = request.GET.get('password')
    response = business_object_repo.check_credentials(user_name, password)
    return HttpResponse(json.dumps(response), content_type="application/json")


@csrf_exempt
def change_login_password(request):
    obj = request.POST['obj']
    new_obj = json.loads(obj)
    old_password = new_obj["old_pass"]
    new_password = new_obj["new_pass"]
    response = business_object_repo.change_password(old_password, new_password)
    return HttpResponse(json.dumps(response), content_type="application/json")

    # return HttpResponse(json.dumps([{"Status": "Success", "Message": "Success"}]),content_type="application/json")


def check_function_availability(request):
    object_id = request.GET.get("object_id")
    user_key = request.GET.get("user_id")
    response = adls_conn.check_function_availability(object_id, user_key)
    return HttpResponse(json.dumps(response, default=converter), content_type="application/json")


def fetch_data_from_adx(request):
    user_key = request.GET.get('user_key')
    object_id = request.GET.get('object_id')
    function_name = request.GET.get("function_name")
    filter_data = request.GET.get("filter_text")
    response = adls_conn.fetch_data_from_adx(user_key, function_name, filter_data, object_id)
    return HttpResponse(json.dumps(response, default=converter), content_type="application/json")