"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
import json
import sqlite3
from sqlite3 import Error

from api.sql_type_switcher import sql_type_switcher
from connection_utility.sql_lite_connection import business_object_repo as db, business_object_repo
import connection_utility.common_utility.create_business_object_query as dynamic_query_utility
from app.config import connection_config
import boto3
import decimal
from cryptography.fernet import Fernet
import pyodbc
import datetime
import connection_utility.adls_connection.adx_utility as adx_util

db_file = db.get_db_file_path()


def create_connection():
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)
    return conn


def create_sqlite_connection(db_name):
    conn = None
    try:
        conn = sqlite3.connect(db_name)
    except Error as e:
        print(e)
    return conn


def get_connection(host_name, user_id, password, db_name):
    conn = pyodbc.connect(Driver='ODBC Driver 17 for SQL Server', Server=host_name, Database=db_name, UID=user_id,
                          PWD=password)
    # cur = conn.cursor()
    return conn


def list_conversion(data):
    list_item = []
    for item_str in data:
        list_item.append(" | ".join(item_str))
    return list_item


def is_valid_user(user_name, password):
    user_id = 0
    try:
        args = (user_name, password)
        conn = create_connection()
        cur = conn.cursor()
        cur.execute("SELECT UserId from Users WHERE IsActive = 1 AND UserName = ? AND Password = ?", args)
        result = cur.fetchone()
        user_id = list(result)[0]
        conn.close()
    except Error as e:
        print(e)
    return user_id


def is_valid_user_by_user_key(user_key):
    user_id = 0
    try:
        args = (user_key)
        print(args)
        conn = create_connection()
        cur = conn.cursor()
        cur.execute("SELECT UserId from Users WHERE IsActive = 1 AND UserKey = ?", (args,))
        result = cur.fetchone()
        if result is not None:
            user_id = list(result)[0]
        conn.close()
    except Error as e:
        print(e)
    return user_id


class DomainObject:
    def __init__(self, detail_id, domain_object_name):
        self.DetailId = detail_id
        self.DomainObjectName = domain_object_name

    def tojson(self):
        return {"DetailId": self.DetailId, "DomainObjectName": self.DomainObjectName}


def list_user_domain_objects(user_key):
    list_objects = []
    try:
        conn = create_connection()
        cur = conn.cursor()
        user_id = is_valid_user_by_user_key(user_key)
        if user_id > 0:
            args = str(user_id)
            sql_query = "SELECT distinct bod.DetailId, bod.BusinessObjectName FROM BusinessObjectDetails bod " \
                        "LEFT OUTER JOIN Object_Permission op ON bod.DetailId = op.DetailId " \
                        "WHERE (op.UserId = ? AND op.IsAllowed=1) OR bod.AccessLevel='Public'"
            cur.execute(sql_query, (args,))
            result = cur.fetchall()
            if len(result) > 0:
                for item in result:
                    list_objects.append(DomainObject(item[0], item[1]))
            else:
                list_objects = []
        conn.close()
    except Error as e:
        print(e)
    return json.dumps([ob.tojson() for ob in list_objects])


def list_domain_objects_by_user(user_key):
    list_objects = None
    try:
        conn = create_connection()
        cur = conn.cursor()
        user_id = is_valid_user_by_user_key(user_key)
        if user_id > 0:
            args = str(user_id)
            sql_query = "SELECT distinct bod.BusinessObjectName FROM BusinessObjectDetails bod " \
                        "LEFT OUTER JOIN Object_Permission op ON bod.DetailId = op.DetailId " \
                        "WHERE (op.UserId = ? AND op.IsAllowed=1) OR bod.AccessLevel='Public'"
            cur.execute(sql_query, (args,))
            result = cur.fetchall()
            if len(result) > 0:
                list_objects = list_conversion(result)
            else:
                list_objects = []
            print(list_objects)
        conn.close()
    except Error as e:
        print(e)
    return list_objects


