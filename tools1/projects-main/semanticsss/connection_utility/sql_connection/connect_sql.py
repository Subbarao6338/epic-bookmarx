"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
import json

import pyodbc

from app.config import connection_config
import pandas as pd


def get_db_connection(host_name, user_id, password):
    conn = pyodbc.connect(Driver='ODBC Driver 17 for SQL Server', Server=host_name, UID=user_id, PWD=password)
    cur = conn.cursor()
    return cur


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


def list_databases(host_name, user_id, password):
    db_list = []
    try:
        cur = get_db_connection(host_name, user_id, password)
        cur.execute("SELECT [Name] FROM sys.databases")
        result = cur.fetchall()
        db_list = list_conversion(result)
        cur.close()
        return db_list
    except:
        print("Something went wrong")
        return db_list


def list_tables(host_name, user_id, password, database_name):
    dt_list = []
    try:
        conn = get_connection(host_name, user_id, password, database_name)
        cur = conn.cursor()
        cur.execute(
            "select TABLE_NAME from [" + database_name + "].INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
        result = cur.fetchall()
        dt_list = list_conversion(result)
        cur.close()
        print(dt_list)
        return dt_list
    except:
        print("Something went wrong")
        return dt_list


class Fields:
    def __init__(self, name, type, selected, alias_name, mask, accesslevel, access_controlled):
        self.FieldName = name
        self.DataType = type
        self.IsSelected = selected
        self.AliasName = alias_name
        self.Mask = mask
        self.AccessLevel = accesslevel
        self.AccessControlled = access_controlled


def obj_dict(obj):
    return obj.__dict__


class Object:
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)


def list_fields(host_name, user_id, password, database_name, table_name):
    tf_obj = Object()
    try:
        conn = get_connection(host_name, user_id, password, database_name)
        cur = conn.cursor()
        cur.execute(
            "select COLUMN_NAME,DATA_TYPE from [" + database_name + "].INFORMATION_SCHEMA.COLUMNS WHERE TABLE_CATALOG = '" + database_name + "' AND TABLE_NAME = '" + table_name + "'")
        result = cur.fetchall()
        field_list = list_conversion(result)
        tf_obj.data = []
        for field in field_list:
            col_desc = field.split("|")
            tf_obj.data.append(Fields(str(col_desc[0]).strip(), str(col_desc[1]).strip(), False, "", "", "", ""))
        return json.dumps(tf_obj, default=obj_dict)
    except:
        print("Something went wrong")
        return tf_obj


def list_tables_fields(host_name, user_id, password, db_name, table_list):
    table_field_obj = Object()
    table_field_obj.data = []
    try:
        table_list = json.loads(table_list)
        for table in table_list:
            tf_obj = Object()
            tf_obj.TableName = str(table).strip()
            tf_obj.AliasName = ""
            tf_obj.Fields = []
            conn = get_connection(host_name, user_id, password, db_name)
            cur = conn.cursor()
            cur.execute(
                "select COLUMN_NAME,DATA_TYPE from [" + db_name + "].INFORMATION_SCHEMA.COLUMNS WHERE TABLE_CATALOG = '" + db_name + "' AND TABLE_NAME = '" + table + "'")
            result = cur.fetchall()
            print(result)
            field_list = list_conversion(result)
            print(field_list)
            for field in field_list:
                col_desc = field.split("|")
                tf_obj.Fields.append(Fields(str(col_desc[0]).strip(), str(col_desc[1]).strip(), False, "", "", "", ""))
            table_field_obj.data.append(tf_obj)
            print(table_field_obj)
            print(json.dumps(table_field_obj, default=obj_dict))
        return json.dumps(table_field_obj, default=obj_dict)
    except:
        print("Something went wrong")
        return table_field_obj


def create_table_for_business_object(host_name, user_id, password, database_name, sql_query):
    try:
        conn = get_connection(host_name, user_id, password, database_name)
        cur = conn.cursor()
        cur.execute(sql_query)
        conn.commit()
        cur.close()
        return True
    except:
        print("Something went wrong")
        return False


def delete_table_obj_if_exists(host_name, user_id, password, database_name, sql_query):
    print("Delete Query >>>" + sql_query)
    try:
        conn = get_connection(host_name, user_id, password, database_name)
        cur = conn.cursor()
        cur.execute(sql_query)
        conn.commit()
        cur.close()
        return True
    except:
        print("Something went wrong")
        return False


def execute_alter_query(host_name, user_id, password, database_name, sql_query):
    try:
        conn = get_connection(host_name, user_id, password, database_name)
        cur = conn.cursor()
        cur.execute(sql_query)
        conn.commit()
        cur.close()
        return True
    except:
        print("Something went wrong")
        return False


def execute_ins_upd_del_query(host_name, user_id, password, database_name, sql_query):
    conn = get_connection(host_name, user_id, password, database_name)
    cur = conn.cursor()
    cur.execute(sql_query)
    conn.commit()
    cur.close()
    return True


