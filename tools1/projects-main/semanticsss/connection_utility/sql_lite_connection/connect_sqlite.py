"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
import json
import os
import sqlite3
from sqlite3 import Error
from unipath import Path
from app.config import connection_config


# db_file = "C://sqlite//SemanticLayer.db"


def create_connection(db_name):
    conn = None
    try:
        conn = sqlite3.connect(db_name)
    except Error as e:
        print(e)

    return conn


def execute_query(dbname, sql, args):
    try:
        print(dbname)
        conn = create_connection(dbname)
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


def list_databases(host_name, password):
    db_list = []
    try:
        db_list.append(host_name)
        print(db_list)
        return db_list
    except:
        print("Something went wrong")
        return db_list


def list_tables(db_name):
    dt_list = []
    try:
        sql = """SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%'"""
        jsresult = execute_query(db_name, sql, args='')
        jsresult = json.loads(jsresult)
        print(jsresult)
        for x in jsresult:
            dt_list.append(x["name"])
        return dt_list
    except Error as e:
        print(e)


def obj_dict(obj):
    return obj.__dict__


class Object:
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)


class Fields:
    def __init__(self, name, type, selected, alias_name, mask, accesslevel, access_controlled):
        self.FieldName = name
        self.DataType = type
        self.IsSelected = selected
        self.AliasName = alias_name
        self.Mask = mask
        self.AccessLevel = accesslevel
        self.AccessControlled = access_controlled


def list_tables_fields(db_name, table_list):
    table_field_obj = Object()
    table_field_obj.data = []
    try:
        table_list = json.loads(table_list)
        for table in table_list:
            tf_obj = Object()
            tf_obj.TableName = str(table).strip()
            tf_obj.AliasName = ""
            tf_obj.Fields = []

            sql = """SELECT p.name as ColumnName ,p.type as DataType FROM sqlite_master m left outer join pragma_table_info((m.name)) p on m.name <> p.name where m.name='""" + table + """';"""
            jsresult = execute_query(db_name, sql, args='')
            print(jsresult)
            jsresult = json.loads(jsresult)
            field_list = jsresult
            for field in field_list:
                tf_obj.Fields.append(
                    Fields(str(field["ColumnName"]).strip(), str(field["DataType"]).strip(), False, "", "", "", ""))
            table_field_obj.data.append(tf_obj)
        return json.dumps(table_field_obj, default=obj_dict)
    except:
        print("Something went wrong")
        return table_field_obj


def get_field_values(tb_name, field_name, domain_object_id):
    dt_list = []
    con_dtl = connection_config(domain_object_id)
    con_dtl.connect_db()
    db_file = con_dtl.db_file

    if db_file != "":
        sql = """select Distinct(cast([""" + field_name + """] as text)) as Value from [""" + tb_name + """]"""
        jsresult = execute_query(db_file, sql, args='')
        print(jsresult)
        jsresult = json.loads(jsresult)
        for x in jsresult:
            dt_list.append(x["Value"])
    return dt_list
