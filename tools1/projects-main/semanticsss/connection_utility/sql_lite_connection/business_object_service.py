"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
import json
from collections import namedtuple
from connection_utility.sql_lite_connection.business_object_repo import insert_business_object, update_business_object, \
    insert_tables_data, \
    insert_field_data, delete_table_data, get_business_object_list, get_business_object_data_by_id, \
    get_tables_data_by_detail_id, get_fields_data_by_table_id, delete_join_data, insert_join_data, \
    get_join_data_by_detail_id, insert_where_data, insert_obj_level_permission, \
    insert_col_level_permission, insert_row_level_permission, insert_user_management_object, update_user_status, \
    delete_row_level_permission, delete_col_level_permission, update_user_management_object, insert_mask_status,\
    delete_obj_level_permission


def get_json():
    with open("sample_data.json") as json_data:
        json_data = json.load(json_data)
        return json_data


def parse_object_json_data():
    with open("sample_data.json") as json_str:
        json_data = json.loads(json_str, object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))
        return json_data


def insert_update_business_object(json_data):
    obj_data = json.loads(json_data)
    object_data = obj_data["data"]
    object_id = object_data["ObjectId"]
    if object_id == 0:
        business_object = (
            object_data["ObjectName"], object_data["DatabaseName"], object_data["HostName"], object_data["Port"],
            object_data["UserName"], object_data["AccessLevel"], object_data["ProviderName"],
            object_data["StorageName"], object_data["StorageAccessKey"])
        object_id = insert_business_object(business_object)
    else:
        business_object = (
            object_data["ObjectName"], object_data["DatabaseName"], object_data["HostName"], object_data["Port"],
            object_data["UserName"], object_data["AccessLevel"], object_data["ProviderName"], object_id)
        update_business_object(business_object)
        delete_table_data(object_id)
        delete_join_data(object_id)
    tables_list = object_data["Tables"]
    for tables in tables_list:
        table_object = (object_id, tables["TableName"], tables["AliasName"], tables["Mask"])
        table_id = insert_tables_data(table_object)
        fields_list = tables["Fields"]
        for field in fields_list:
            field_object = (
                table_id, field["FieldName"], field["DataType"], field["AliasName"], field["Mask"],
                field["AccessLevel"], field["AccessControlled"])
            insert_field_data(field_object)
    join_list = object_data["Joins"]
    for join in join_list:
        join_object = (
            object_id, join["Table1Name"], join["Table2Name"], join["JoinType"], join["Table1Field"],
            join["Table2Field"],
            join["Condition"])
        insert_join_data(join_object)
    where_list = object_data["WhereClause"]
    for where in where_list:
        where_obj = (object_id, where["TableName"], where["FieldName"], where["Condition"], where["CompareValue"])
        insert_where_data(where_obj)
    print("Domain Object detail submitted successfully")
    return object_id


def obj_dict(obj):
    return obj.__dict__


class Object:
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)


def list_business_object():
    list_data = list()
    list_json = get_business_object_list()
    list_obj = json.loads(list_json)
    for item in list_obj:
        obj = Object()
        obj.ObjectId = item["DetailId"]
        obj.ObjectName = str(item["BusinessObjectName"]).strip()
        obj.DatabaseName = str(item["DatabaseName"]).strip()
        list_data.append(obj)
    json_result = json.dumps(list_data, default=obj_dict)
    return json_result