class Fields:
    def __init__(self, field_name, field_type, is_masking, is_encrypt, field_access_level, user_access_level):
        self.FieldName = field_name
        self.DataType = field_type
        if is_masking == 'True':
            self.IsMasking = True
        else:
            self.IsMasking = False
        if is_encrypt == 'True':
            self.IsEncrypt = True
        else:
            self.IsEncrypt = False
        self.FieldAccessLevel = field_access_level
        self.UserAccessLevel = user_access_level

    def toJSON(self):
        return {"FieldName": self.FieldName, "DataType": self.DataType, "IsMasking": bool(self.IsMasking),
                "IsEncrypt": bool(self.IsEncrypt),
                "FieldAccessLevel": self.FieldAccessLevel,
                "UserAccessLevel": self.UserAccessLevel}


class MaskEncrypt:
    def __init__(self, field_name, mask_encrypt):
        self.FieldName = field_name
        self.MaskEncrypt = mask_encrypt

    def tojson(self):
        return {"FieldName": self.FieldName, "MaskEncrypt": self.MaskEncrypt}


def get_mask_encrypt_detail_on_field_for_user(user_id, table_name):
    field_list = []
    try:
        conn = create_connection()
        cur = conn.cursor()
        args = (user_id, table_name)
        sql_query = "SELECT fd.AliasName, cast(med.MaskEncryptStatus as text) as MaskEncryptStatus FROM " \
                    "MaskingEncryptionDetails med INNER JOIN FieldDetails fd ON med.FieldId = fd.FieldId INNER JOIN " \
                    "TableDetails td ON fd.TableId = td.TableId INNER JOIN BusinessObjectDetails bod ON td.DetailId = " \
                    "bod.DetailId WHERE med.MaskEncryptStatus NOT IN ('',0) AND med.UserId = ? AND " \
                    "bod.BusinessObjectName = ? "
        cur.execute(sql_query, args)
        result = cur.fetchall()
        if len(result) > 0:
            list_fields = list_conversion(result)
            for field in list_fields:
                col_desc = field.split("|")
                field_list.append(MaskEncrypt(str(col_desc[0]).strip(), str(col_desc[1]).strip()))
        conn.close()
    except Error as e:
        print(e)
    return field_list


