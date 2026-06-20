"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
import base64
import hashlib
import hmac
import json
import os
import sqlite3
from sqlite3 import Error
from typing import Tuple

from unipath import Path

# db_file = "C://sqlite//SemanticLayer.db"
BASE_DIR = PROJECT_DIR = Path(__file__).parent
db_file = os.path.join(BASE_DIR, 'SemanticLayer.db')


def create_connection():
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


def execute_query(sql, args):
    try:
        conn = create_connection()
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        if args == "":
            cur.execute(sql)
        else:
            cur.execute(sql, (args,))
        result = cur.fetchall()
        conn.commit()
        conn.close()
        return json.dumps([dict(ix) for ix in result])
    except Error as e:
        print(e)


def execute_delete_query(sql):
    try:
        conn = create_connection()
        cur = conn.cursor()
        cur.execute(sql)
        conn.commit()
        conn.close()
        return True
    except Error as e:
        print(e)


def execute_sql(sql, obj_data):
    try:
        conn = create_connection()
        cur = conn.cursor()
        cur.execute(sql, obj_data)
        conn.commit()
        object_id = cur.lastrowid
        conn.close()
        return object_id
    except Error as e:
        print(e)


def insert_business_object(business_obj):
    try:
        sql = """Insert into BusinessObjectDetails(BusinessObjectName, DatabaseName, HostName, Port, UserName, AccessLevel,ProviderName, StorageName, StorageAccessKey) VALUES(?,?,?,?,?,?,?,?,?)"""
        object_id = execute_sql(sql, business_obj)
        return object_id
    except Error as e:
        print(e)


def update_business_object(business_obj):
    try:
        sql = """Update BusinessObjectDetails set BusinessObjectName = ?, DatabaseName = ?, HostName = ?, Port = ?, AccessLevel = ?  where DetailId = ?"""
        execute_sql(sql, business_obj)
        return True
    except Error as e:
        print(e)


def insert_tables_data(table_obj):
    try:
        sql = """Insert into TableDetails(DetailId, TableName, AliasName, Mask)VALUES(?,?,?,?)"""
        table_id = execute_sql(sql, table_obj)
        return table_id
    except Error as e:
        print(e)


def delete_table_data(object_id):
    try:
        sql = """Delete from TableDetails where DetailId=""" + str(object_id)
        execute_delete_query(sql)
        return True
    except Error as e:
        print(e)


def insert_field_data(field_object):
    try:
        sql = """Insert into FieldDetails(TableId, FieldName, DataType, AliasName, Mask, AccessLevel, AccessControlled)VALUES(?,?,?,?,?,?,?)"""
        execute_sql(sql, field_object)
        return True
    except Error as e:
        print(e)


def insert_join_data(join_obj):
    try:
        sql = """Insert into JoinDetails(DetailId, Table1Name, Table2Name, JoinType, Table1Field, Table2Field, Condition)VALUES(?,?,?,?,?,?,?)"""
        execute_sql(sql, join_obj)
        return True
    except Error as e:
        print(e)


def insert_where_data(join_obj):
    try:
        sql = """Insert into WhereClauseDetails(DetailId, TableName, FieldName, Condition, CompareValue)VALUES(?,?,?,?,?)"""
        execute_sql(sql, join_obj)
        return True
    except Error as e:
        print(e)


def get_business_object_list():
    try:
        sql = """select * from BusinessObjectDetails"""
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)


def get_business_object_data_by_id(object_id):
    try:
        sql = """select * from BusinessObjectDetails where DetailId = ?"""
        result_data = execute_query(sql, args=object_id)
        return result_data
    except Error as e:
        print(e)


def get_business_object_data_for_user_by_id(object_id, user_id):
    try:
        sql = """select * from BusinessObjectDetails where DetailId = ?"""
        result_data = execute_query(sql, args=object_id)
        return result_data
    except Error as e:
        print(e)


def get_user_access_level_on_object(object_id, user_id):
    try:
        sql = """select IFNULL(AccessLevel, '') as AccessLevel from Object_Permission where IsAllowed = 1 and 
        DetailId = """ + str(object_id) + """ and UserId = """ + str(user_id)
        result_data = execute_query(sql, args="")
        return result_data
    except Error as e:
        print(e)


