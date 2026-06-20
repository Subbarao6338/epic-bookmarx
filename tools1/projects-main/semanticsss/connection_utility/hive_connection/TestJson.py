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
from json import JSONEncoder
from pyhive import hive
import pandas as pd

def customTableDecoder(tableDict):
    return namedtuple('X', tableDict.keys())(*tableDict.values())

def parse_jsonDynamically(json_string):
    json_data = json.loads(json_string)
    table = json.loads(json_string, object_hook=customTableDecoder)
    print("After Converting JSON Data into Custom Python Object")
    print(table)
    return table

def create_select_query(tableobject):
    isWhereClause = getattr(tableobject, "WhereClause", None)
    if isWhereClause != None:
        wherecondition = (f"{tableobject.Table1.tablename}.{tableobject.WhereClause.wherecolumnname}{tableobject.WhereClause.whereconditionooperator}'{tableobject.WhereClause.value}'")
    isJoinClause= getattr(tableobject,"joinclause",None)
    isOrderByClause = getattr(tableobject,"orderbycol",None)
    isGroupByClause = getattr(tableobject, "groupbycol", None)

    sql = (f"SELECT {tableobject.selectedcolumns} "
           f"FROM {tableobject.DataBaseName}.{tableobject.Table1.tablename} ")
    sql = sql + (f"{tableobject.joinclause.JoinType} {tableobject.DataBaseName}.{tableobject.Table2.tablename} " if isJoinClause != None else '')
    sql = sql + (f"ON {tableobject.Table1.tablename}.{tableobject.joinclause.LeftColumn}  {tableobject.joinclause.OnConditionOperator}  {tableobject.Table2.tablename}.{tableobject.joinclause.RightColumn} " if isJoinClause != None else '')
    sql = sql + (f"WHERE {wherecondition} " if isWhereClause != None else '')
    sql = sql + (f"ORDER BY {tableobject.orderbycol}" if isOrderByClause != None else '')
    sql = sql + (f"GROUP BY {tableobject.groupbycol}" if isGroupByClause != None else '')
    return sql

def get_connection():
    host_name = "104.211.77.251"
    port = 10000
    conn = hive.Connection(host=host_name, port=port, auth="NOSASL")
    #dataframe = pd.read_sql("SELECT * FROM northwnd.orders JOIN northwnd.customers on orders.customerid = customers.customerid ", conn)
    #print(dataframe)
    return conn

def getDataFromDB(inputString):
    tableobject = parse_jsonDynamically(inputString)
    finalSQLQuery = create_select_query(tableobject)
    print("********** final query ********* %s" % finalSQLQuery)
    # conn = get_connection()
    # dataframe = pd.read_sql(finalSQLQuery, conn)
    # print(dataframe)




#inputString = '{ "DataBaseName": "northwnd", "Table1": { "tablename": "customers", "Fields": "id, first_name, last_name, email, phone, birthdate", "DataTypes": "int, string, string, string, int, string" }, "selectedcolumns": "*", "WhereClause": { "wherecolumnname": "Region", "operator": "", "whereconditionooperator": "=", "value": "SP" } }'
#inputString = '{ "DataBaseName": "northwnd", "Table1": { "tablename": "customers", "Fields": "id, first_name, last_name, email, phone, birthdate", "DataTypes": "int, string, string, string, int, string" }, "selectedcolumns": "Region, count(*)", "groupbycol":"Region" }'
inputString = '{ "DataBaseName": "northwnd", "Table1": { "tablename": "orders", "Fields": "id, first_name, last_name, email, phone, birthdate", "DataTypes": "int, string, string, string, int, string" }, "Table2": { "tablename": "customers", "Fields": "id, student_id, test, grade", "DataTypes": "int, int, string, int" }, "selectedcolumns": "*", "joinclause": { "JoinType": "JOIN", "LeftTable": "Table1", "RightTable": "Table2", "OnOperator": "", "OnConditionOperator": "=", "LeftColumn": "customerid", "RightColumn": "customerid " } }'
getDataFromDB(inputString)