def execute_select_query(host, user_id, password, database_name, query):
    result = []
    conn = get_connection(host, user_id, password, database_name)
    df = pd.read_sql(query, conn)
    print(df)
    header_row = []
    for column in df.columns:
        header_row.append(column)
    result.append(header_row)
    for value in df.values.tolist():
        result.append(value)
    return result


def list_db_user(host, user_id, password, database_name):
    conn = get_connection(host, user_id, password, database_name)
    cur = conn.cursor()
    sql_query = "select name as username from sys.database_principals where type not in ('A', 'G', 'R', 'X') and sid is not null and name not in ('guest','dbo') UNION ALL select 'sa' as username order by username"
    cur.execute(sql_query)
    result = cur.fetchall()
    user_list = list_conversion(result)
    return user_list


def grant_col_permission(username, domain_obj_name, field_list):
    print(field_list)
    host_name = connection_config.host_name
    database_name = connection_config.database_name
    password = connection_config.password
    user_id = connection_config.user_id
    conn = get_connection(host_name, user_id, password, database_name)
    cursor = conn.cursor()
    #fields = '],['.join(field_list)
    #print(fields)
    print('Grant select on [' + domain_obj_name + '](' + field_list + ') to ' + username)
    cursor.execute('Grant select on [' + domain_obj_name + '](' + field_list + ') to ' + username)
    conn.commit()
    return True


def deny_col_permission(username, domain_obj_name, field_list):
    print(field_list)
    host_name = connection_config.host_name
    database_name = connection_config.database_name
    password = connection_config.password
    user_id = connection_config.user_id
    conn = get_connection(host_name, user_id, password, database_name)
    cursor = conn.cursor()
    #fields = '],['.join(field_list)
    #print(fields)
    print('Deny select on ' + domain_obj_name + ' (' + field_list + ') to ' + username)
    cursor.execute('Deny select on [' + domain_obj_name + '](' + field_list + ') to ' + username)
    conn.commit()
    return True


def execute_row_sec(username, domain_obj_name, field_name,filter_value):
    host_name = connection_config.host_name
    database_name = connection_config.database_name
    password = connection_config.password
    user_id = connection_config.user_id
    conn = get_connection(host_name, user_id, password, database_name)
    cursor = conn.cursor()
    print("Insert into User_Filters(UserId,TableName,FilterValue,FieldName) values ('" + username + "','" + domain_obj_name + "','" + filter_value + "','" + field_name + "')")
    cursor.execute("Insert into User_Filters(UserId,TableName,FilterValue,FieldName) values ('"+username+"','"+domain_obj_name+"','"+filter_value+"','"+field_name+"')")
    cursor.commit()
    return True


def get_field_values(tb_name, field_name, domain_object_id):
    con_dtl = connection_config(domain_object_id)
    con_dtl.connect_db()
    host_name = con_dtl.host_name
    database_name = con_dtl.database_name
    password = con_dtl.password
    user_id = con_dtl.user_id
    conn = get_connection(host_name, user_id, password, database_name)
    cursor = conn.cursor()
    cursor.execute("Select distinct(CONVERT(NVARCHAR(max), ["+field_name+"])) from ["+tb_name+"]")
    result = cursor.fetchall()
    result_a = list_conversion(result)
    print(result_a)
    return result_a


# print(list_database("LP-5CD9174BCZ", "sa", "India@123"))
# print(list_tables("LP-5CD9174BCZ", "sa", "India@123","NW_DB"))
# print(list_fields("LP-5CD9174BCZ", "sa", "India@123","NW_DB", "Orders"))
# print(list_tables_fields("LP-5CD9174BCZ", "sa", "India@123","NW_DB", """["Categories","Products"]"""))
# print(create_table_for_business_object("LP-5CD9174BCZ", "sa", "India@123","NW_DB","USE NW_DB"))
# print(delete_table_obj_if_exists("LP-5CD9174BCZ\SQLEXPRESS", "sa", "India@123","NW_DB","DROP VIEW IF EXISTS [Invoices_test]"))
# print(create_table_for_business_object("LP-5CD9174BCZ\SQLEXPRESS", "sa", "India@123","NW_DB","CREATE VIEW [Product wise Order Quantity Details] AS select [Products].[ProductID ] as [Product ID],[Products].[ProductName ] as [Product Name],[Order Details].[OrderID ] as [Order ID],[Order Details].[ProductID ] as [Order Product ID],[Order Details].[Quantity ] as [Order Quantity] from [Products]Inner Join [Order Details] on [Products].[ProductID ]=[Order Details].[ProductID ]"))
# print(list_db_user("LP-5CD9174BCZ", "sa", "India@123", "NW_DB"))
# print(grant_col_permission("test", "[Product wise Order Quantity Details]", ['Product Id','Product Name']))