def get_tables_data_by_detail_id(object_id):
    try:
        sql = """select * from TableDetails where DetailId = ?"""
        result_data = execute_query(sql, args=object_id)
        return result_data
    except Error as e:
        print(e)


def get_tables_data_for_user_by_detail_id(object_id, user_id):
    try:
        sql = """select * from TableDetails where DetailId = ?"""
        result_data = execute_query(sql, args=object_id)
        return result_data
    except Error as e:
        print(e)


def get_fields_data_by_table_id(table_id):
    try:
        sql = """select * from FieldDetails where TableId = ?"""
        result_data = execute_query(sql, args=table_id)
        return result_data
    except Error as e:
        print(e)


def get_join_data_by_detail_id(object_id):
    try:
        sql = """select * from JoinDetails where DetailId = ?"""
        result_data = execute_query(sql, args=object_id)
        return result_data
    except Error as e:
        print(e)


def delete_join_data(object_id):
    try:
        sql = """Delete from JoinDetails where DetailId=""" + str(object_id)
        execute_delete_query(sql)
        return True
    except Error as e:
        print(e)


def get_business_objectlist():
    try:
        sql = """select * from BusinessObjectDetails"""
        conn = create_connection()
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute(sql)
        result = cur.fetchall()
        conn.commit()
        conn.close()
        return result
    except Error as e:
        print(e)


def get_bo_field_list(object_id):
    try:
        sql = """Select FieldDetails.FieldId,FieldDetails.FieldName,FieldDetails.DataType,FieldDetails.AliasName,
        FieldDetails.Mask,FieldDetails.AccessLevel,FieldDetails.AccessControlled,TableDetails.TableId,
        TableDetails.TableName,BusinessObjectDetails.ProviderName from BusinessObjectDetails Join TableDetails on BusinessObjectDetails.DetailId=TableDetails.DetailId Join 
        FieldDetails on FieldDetails.TableId=TableDetails.TableId where BusinessObjectDetails.DetailId = ? """
        result_data = execute_query(sql, args=object_id)
        return result_data
    except Error as e:
        print(e)


def get_fields_by_object_id(detail_id):
    try:
        sql = """select fd.*,td.TableName from FieldDetails fd JOIN TableDetails td ON fd.TableId = td.TableId where td.DetailId = ?"""
        result_data = execute_query(sql, args=detail_id)
        return result_data
    except Error as e:
        print(e)


def get_fields_for_user_by_object_id(detail_id, user_id):
    try:
        args = (user_id, user_id, detail_id, user_id)
        # print(detail_id, user_id)
        # sql = """select fd.*,td.TableName from FieldDetails fd JOIN TableDetails td ON fd.TableId = td.TableId JOIN
        # Column_Permission cp ON cp.FieldId = fd.FieldId where cp.IsAllowed =1 AND td.DetailId = {detail_id} AND
        # cp.UserId = {user_id}""".format(detail_id=detail_id,user_id=user_id)
        # sql = "SELECT fd.*, fd.AccessLevel as FieldAccessLevel,ob.AccessLevel as " \
        #       "UserAccessLevel, td.TableName FROM FieldDetails fd INNER JOIN " \
        #       "TableDetails td ON fd.TableId = td.TableId INNER JOIN BusinessObjectDetails bod ON " \
        #       "bod.DetailId = td.DetailId INNER JOIN Object_Permission ob ON bod.DetailId = ob.DetailId " \
        #       "LEFT OUTER JOIN Column_Permission cp on fd.FieldId = cp.FieldId WHERE ob.UserId = ? AND " \
        #       "bod.BusinessObjectName = (SELECT BusinessObjectDetails.BusinessObjectName FROM BusinessObjectDetails " \
        #       "WHERE DetailId = ?) AND ((ob.AccessLevel IN ('Public','Protected') AND fd.AccessLevel " \
        #       "IN('Public','Protected')) OR (ob.AccessLevel = 'Private') OR (cp.IsAllowed=1)) "
        sql = "SELECT fd.*, fd.AccessLevel as FieldAccessLevel,IFNULL(ob.AccessLevel,fd.AccessLevel) as " \
              "UserAccessLevel, td.TableName FROM FieldDetails fd INNER JOIN TableDetails td ON fd.TableId = " \
              "td.TableId INNER JOIN BusinessObjectDetails bod ON bod.DetailId = td.DetailId LEFT OUTER JOIN " \
              "Object_Permission ob ON bod.DetailId = ob.DetailId AND ob.UserId=? LEFT OUTER JOIN Column_Permission cp on fd.FieldId " \
              "= cp.FieldId AND cp.UserId=? WHERE bod.DetailId = ? AND ((ob.AccessLevel IS NULL AND fd.AccessLevel in('Public')) OR (" \
              "ob.AccessLevel IS NOT NULL AND ob.UserId = ?)) AND ((ob.AccessLevel IN ('Public') AND " \
              "fd.AccessLevel IN('Public','Protected')) OR (ob.AccessLevel IN('Private','Protected')) OR (cp.IsAllowed=1)OR (" \
              "ob.AccessLevel IS NULL )) "
        conn = create_connection()
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute(sql, args)
        result = cur.fetchall()
        print(result)
        conn.commit()
        conn.close()
        return json.dumps([dict(ix) for ix in result])
    except Error as e:
        print(e)