def list_table_fields(user_name, password, table_name):
    field_list = []
    try:
        conn = create_connection()
        cur = conn.cursor()
        user_id = is_valid_user(user_name, password)
        if user_id > 0:
            args = (user_id, user_id, table_name, user_id)
            # sql_query = "SELECT fd.AliasName, fd.DataType, IFNULL(fd.Mask, False) as 'Mask' FROM FieldDetails fd INNER JOIN Column_Permission cp on fd.FieldId = cp.FieldId INNER JOIN TableDetails td ON fd.TableId = td.TableId INNER JOIN BusinessObjectDetails bod ON bod.DetailId = td.DetailId WHERE cp.IsAllowed = 1 AND cp.UserId = ? AND bod.BusinessObjectName = ?"
            # sql_query = "SELECT fd.AliasName, fd.DataType, fd.AccessLevel as FieldAccessLevel,ob.AccessLevel as " \
            #             "UserAccessLevel FROM FieldDetails fd INNER JOIN " \
            #             "TableDetails td ON fd.TableId = td.TableId INNER JOIN BusinessObjectDetails bod ON " \
            #             "bod.DetailId = td.DetailId INNER JOIN Object_Permission ob ON bod.DetailId = ob.DetailId " \
            #             "LEFT OUTER JOIN Column_Permission cp on fd.FieldId = cp.FieldId WHERE ob.UserId = ? AND " \
            #             "bod.BusinessObjectName = ? AND ((ob.AccessLevel IN ('Public','Protected') AND fd.AccessLevel " \
            #             "IN('Public','Protected')) OR (ob.AccessLevel = 'Private') OR (cp.IsAllowed=1)) "\

            # SELECT (case when fd.AliasName='' then fd.FieldName else fd.AliasName end) as FieldName
            sql_query = "SELECT (case when fd.AliasName='' then fd.FieldName else fd.AliasName end) as FieldName, fd.DataType, fd.AccessLevel as FieldAccessLevel,IFNULL(ob.AccessLevel," \
                        "'Public') as UserAccessLevel,fd.Mask FROM FieldDetails fd INNER JOIN TableDetails td ON fd.TableId = " \
                        "td.TableId INNER JOIN BusinessObjectDetails bod ON bod.DetailId = td.DetailId LEFT OUTER " \
                        "JOIN Object_Permission ob ON bod.DetailId = ob.DetailId AND ob.UserId=? LEFT OUTER JOIN Column_Permission cp " \
                        "on fd.FieldId = cp.FieldId AND cp.UserId=? WHERE bod.BusinessObjectName = ? AND ((ob.AccessLevel IS NULL AND " \
                        "fd.AccessLevel in ('Public','Protected')) OR (ob.AccessLevel IS NOT NULL AND ob.UserId = ?)) AND ((" \
                        "ob.AccessLevel IN ('Public','Protected') AND fd.AccessLevel IN('Public','Protected')) OR (" \
                        "ob.AccessLevel = 'Private') OR (cp.IsAllowed=1)OR (ob.AccessLevel IS NULL )) "
            cur.execute(sql_query, args)
            result = cur.fetchall()

            print(len(result))
            if len(result) > 0:
                mask_encryption_details = get_mask_encrypt_detail_on_field_for_user(user_id, table_name)
                list_fields = list_conversion(result)
                for field in list_fields:
                    col_desc = field.split("|")
                    field_name = str(col_desc[0]).strip()
                    data_type = sql_type_switcher(str(col_desc[1]).strip())
                    is_masking = ''
                    is_encrypt = ''
                    field_access_level = str(col_desc[2]).strip()
                    user_access_level = str(col_desc[3]).strip()
                    mask_encrypt_status = str(col_desc[4]).strip()
                    if mask_encrypt_status == '1':
                        is_masking = 'True'
                    if mask_encrypt_status == '2':
                        is_encrypt = 'True'
                    # if len(mask_encryption_details) > 0:
                    #     for data in mask_encryption_details:
                    #         if data.FieldName == field_name:
                    #             if data.MaskEncrypt == '1':
                    #                 is_masking = 'True'
                    #             if data.MaskEncrypt == '2':
                    #                 is_encrypt = 'True'
                    field_list.append(
                        Fields(field_name, data_type, is_masking, is_encrypt, field_access_level, user_access_level))
            else:
                field_list = []
            json_response = (json.dumps([ob.toJSON() for ob in field_list]))
            conn.close()
            return json.loads(json_response)
    except Error as e:
        print(e)


def get_connection_string_of_object(user_name, password, table_name):
    print("TableName>>>>" + table_name)
    connection_string = None
    try:
        conn = create_connection()
        cur = conn.cursor()
        sql_query = "SELECT HostName,DatabaseName,Port,UserName,Password FROM BusinessObjectDetails WHERE " \
                    "BusinessObjectName = ? "
        cur.execute(sql_query, (table_name,))
        result = cur.fetchone()
        print(list(result))
        connection_string = "Server={server_name};Database={db_name};User Id={uid};Password={pwd}".format(
            server_name=list(result)[0], db_name=list(result)[1], uid=list(result)[2], pwd=list(result)[3]
        )
        conn.close()
    except Error as e:
        print(e)
    print(connection_string)
    return connection_string


def get_connection_string_of_Sqlite(user_name, password, table_name):
    print("TableName>>>>" + table_name)
    connection_string = None
    try:
        conn = create_connection()
        cur = conn.cursor()
        sql_query = "SELECT HostName,DatabaseName,Port,UserName,Password FROM BusinessObjectDetails WHERE " \
                    "BusinessObjectName = ? "
        cur.execute(sql_query, (table_name,))
        result = cur.fetchone()
        # print(list(result))
        connection_string = "{db_name}".format(
            db_name=list(result)[1]
        )
        conn.close()
    except Error as e:
        print(e)
    print(connection_string)
    return connection_string


