"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
import boto3
import json
from boto3.dynamodb.types import TypeSerializer as tes
import decimal

from app.config import connection_config
import pandas as pd
db_name = "Default Database"

def create_connection(host_name):
    client = boto3.client('dynamodb', endpoint_url=host_name)
    return client

def create_resource(host_name):
    dynamodb = boto3.resource('dynamodb', endpoint_url=host_name)
    return dynamodb

def list_databases():
    db_list = []
    try:
        db_list.append(db_name)
        print(db_list)
        return db_list
    except:
        print("Something went wrong")
        return db_list

#table list from dynamodb
def list_tables(host_name):
    dt_list = []
    try:
        client = create_connection(host_name)
        item_list = client.list_tables()
        print("dt_list")
        print(item_list)
        for item in item_list["TableNames"]:
            dt_list.append(item)
        return dt_list
    except:
        print("Something went wrong")
        return dt_list


def obj_dict(obj):
    return obj.__dict__


class Object:
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)


def list_tables_fields(host_name, table_list):
    table_field_obj = Object()
    table_field_obj.data = []

    try:
        table_list = json.loads(table_list)
        for table in table_list:
            tf_obj = Object()
            tf_obj.TableName = str(table).strip()
            tf_obj.AliasName = ""
            tf_obj.Fields = []
            dynamodb = create_resource(host_name)
            table = dynamodb.Table(table)
            response = table.scan()
            response = response['Items'][0]
            lst=[]
            lstdict = getKeys(response)
            print(lstdict)
            newclass = tes()

            for key1, value1 in lstdict.items():
                dict1 = {}
                newtype = tes.serialize(newclass, value1)
                dict1['fieldname'] = key1
                dict1['fieldtype'] = list(newtype.keys())[0]
                lst.append(dict1)

            field_list = lst
            resultdict.clear()
            fldtype = ""
            for field in field_list:
                if (str(field['fieldtype'])) == "NULL":
                    fldtype = "S"
                else:
                    fldtype = str(field['fieldtype'])
                tf_obj.Fields.append(Fields(str(field['fieldname']), fldtype, False, "", "", "", ""))
            table_field_obj.data.append(tf_obj)

        return json.dumps(table_field_obj, default=obj_dict)
    except Exception as e:
        print(e)
        return table_field_obj

# fldlst = []
# def getKeys(val, old=""):
#     print("abc")
#     if isinstance(val, dict):
#         for k in val.keys():
#             getKeys(val[k], old + "." + str(k))
#     elif isinstance(val, list):
#         for i, k in enumerate(val):
#             getKeys(k, old + "." + str(i))
#     else:
#         #print("{} : {}".format(old, str(val)))
#         #print(old[1:])
#         newclass1 = tes()
#         fieldvalue = old[1:]
#         dtype = tes.serialize(newclass1, val)
#         print(list(dtype.keys())[0])
#         dict1 = {}
#         dict1['fieldname'] = fieldvalue
#         dict1['fieldtype'] = list(dtype.keys())[0]
#         fldlst.append(dict1)
#     print("??????????????????????")
#
#     return fldlst

class Fields:
    def __init__(self, name, type, selected, alias_name, mask, accesslevel, access_controlled):
        self.FieldName = name
        self.DataType = type
        self.IsSelected = selected
        self.AliasName = alias_name
        self.Mask = mask
        self.AccessLevel = accesslevel
        self.AccessControlled = access_controlled

def get_field_values(tb_name, field_name, domain_object_id):
    dt_list = []
    con_dtl = connection_config(domain_object_id)
    con_dtl.connect_db()
    try:
        dynamodb = boto3.resource('dynamodb', endpoint_url=con_dtl.dbhost)
        tblname = tb_name

        table = dynamodb.Table(tblname)
        pe = field_name
        print(tblname)
        print(pe)
        # response = table.scan()
        # response = response['Items']
        # print(response)
        ean = get_nameMapDict(field_name)
        pe = get_projectionExpression(field_name, nameMapDictionary=ean)
        print(pe)
        print(ean)
        resp = table.scan(ProjectionExpression=pe, ExpressionAttributeNames=ean,)
        resp = resp['Items']
        print(resp)

        for i in resp:
            rdict = getKeys(i)
            for a in rdict.values():
                if not str(a) in dt_list:
                    dt_list.append(str(a))
            resultdict.clear()
        print(dt_list)
        return dt_list
    except Exception as e:
        print(e)

def get_nameMapDict(fieldname):
    nameMapDictionary = {}
    count = 0
    x = fieldname.split(".")
    dict_len = len(nameMapDictionary)
    for count, field in enumerate(x):
        #print(x[count])
        dict_len = len(nameMapDictionary)
        key = "#k" + str(dict_len + 1)
        #print(key)
        if not x[count] in nameMapDictionary.values():
            nameMapDictionary[key] = x[count]
    return nameMapDictionary


def get_projectionExpression(fieldname,nameMapDictionary):
    pelist = []

    x = fieldname.split(".")
    for count, field in enumerate(x):
        p = list(nameMapDictionary.keys())[list(nameMapDictionary.values()).index(x[count])]
        #print(p)
        pelist.append(p)
    pe = ".".join(pelist)
    return pe


resultdict = {}
def getKeys(val, old=""):
    if isinstance(val, dict):
        for k in val.keys():
            getKeys(val[k], old + "." + str(k))
    elif isinstance(val, list):
        for i, k in enumerate(val):
            getKeys(k, old + "." + str(i))
    else:
        resultdict[old[1:]] = val
    return resultdict