def get_joins_by_detail_id(detail_id):
    try:
        sql = """select * from JoinDetails where DetailId = ?"""
        result_data = execute_query(sql, args=detail_id)
        return result_data
    except Error as e:
        print(e)


def get_where_clauses_by_detail_id(detail_id):
    try:
        sql = """select * from WhereClauseDetails where DetailId = ?"""
        result_data = execute_query(sql, args=detail_id)
        return result_data
    except Error as e:
        print(e)


def get_where_clauses_by_detail_id_and_table_name(detail_id, table_name):
    try:
        sql = f"""select * from WhereClauseDetails where DetailId = {detail_id} and TableName = '{str(table_name)}'"""
        result_data = execute_query(sql, args="")
        return result_data
    except Error as e:
        print(e)


def get_user_list():
    try:
        sql = """select * from Users"""
        conn = create_connection()
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute(sql)
        result = cur.fetchall()
        conn.commit()
        conn.close()
        return result

    except Error as e:
        print(e)


def execute_sql_get_selcount(sql, obj):
    try:
        conn = create_connection()
        cur = conn.cursor()
        cur.execute(sql, obj)
        result = cur.fetchone()
        conn.close()
        return result[0]
    except Error as e:
        print(e)


def delete_obj_level_permission(userid, detailid):
    try:
        sql = """Delete from Object_Permission where UserId=""" + str(userid) + """ and DetailId=""" + str(detailid)
        execute_delete_query(sql)
        return True
    except Error as e:
        print(e)


def insert_obj_level_permission(permission_obj):
    try:
        sql = """INSERT INTO Object_Permission (UserId,DetailId,IsAllowed,AccessLevel) VALUES (?,?,?,?)"""
        object_id = execute_sql(sql, permission_obj)
        return object_id
    except Error as e:
        print(e)


def delete_col_level_permission(userid, fieldid):
    try:
        sql = """Delete from Column_Permission where UserId=""" + str(userid) + """ and FieldId=""" + str(fieldid)
        execute_delete_query(sql)
        return True
    except Error as e:
        print(e)


def insert_col_level_permission(col_permission_obj):
    try:
        insert_obj = (col_permission_obj[0], col_permission_obj[1], col_permission_obj[2])
        sql = """INSERT INTO Column_Permission (UserId,FieldId,IsAllowed) VALUES (?,?,?)"""
        execute_sql(sql, insert_obj)
        return True
    except Error as e:
        print(e)


def delete_row_level_permission(userid, fieldid):
    try:
        sql = """Delete from Row_Permission where UserId=""" + str(userid) + """ and FieldId=""" + str(fieldid)
        execute_delete_query(sql)
        return True
    except Error as e:
        print(e)