def get_object_id_by_name(table_name):
    object_id = 0
    try:
        args = (table_name,)
        conn = create_connection()
        cur = conn.cursor()
        cur.execute("SELECT DetailId FROM BusinessObjectDetails WHERE BusinessObjectName = ?", args)
        result = cur.fetchone()
        if result is not None:
            object_id = list(result)[0]
        conn.close()
    except Error as e:
        print(e)
    return object_id


def get_select_query_for_object(user_name, password, table_name):
    sql_query = None
    try:
        user_id = is_valid_user(user_name, password)
        object_id = get_object_id_by_name(table_name)
        if user_id > 0 and object_id > 0:
            query_json = dynamic_query_utility.get_query_json_for_user_object(user_id, object_id)
            print(query_json)
            sql_query = dynamic_query_utility.create_query(query_json, True)
    except Error as e:
        print(e)
    return sql_query


def get_select_query_for_object_by_userkey(user_key, table_name):
    sql_query = None
    try:
        user_id = is_valid_user_by_user_key(user_key)
        object_id = get_object_id_by_name(table_name)
        if user_id > 0 and object_id > 0:
            query_json = dynamic_query_utility.get_query_json_for_user_object(user_id, object_id)
            print(query_json)
            sql_query = dynamic_query_utility.create_query(query_json, True)
    except Error as e:
        print(e)
    return sql_query


def get_data_for_object(user_key, table_name):
    result = None
    try:
        user_id = is_valid_user_by_user_key(user_key)
        object_id = get_object_id_by_name(table_name)
        if user_id > 0 and object_id > 0:
            query_json = dynamic_query_utility.get_query_json_for_user_object(user_id, object_id)
            sql_query = dynamic_query_utility.create_query(query_json, True)

            conn = create_sqlite_connection(get_connection_string_of_Sqlite("", "", table_name))
            cur = conn.cursor()
            # sql_query = "select [Order].[OrderDate] as [OrderDate],[Order].[ShipName] as [ShipName],[Order].[ShipCountry] as [ShipCountry],[OrderDetail].[Quantity] as [Quantity] from [Order],[OrderDetail] LIMIT 10000"
            cur.execute(sql_query)
            print(sql_query)
            object_id = get_object_id_by_name(table_name)
            maskvalue = get_user_object_details(user_id, object_id)

            r = [dict((cur.description[i][0], MaskEncryptValue(cur.description[i][0], value, maskvalue))
                      for i, value in enumerate(row)) for row in cur.fetchall()]

            result = json.dumps((r[0] if r else None) if None else r)

            conn.close()
            # print(result)
    except Error as e:
        print(e)
    return result


def get_data_for_object_sqlserver(user_key, table_name):
    result = None
    try:
        user_id = is_valid_user_by_user_key(user_key)
        object_id = get_object_id_by_name(table_name)
        if user_id > 0 and object_id > 0:
            sql_query = get_select_query_for_object_by_userkey(user_key, table_name)
            print(sql_query)
            conn_string = get_connection_string_of_object("", "", table_name)
            print("------------------------")
            print(conn_string)
            conn_string_split = conn_string.split(";")
            hostname = (conn_string_split[0]).split("=")[1]
            dbname = (conn_string_split[1]).split("=")[1]
            usr_id = (conn_string_split[2]).split("=")[1]
            pwd = (conn_string_split[3]).split("=")[1]

            conn = get_connection(hostname, usr_id, pwd, dbname)
            cur = conn.cursor()
            # sql_query = "select [Order].[OrderDate] as [OrderDate],[Order].[ShipName] as [ShipName],[Order].[ShipCountry] as [ShipCountry],[OrderDetail].[Quantity] as [Quantity] from [Order],[OrderDetail] LIMIT 10000"
            cur.execute(sql_query)
            print(sql_query)
            object_id = get_object_id_by_name(table_name)
            maskvalue = get_user_object_details(user_id, object_id)

            r = [dict((cur.description[i][0], MaskEncryptValue(cur.description[i][0], value, maskvalue))
                      for i, value in enumerate(row)) for row in cur.fetchall()]

            result = json.dumps(((r[0] if r else None) if None else r), default=myconverter)

            conn.close()
            # print(result)
    except Error as e:
        print(e)

    return result