def get_business_object_detail_by_id(object_id):
    detail_data = Object()
    list_json = get_business_object_data_by_id(object_id)
    list_obj = json.loads(list_json)
    if len(list_obj) > 0:
        obj_data = list_obj[0]
        detail_data.data = Object()
        detail_data.data.ObjectId = obj_data["DetailId"]
        detail_data.data.ObjectName = str(obj_data["BusinessObjectName"]).strip()
        detail_data.data.DatabaseName = str(obj_data["DatabaseName"]).strip()
        detail_data.data.Tables = []
        table_list = get_tables_data_by_detail_id(object_id)
        list_tables = json.loads(table_list)
        if len(list_tables) > 0:
            for table in list_tables:
                table_obj = Object()
                table_obj.TableId = table["TableId"]
                table_obj.TableName = str(table["TableName"]).strip()
                table_obj.ObjectId = table["DetailId"]
                table_obj.AliasName = str(table["AliasName"]).strip()
                table_obj.Mask = str(table["Mask"]).strip()
                table_obj.Fields = []
                field_list = get_fields_data_by_table_id(table["TableId"])
                list_fields = json.loads(field_list)
                if len(list_fields) > 0:
                    for field in list_fields:
                        field_obj = Object()
                        field_obj.FieldId = field["FieldId"]
                        field_obj.TableId = field["TableId"]
                        field_obj.FieldName = str(field["FieldName"]).strip()
                        field_obj.DataType = str(field["DataType"]).strip()
                        field_obj.AliasName = str(field["AliasName"]).strip()
                        field_obj.Mask = field["Mask"]
                        table_obj.Fields.append(field_obj)
                detail_data.data.Tables.append(table_obj)
        detail_data.data.Joins = []
        join_list = get_join_data_by_detail_id(object_id)
        list_join = json.loads(join_list)
        if len(list_join) > 0:
            for join in list_join:
                join_obj = Object()
                join_obj.JoinId = join["JoinId"]
                join_obj.DetailId = join["DetailId"]
                join_obj.Table1Name = str(join["Table1Name"]).strip()
                join_obj.Table2Name = str(join["Table2Name"]).strip()
                join_obj.JoinType = str(join["JoinType"]).strip()
                join_obj.Table1Field = str(join["Table1Field"]).strip()
                join_obj.Table2Field = str(join["Table2Field"]).strip()
                detail_data.data.Joins.append(join_obj)
        detail_data = json.dumps(detail_data, default=obj_dict)
    else:
        print("No records found")
    print(detail_data)
    return detail_data


def insert_update_obj_level_permission(json_data):
    obj_data = json.loads(json_data)
    obj_data = json.loads(json_data)
    object_data = obj_data["data"]
    userid = object_data["UserId"]
    detailid = object_data["DetailId"]
    delete_obj_level_permission(userid, detailid)
    if object_data["Permission"] == "true" :
        object_data["Permission"] = 1
    else :
        object_data["Permission"] = 0
    business_object = (object_data["UserId"], object_data["DetailId"], object_data["Permission"], object_data["AccessLevel"])
    object_id = insert_obj_level_permission(business_object)
    return object_id


def insert_update_col_level_permission(json_data):
    obj_data = json.loads(json_data)
    object_data = obj_data["data"]
    userid = object_data["UserId"]
    fieldlist = object_data["FieldList"]
    for field in fieldlist:
        delete_col_level_permission(userid,field["fieldid"])
        if field["status"] == "true":
            field["status"]=1
            object = (userid, field["fieldid"], field["status"])
            insert_col_level_permission(object)


def insert_update_row_level_permission(json_data):
    obj_data = json.loads(json_data)
    object_data = obj_data["data"]
    userid = object_data["UserId"]
    fieldid = object_data["FieldId"]
    fieldvalues = object_data["FieldValues"]
    delete_row_level_permission(userid,fieldid)
    for field in fieldvalues:
        if field["status"] == "true":
            field["status"] = 1
            object = (userid, fieldid, field["fieldvalue"], field["status"])
            insert_row_level_permission(object)


def insert_update_user_management_object(json_data):
    obj_data = json.loads(json_data)
    object_data = obj_data["data"]
    object_id = object_data["object_id"]
    if object_id == 0:
        business_object = (
        object_data["user_name"], object_data["user_email_Id"], object_data["user_password"], object_data["IsActive"],
        object_data["UserAccessType"], object_data["userkey"])
        object_id = insert_user_management_object(business_object)
        print("User details inserted successfully")
    else:
        business_object = (
            object_data["user_name"], object_data["user_email_Id"], object_data["user_password"],
            object_data["UserAccessType"], object_id)
        update_user_management_object(business_object)
        print("User updated successfully")

    return object_id


def update_user_active_status(json_data):
    print("serv")
    obj_data = json.loads(json_data)
    print(obj_data["userstatus"])
    print(obj_data["userid"])
    sts_obj = (obj_data["userstatus"], obj_data["userid"])
    res = update_user_status(sts_obj)
    print(res)
    return res


def insert_update_maskencrypt_status(json_data):
    obj_data = json.loads(json_data)
    object_data = obj_data["data"]
    userid = object_data["UserId"]
    fieldlist = object_data["FieldList"]
    for field in fieldlist:
        object = (userid, field["fieldid"], field["stsid"])
        object_id=insert_mask_status(object)
    return object_id