def insert_row_level_permission(row_permission_obj):
    try:
        insert_obj = (row_permission_obj[0], row_permission_obj[1], row_permission_obj[2], row_permission_obj[3])
        sql = """INSERT INTO Row_Permission (UserId,FieldId,FieldValue,IsAllowed) VALUES (?,?,?,?)"""
        execute_sql(sql, insert_obj)
        return True
    except Error as e:
        print(e)


def insert_user_management_object(business_obj):
    try:
        sql = """Insert into Users(UserName, EmailId, Password, IsActive, AccessLevel, UserKey) VALUES(?,?,?,?,?,?)"""
        object_id = execute_sql(sql, business_obj)
        return object_id
    except Error as e:
        print(e)


def update_user_management_object(business_obj):
    try:
        sql = """Update Users set UserName = ?, EmailId = ?, Password = ?, AccessLevel = ? where UserId = ?"""
        execute_sql(sql, business_obj)
        return True
    except Error as e:
        print(e)


def get_user_by_user_id(object_id):
    try:
        sql = """select * from Users where UserId = ?"""
        result_data = execute_query(sql, args=object_id)
        return result_data
    except Error as e:
        print(e)


def get_user_details_repo():
    try:
        sql = """select * from Users"""
        conn = create_connection()
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute(sql)
        result = cur.fetchall()
        list = []
        jsresult = json.dumps([dict(ix) for ix in result])
        jsresult = json.loads(jsresult)
        for x in jsresult:
            get_obj_count = get_object_count_userwise(x["UserId"])
            ob = json.loads(get_obj_count)
            x["ObjectCount"] = ob[0]["ObjectCount"]
            list.append(x)
        conn.commit()
        conn.close()
        return list
    except Error as e:
        print(e)


def update_user_status(sts_obj):
    try:
        sql = """Update Users set IsActive = ? where UserId = ? """
        execute_sql(sql, sts_obj)
        return True
    except Error as e:
        print(e)


def get_userdetails_by_userid(userid):
    try:
        sql = """select * from Users where UserId = ?"""
        result_data = execute_query(sql, args=userid)
        print(result_data)
        return result_data
    except Error as e:
        print(e)


def get_db_file_path():
    return db_file


def get_business_object_data_by_name(business_object_name):
    try:
        sql = """select BusinessObjectName from BusinessObjectDetails where BusinessObjectName = ?"""
        result_data = execute_query(sql, args=business_object_name)
        return result_data
    except Error as e:
        print(e)


def get_row_permission_for_user_by_detail_id(detail_id, user_id):
    try:
        sql = """SELECT td.TableName, fd.FieldName, rp.FieldValue FROM Row_Permission rp INNER JOIN FieldDetails fd ON 
        rp.FieldId = fd.FieldId INNER JOIN TableDetails td ON fd.TableId = td.TableId WHERE rp.IsAllowed = 1 AND 
        rp.UserId = {user_id} AND td.DetailId = {detail_id}""" \
            .format(user_id=user_id, detail_id=detail_id)
        result_data = execute_query(str(sql), args='')
        return result_data
    except Error as e:
        print(e)


def get_row_permission_for_user_by_detail_and_table_id(detail_id, user_id, table_id):
    try:
        sql = """SELECT td.TableName, fd.FieldName, rp.FieldValue FROM Row_Permission rp INNER JOIN FieldDetails fd ON 
        rp.FieldId = fd.FieldId INNER JOIN TableDetails td ON fd.TableId = td.TableId WHERE rp.IsAllowed = 1 AND 
        rp.UserId = {user_id} AND td.DetailId = {detail_id} AND td.TableId = {table_id}""" \
            .format(user_id=user_id, detail_id=detail_id, table_id=table_id)
        result_data = execute_query(str(sql), args='')
        return result_data
    except Error as e:
        print(e)


def insert_mask_status(obj):
    try:
        sql = """Delete from MaskingEncryptionDetails where UserId=""" + str(obj[0]) + """ and FieldId=""" + str(obj[1])
        res = execute_delete_query(sql)
        if res:
            sql = """INSERT INTO MaskingEncryptionDetails (UserId,FieldId,MaskEncryptStatus) VALUES (?,?,?)"""
            object_id = execute_sql(sql, obj)
            return object_id
        else:
            return 0
    except Error as e:
        print(e)