def get_data_for_object_dynamodb(user_key, table_name):
    result = None
    # print(table_name)

    try:
        user_id = is_valid_user_by_user_key(user_key)
        object_id = get_object_id_by_name(table_name)
        con_dtl = connection_config(object_id)
        con_dtl.connect_db()
        if user_id > 0 and object_id > 0:
            query_json = dynamic_query_utility.get_query_json_for_user_object(user_id, object_id)
            # sql_query = dynamic_query_utility.create_query(query_json, True)
            expr = dynamic_query_utility.create_expression_for_dynamodb(query_json)
            maskvalue = get_user_object_details(user_id, object_id)
            print("maskvalue>>>>")
            print(maskvalue)
        try:
            dynamodb = boto3.resource('dynamodb', endpoint_url=con_dtl.dbhost)
            tblname = expr["TableName"]
            table = dynamodb.Table(tblname)
            pe = expr["ProjectionExpression"]
            fe = expr["FilterExpression"]
            ean = expr["NameMapDict"]
            eav = expr["ValueMapDict"]
            fieldtypedict = expr["FieldTypeDict"]
            fieldaliasdict = expr["FieldAliasDict"]
            lst = []

            for key, value in eav.items():

                flag = isinstance(value, float)
                if flag:
                    eav[key] = decimal.Decimal(str(value))
                    # print(eav[key])
                    # print("yes")
            # print(eav)

            if fe != "":
                response = table.scan(
                    FilterExpression=fe,
                    ProjectionExpression=pe,
                    ExpressionAttributeNames=ean,
                    ExpressionAttributeValues=eav,
                )
            else:
                response = table.scan(
                    ProjectionExpression=pe,
                    ExpressionAttributeNames=ean,
                )

            for i in response['Items']:
                lst.append(i)
                # print(json.dumps(i, cls=DecimalEncoder))

            while 'LastEvaluatedKey' in response:
                if fe != "":
                    response = table.scan(
                        ProjectionExpression=pe,
                        FilterExpression=fe,
                        ExpressionAttributeNames=ean,
                        ExpressionAttributeValues=eav,
                        ExclusiveStartKey=response['LastEvaluatedKey']
                    )
                else:
                    response = table.scan(
                        ProjectionExpression=pe,
                        ExpressionAttributeNames=ean,
                        ExclusiveStartKey=response['LastEvaluatedKey']
                    )

                for i in response['Items']:
                    lst.append(i)

            newlist = []

            for item in lst:
                resultdict.clear()
                rdict = getKeys(item)
                newlist.append(rdict.copy())
            print(newlist)

            resultlst = []
            for item in newlist:
                rdict = {}
                for key, value in item.items():
                    p = fieldaliasdict[key]
                    # print(p)
                    flag = isinstance(value, bool)
                    if flag and value == True:
                        value = 1
                    elif flag and value == False:
                        value = 0
                    rdict[p] = value
                    # print(rdict)
                resultlst.append(rdict.copy())
            print("resultlst>>>")
            print(resultlst)
            r = [dict((i, MaskEncryptValue(i, value, maskvalue))
                      for i, value in row.items()) for row in resultlst]

            result = json.dumps((r[0] if r else None) if None else r, cls=DecimalEncoder)

            # result = json.dumps(result, cls=DecimalEncoder)
            print(json.loads(result))
        except Error as e:
            print(e)
    except Error as e:
        print(e)
    return result


def myconverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()


