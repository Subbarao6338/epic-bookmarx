"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
import json

from pyhive import hive


def get_connection(host_name, port, user_name):
    conn = hive.Connection(host=host_name, port=port, auth="NOSASL", username=user_name)
    cur = conn.cursor()
    return cur


def list_conversion(data):
    list_item = []
    for item_str in data:
        list_item.append(" | ".join(item_str))
    return list_item


def list_databases(host_name, port, user_name):
    db_list = []
    try:
        cur = get_connection(host_name, port, user_name)
        cur.execute("show databases")
        result = cur.fetchall()
        db_list = list_conversion(result)
        cur.close()
        return db_list
    except:
        print("Something went wrong")
        return db_list


def list_tables(host_name, port, user_name, database_name):
    dt_list = []
    try:
        cur = get_connection(host_name, port, user_name)
        cur.execute("show tables from " + database_name)
        result = cur.fetchall()
        dt_list = list_conversion(result)
        cur.close()
        return dt_list
    except:
        print("Something went wrong")
        return dt_list


class Fields:
    def __init__(self, name, type, selected, alias_name, mask):
        self.FieldName = name
        self.DataType = type
        self.IsSelected = selected
        self.AliasName = alias_name
        self.Mask = mask


def list_fields(host_name, port, user_name, database_name, table_name):
    tf_obj = Object()
    try:
        cur = get_connection(host_name, port, user_name)
        cur.execute("Describe " + database_name + "." + table_name)
        result = cur.fetchall()
        field_list = list_conversion(result)
        tf_obj.data = []
        for field in field_list:
            col_desc = field.split("|")
            tf_obj.data.append(Fields(col_desc[0], col_desc[1], False, "", ""))
        return json.dumps(tf_obj, default=obj_dict)
    except:
        print("Something went wrong")
        return tf_obj


def obj_dict(obj):
    return obj.__dict__


class Object:
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)


def list_tables_fields(host_name, port, user_name, db_name, table_list):
    table_field_obj = Object()
    table_field_obj.data = []
    try:
        table_list = json.loads(table_list)
        for table in table_list:
            tf_obj = Object()
            tf_obj.TableName = table
            tf_obj.AliasName = ""
            tf_obj.Fields = []
            cur = get_connection(host_name, port, user_name)
            cur.execute("Describe " + db_name + "." + table)
            result = cur.fetchall()
            field_list = list_conversion(result)
            for field in field_list:
                col_desc = field.split("|")
                tf_obj.Fields.append(Fields(col_desc[0], col_desc[1], False, "", ""))
            table_field_obj.data.append(tf_obj)
        return json.dumps(table_field_obj, default=obj_dict)
    except:
        print("Something went wrong")
        return table_field_obj


def create_table_for_business_object(host_name, port, user_name, sql_query):
    try:
        cur = get_connection(host_name, port, user_name)
        cur.execute(sql_query)
        cur.close()
        return True
    except:
        print("Something went wrong")
        return False


def delete_table_obj_if_exists(host_name, port, user_name, sql_query):
    try:
        cur = get_connection(host_name, port, user_name)
        cur.execute(sql_query)
        cur.close()
        return True
    except:
        print("Something went wrong")
        return False


def execute_ins_upd_del_query(host_name, port, user_name, sql_query):
    try:
        cur = get_connection(host_name, port, user_name)
        cur.execute(sql_query)
        cur.close()
        return True
    except:
        print("Something went wrong")
        return False


def execute_select_query(host, port, uname, query):
    try:
        cur = get_connection(host, port, uname)
        cur.execute(query)
        result = cur.fetchall()
        print(result)
        return json.dumps(result)
    except Exception as e:
        print("Something went wrong")