def get_obj_permission_details(userid, detailid):
    try:
        sql = """Select * from Object_Permission where DetailId = {detailid} AND UserId = {userid}""".format(
            detailid=detailid, userid=userid)
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)


def get_row_permission_field_details(userid, field_id):
    try:
        sql = """Select * from Row_Permission where UserId={userid} and FieldId = {field_id} and IsAllowed = 1""".format(
            userid=userid, field_id=field_id)
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)


def get_col_permission_field_details(userid, detailid):
    try:
        sql = """SELECT cp.FieldId FROM Column_Permission cp INNER JOIN FieldDetails fd ON cp.FieldId = fd.FieldId
         INNER JOIN TableDetails td ON fd.TableId = td.TableId INNER JOIN BusinessObjectDetails bo
         on td.DetailId=bo.DetailId WHERE cp.IsAllowed = 1 and cp.UserId={userid} and bo.DetailId={detailid}""" \
            .format(detailid=detailid, userid=userid)
        # sql = """SELECT fd.FieldId FROM FieldDetails fd INNER JOIN TableDetails td ON fd.TableId = td.TableId INNER
        # JOIN BusinessObjectDetails bod ON bod.DetailId = td.DetailId INNER JOIN Object_Permission ob ON
        # bod.DetailId = ob.DetailId LEFT OUTER JOIN Column_Permission cp on fd.FieldId = cp.FieldId WHERE
        # ob.UserId = {userid} AND bod.BusinessObjectName = (SELECT BusinessObjectDetails.BusinessObjectName FROM
        # BusinessObjectDetails WHERE DetailId = {detailid}) AND ((ob.AccessLevel IN ('Public','Protected') AND
        # fd.AccessLevel IN('Public','Protected')) OR (ob.AccessLevel = 'Private') OR (cp.IsAllowed=1))
        # """.format(userid=userid, detailid=detailid)
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)


def get_mask_encryption_details(userid, detailid):
    try:
        sql = """SELECT ms.UserId,ms.FieldId,ms.MaskEncryptStatus FROM MaskingEncryptionDetails ms INNER JOIN 
        FieldDetails fd ON ms.FieldId = fd.FieldId INNER JOIN TableDetails td ON fd.TableId = td.TableId
        INNER JOIN BusinessObjectDetails bo on td.DetailId=bo.DetailId WHERE ms.UserId={userid} and bo.DetailId={detailid}""" \
            .format(detailid=detailid, userid=userid)
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)


def get_domain_object_access_level(object_id):
    try:
        sql = "SELECT AccessLevel FROM BusinessObjectDetails WHERE DetailId = ?"
        result_data = execute_query(sql, args=object_id)
        return result_data[0]
    except Error as e:
        print(e)


def get_object_count_userwise(userid):
    try:
        sql = """SELECT Count(bod.DetailId) as ObjectCount FROM BusinessObjectDetails bod LEFT OUTER JOIN Object_Permission
         op ON bod.DetailId = op.DetailId WHERE (op.UserId = {userid} AND op.IsAllowed=1) OR bod.AccessLevel='Public'""" \
            .format(userid=userid)
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)


def get_domain_object_list_userwise(userid):
    try:
        sql = """SELECT bod.DetailId,bod.BusinessObjectName, IFNULL(op.AccessLevel, bod.AccessLevel) as AccessLevel FROM 
        BusinessObjectDetails bod LEFT OUTER JOIN Object_Permission op ON bod.DetailId = op.DetailId
        WHERE (op.UserId = {userid} AND op.IsAllowed=1) OR bod.AccessLevel='Public'""" \
            .format(userid=userid)
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)


def get_users_on_domain_object_by_detail_id(object_id):
    try:
        access_level = get_domain_object_access_level(object_id);
        sql = "SELECT usr.UserName, usr.EmailId, IFNULL(op.AccessLevel, 'Public') as AccessLevel FROM Users usr LEFT " \
              "OUTER JOIN Object_Permission op ON usr.UserId = op.UserId AND op.IsAllowed = 1 AND op.DetailId = ? " \
              "WHERE (" + access_level + "= 'Public') OR (op.DetailId " \
                                         "= ? AND " + access_level + " IN('Private','Protected')) "

        result_data = execute_query(sql, args=(object_id, object_id))
        return result_data
    except Error as e:
        print(e)