def MaskEncryptValue(field_name, value, maskvalue):
    # print(maskvalue)
    maskvalue = maskvalue
    expectedResult = [d for d in maskvalue if d["FieldName"] == field_name]

    masked_or_encrypt = "0"
    key = Fernet.generate_key()
    access_level = ""
    field_access_level = ""

    if len(expectedResult) > 0:
        masked_or_encrypt = expectedResult[0]["MaskValue"]
        access_level = expectedResult[0]["AccessLevel"]
        field_access_level = expectedResult[0]["FieldAccessLevel"]
    if masked_or_encrypt == "1" and (access_level == "Public" or access_level == "Protected"):

        len_value = len(value)
        return "*" * len_value
    elif masked_or_encrypt == "2" and (access_level == "Public" or access_level == "Protected"):
        fernet = Fernet(key)
        encMessage = fernet.encrypt(value.encode())
        return str(encMessage)
    elif field_access_level == "Protected" and access_level == "Protected":
        len_value = len(value)
        return "*" * len_value
    elif field_access_level == "Protected" and access_level == "Public":
        return "None"
    else:
        return value


def get_user_object_details(user_id, object_id):
    conn = create_connection()
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    sql_query = "SELECT (case when fd.AliasName='' then fd.FieldName else fd.AliasName end) as FieldName," \
                " fd.Mask as MaskValue,fd.AccessLevel as FieldAccessLevel,IFNULL(ob.AccessLevel,'Public')" \
                " as AccessLevel from BusinessObjectDetails bd" \
                " INNER JOIN TableDetails td on bd.DetailId=td.DetailId INNER JOIN FieldDetails fd " \
                "on td.TableId=fd.TableId LEFT OUTER JOIN Object_Permission ob on ob.DetailId=bd.DetailId " \
                "where ob.UserId='" + str(user_id) + "' and bd.DetailId  =" + str(object_id)

    # print(sql_query)
    cur.execute(sql_query)
    result = cur.fetchall()
    conn.close()
    maskvalue_list = json.dumps([dict(ix) for ix in result])
    maskvalue = json.loads(maskvalue_list)
    return maskvalue


def get_expressions_for_dynamodb(user_name, password, table_name):
    sql_query = None
    try:
        user_id = is_valid_user(user_name, password)
        object_id = get_object_id_by_name(table_name)
        if user_id > 0 and object_id > 0:
            query_json = dynamic_query_utility.get_query_json_for_user_object(user_id, object_id)
            print(query_json)
            sql_query = dynamic_query_utility.create_expression_for_dynamodb(query_json)
    except Error as e:
        print(e)
    return sql_query