def get_db_connection_config(object_id):
    try:
        sql = "SELECT * FROM BusinessObjectDetails WHERE DetailId = ?"
        result_data = execute_query(sql, args=object_id)
        result_data = json.loads(result_data)
        return result_data
    except Error as e:
        print(e)


def get_super_user_data():
    try:
        sql = "SELECT * FROM SuperUser"
        result_data = execute_query(sql, args='')
        result_data = json.loads(result_data)
        return result_data
    except Error as e:
        print(e)


def is_correct_password(salt: bytes, pw_hash: bytes, password: str) -> bool:
    """
    Given a previously-stored salt and hash, and a password provided by a user
    trying to log in, check whether the password is correct.
    """
    return hmac.compare_digest(
        pw_hash,
        hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    )


def hash_new_password(password: str) -> Tuple[bytes, bytes]:
    """
    Hash the provided password with a randomly-generated salt and return the
    salt and hash to store in the database.
    """
    salt = os.urandom(16)
    pw_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return salt, pw_hash


def check_credentials(user_name, password):
    super_user_data = get_super_user_data()
    super_user_name = super_user_data[0]['user_name']
    str_salt_bytes = (super_user_data[0]['salt']).encode('utf-8')
    use_salt = base64.b64decode(str_salt_bytes)
    str_password_bytes = (super_user_data[0]['password']).encode('utf-8')
    use_password = base64.b64decode(str_password_bytes)
    if user_name == super_user_name and is_correct_password(use_salt, use_password, password):
        return 'Success'
    else:
        return 'Fail'


def update_super_user_credential(salt, pw_hash):
    try:
        sql = "Update SuperUser set salt = '" + salt + "' , password='" + pw_hash + "'"
        execute_sql(sql, "")
        return True
    except Error as e:
        print(e)


def change_password(old_password, new_password):
    super_user_data = get_super_user_data()
    str_password_bytes = (super_user_data[0]['password']).encode('utf-8')
    use_password = base64.b64decode(str_password_bytes)
    str_salt_bytes = (super_user_data[0]['salt']).encode('utf-8')
    use_salt = base64.b64decode(str_salt_bytes)
    if is_correct_password(use_salt, use_password, old_password):
        salt, pw_hash = hash_new_password(new_password)
        salt = base64.b64encode(salt).decode("utf-8")
        pw_hash = base64.b64encode(pw_hash).decode("utf-8")
        update_super_user_credential(salt, pw_hash)
        return 'Success'
    else:
        print("Change Password Failed")
        return 'Fail'


def insert_adx_function(user_id, object_id, function_name, dt_string):
    try:
        data = (user_id, object_id, function_name, dt_string)
        sql = """Insert into ADX_User_Functions(UserId,DomainObjectId,FunctionName,CreatedAt) VALUES(?,?,?,?)"""
        object_id = execute_sql(sql, data)
        return object_id
    except Error as e:
        print(e)


def get_adx_functions_by_user_and_object_id(user_id, object_id):
    try:
        sql = f"SELECT FunctionName FROM ADX_User_Functions WHERE DomainObjectId = '{object_id}' and UserId= '{user_id}'"
        result_data = execute_query(sql, args="")
        if len(json.loads(result_data)) > 0:
            return json.loads(result_data)[0]
        else:
            return None
    except Error as e:
        print(e)


def get_userdetails_by_user_key(userkey):
    try:
        sql = f"select * from Users where UserKey = '{userkey}'"
        result_data = execute_query(sql, args="")
        return result_data
    except Error as e:
        print(e)


def get_user_functions_by_userid_and_func_name(userid, function_name):
    try:
        sql = f"select * from ADX_User_Functions where UserId = '{userid}' and FunctionName = '{function_name}'"
        result_data = execute_query(sql, args="")
        return result_data
    except Error as e:
        print(e)