def get_data_for_dynamodb_obj(user_name, password, table_name):
    result = None
    # print(table_name)

    try:
        user_id = is_valid_user(user_name, password)
        object_id = get_object_id_by_name(table_name)
        con_dtl = connection_config(object_id)
        con_dtl.connect_db()
        if user_id > 0 and object_id > 0:
            query_json = dynamic_query_utility.get_query_json_for_user_object(user_id, object_id)
            # sql_query = dynamic_query_utility.create_query(query_json, True)
            expr = dynamic_query_utility.create_expression_for_dynamodb(query_json)

        try:
            dynamodb = boto3.resource('dynamodb', endpoint_url=con_dtl.dbhost)
            tblname = expr["TableName"]
            table = dynamodb.Table(tblname)
            pe = expr["ProjectionExpression"]
            fe = expr["FilterExpression"]
            ean = expr["NameMapDict"]
            eav = expr["ValueMapDict"]
            fieldtypedict = expr["FieldTypeDict"]
            fieldaliasdict = expr["FieldAliasDict"]
            lst = []

            for key, value in eav.items():

                flag = isinstance(value, float)
                if flag:
                    eav[key] = decimal.Decimal(str(value))
                    # print(eav[key])
                    # print("yes")
            # print(eav)

            if fe != "":
                response = table.scan(
                    FilterExpression=fe,
                    ProjectionExpression=pe,
                    ExpressionAttributeNames=ean,
                    ExpressionAttributeValues=eav,
                )
            else:
                response = table.scan(
                    ProjectionExpression=pe,
                    ExpressionAttributeNames=ean,
                )

            for i in response['Items']:
                lst.append(i)
                # print(json.dumps(i, cls=DecimalEncoder))

            while 'LastEvaluatedKey' in response:
                if fe != "":
                    response = table.scan(
                        ProjectionExpression=pe,
                        FilterExpression=fe,
                        ExpressionAttributeNames=ean,
                        ExpressionAttributeValues=eav,
                        ExclusiveStartKey=response['LastEvaluatedKey']
                    )
                else:
                    response = table.scan(
                        ProjectionExpression=pe,
                        ExpressionAttributeNames=ean,
                        ExclusiveStartKey=response['LastEvaluatedKey']
                    )

                for i in response['Items']:
                    lst.append(i)

            newlist = []

            for item in lst:
                resultdict.clear()
                rdict = getKeys(item)
                newlist.append(rdict.copy())
            print(newlist)

            resultlst = []
            for item in newlist:
                rdict = {}
                for key, value in item.items():
                    p = fieldaliasdict[key]
                    # print(p)
                    flag = isinstance(value, bool)
                    if flag and value == True:
                        value = 1
                    elif flag and value == False:
                        value = 0
                    rdict[p] = value
                    # print(rdict)
                resultlst.append(rdict.copy())

            result = json.dumps(resultlst, cls=DecimalEncoder)
            print(json.loads(result))
        except Error as e:
            print(e)
    except Error as e:
        print(e)
    return result


resultdict = {}


def getKeys(val, old=""):
    if isinstance(val, dict):
        for k in val.keys():
            getKeys(val[k], old + "." + str(k))
    elif isinstance(val, list):
        for i, k in enumerate(val):
            getKeys(k, old + "." + str(i))
    else:
        # print("{} : {}".format(old, str(val)))
        print(old[1:])
        # dict1 = {}
        resultdict[old[1:]] = val
        # fldlst.append(dict1)
    # print(resultdict)
    return resultdict


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            # if o % 1 > 0:
            return float(o)
        # else:
        #     return int(o)
        return super(DecimalEncoder, self).default(o)


def get_function_by_object_and_user_id(user_id, object_id):
    function_name = None
    try:
        conn = create_connection()
        cur = conn.cursor()
        query = f"SELECT FunctionName FROM ADX_User_Functions WHERE UserId='{user_id}' and DomainObjectId = '{object_id}'"
        cur.execute(query)
        result = cur.fetchone()
        if result is not None:
            function_name = list(result)[0]
        conn.close()
    except Error as e:
        print(e)
    return function_name


def get_function_name(user_key, object_name):
    user_id = is_valid_user_by_user_key(user_key)
    object_id = get_object_id_by_name(object_name)
    function_name = get_function_by_object_and_user_id(user_id, object_id)
    return function_name


import numpy as np


class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)


def get_data_from_adls(user_key, function_name, filter_data):
    user_id = json.loads(business_object_repo.get_userdetails_by_user_key(user_key))[0]["UserId"]
    object_id = json.loads(business_object_repo.get_user_functions_by_userid_and_func_name(user_id, function_name))[0][
        "DomainObjectId"]
    query_json = dynamic_query_utility.get_kusto_query_json_for_user_object(user_id, object_id)
    domain_object_detail_obj = json.loads(business_object_repo.get_business_object_data_by_id(object_id))
    object_access_level = domain_object_detail_obj[0]["AccessLevel"]
    dynamic_query = dynamic_query_utility.create_kusto_query(query_json, object_access_level,
                                                             object_id, user_id, function_name, filter_data)
    adx_util.execute_kusto_query(dynamic_query)
    print("Started>>", datetime.datetime.now())
    result_data_frame = adx_util.execute_kusto_query(function_name)
    print(result_data_frame)
    print("End>>", datetime.datetime.now())
    df_dict = result_data_frame.to_json(orient='records')
    return df_dict
