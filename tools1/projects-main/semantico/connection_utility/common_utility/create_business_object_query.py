"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
import json

from connection_utility.sql_lite_connection import business_object_repo
from connection_utility.sql_lite_connection.business_object_repo import get_business_object_data_by_id, \
    get_tables_data_by_detail_id, get_fields_by_object_id, get_joins_by_detail_id, get_where_clauses_by_detail_id, \
    get_business_object_data_for_user_by_id, get_tables_data_for_user_by_detail_id, get_fields_for_user_by_object_id, \
    get_row_permission_for_user_by_detail_id
import itertools
import decimal
from boto3.dynamodb.types import TypeDeserializer as tdes


def obj_dict(obj):
    return obj.__dict__


class Object:
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)


def get_query_json(detail_id, is_sql):
    query_obj = Object()
    obj_data = json.loads(get_business_object_data_by_id(detail_id))
    if len(obj_data) > 0:
        obj_data = obj_data[0]
        query_obj.DatabaseName = '[' + obj_data["DatabaseName"] + ']'
        query_obj.Tables = []
        table_list = json.loads(get_tables_data_by_detail_id(detail_id))
        for table in table_list:
            if is_sql:
                query_obj.Tables.append('[' + table["TableName"] + ']')
            else:
                query_obj.Tables.append(obj_data["DatabaseName"] + '.' + table["TableName"])
        query_obj.Fields = []
        field_list = json.loads(get_fields_by_object_id(detail_id))
        for field in field_list:
            field_obj = Object()
            field_obj.TableName = '[' + field["TableName"] + ']'
            field_obj.FieldName = '[' + field["FieldName"] + ']'
            field_obj.Alias = '[' + field["AliasName"] + ']'
            field_obj.Mask = field["Mask"]
            query_obj.Fields.append(field_obj)
        query_obj.Joins = []
        join_list = json.loads(get_joins_by_detail_id(detail_id))
        for join in join_list:
            join_obj = Object()
            join_obj.LeftTable = '[' + join["Table1Name"] + ']'
            join_obj.JoinType = join["JoinType"]
            join_obj.RightTable = '[' + join["Table2Name"] + ']'
            join_obj.Condition = "="
            join_obj.LeftColumn = '[' + join["Table1Field"] + ']'
            join_obj.RightColumn = '[' + join["Table2Field"] + ']'
            query_obj.Joins.append(join_obj)
        query_obj.Where = []
        where_list = json.loads(get_where_clauses_by_detail_id(detail_id))
        for where in where_list:
            where_obj = Object()
            where_obj.TableName = '[' + where["TableName"] + ']'
            where_obj.columnName = '[' + where["FieldName"] + ']'
            where_obj.Condition = where["Condition"]
            where_obj.Value = "'" + where["CompareValue"] + "'"
            query_obj.Where.append(where_obj)
    query_json = json.dumps(query_obj, default=obj_dict)
    return query_json


def create_query(json_data, is_sql):
    json_data = json.loads(json_data)
    db_name = json_data["DatabaseName"]
    dynamic_sql = 'select '
    field_list = []
    for field in json_data["Fields"]:
        sql_text = ''
        sql_text += field["TableName"] + '.' + field["FieldName"]
        if field["Alias"] != '':
            sql_text += ' as ' + field["Alias"]
        field_list.append(sql_text)
    dynamic_sql += ','.join(field_list)
    join_list = json_data["Joins"]
    if len(join_list) == 0:
        dynamic_sql += ' from ' + ','.join(json_data["Tables"])
    else:
        sql_text = ' from '
        first_join_clause = join_list[0]
        if is_sql:
            sql_text += first_join_clause["LeftTable"]
        else:
            sql_text += db_name + '.' + first_join_clause["LeftTable"] + ' '
        sql_text += first_join_clause["JoinType"] + ' '
        if is_sql:
            sql_text += first_join_clause["RightTable"] + ' on '
        else:
            sql_text += db_name + '.' + first_join_clause["RightTable"] + ' on '
        sql_text += first_join_clause["LeftTable"] + '.' + first_join_clause["LeftColumn"]
        sql_text += first_join_clause["Condition"]
        sql_text += first_join_clause["RightTable"] + '.' + first_join_clause["RightColumn"]
        for join in join_list[1:]:
            sql_text += join["JoinType"] + ' '
            if is_sql:
                sql_text += join["RightTable"] + ' on '
            else:
                sql_text += db_name + '.' + join["RightTable"] + ' on '
            sql_text += join["LeftTable"] + '.' + join["LeftColumn"]
            sql_text += join["Condition"]
            sql_text += join["RightTable"] + '.' + join["RightColumn"]
        dynamic_sql += sql_text
    where_list = json_data["Where"]
    if len(where_list) > 0:
        first_where_clause = where_list[0]
        sql_text = ' WHERE '
        sql_text += first_where_clause["TableName"] + '.' + first_where_clause["columnName"] + first_where_clause[
            "Condition"] + first_where_clause["Value"]
        for clause in where_list[1:]:
            sql_text += " AND " + clause["TableName"] + '.' + clause["columnName"] + clause["Condition"] + clause[
                "Value"]
        dynamic_sql += sql_text
    row_permission_list = json_data["RowPermission"]

    print(row_permission_list)
    if len(row_permission_list) > 0:
        if len(where_list) > 0:
            sql_text = ' AND '
        else:
            sql_text = ' WHERE '
        key_group = lambda x: x["ColumnName"]

        for key, group in itertools.groupby(row_permission_list, key_group):
            group_json = json.dumps(list(group))
            group_data = json.loads(group_json)
            sql_text += key + " IN ('" + "','".join(data["Value"] for data in group_data) + "')"
        dynamic_sql += sql_text
    print(dynamic_sql)
    return dynamic_sql


def create_mask_query(json_data):
    json_data = json.loads(json_data)
    dynamic_sql = ''
    field_list = json_data["Fields"]
    for field in field_list:
        mask = field["Mask"]
        if mask != "":
            sql_text = "ALTER TABLE " + field["TableName"]
            sql_text += " ALTER COLUMN " + field["FieldName"] + " ADD MASKED WITH (FUNCTION = 'default()')"
            dynamic_sql += sql_text
    return dynamic_sql


def get_query_json_for_user_object(user_id, detail_id):
    query_obj = Object()
    is_sql = True
    obj_data = json.loads(get_business_object_data_for_user_by_id(detail_id, user_id))
    if len(obj_data) > 0:
        obj_data = obj_data[0]
        query_obj.DatabaseName = '[' + obj_data["DatabaseName"] + ']'
        query_obj.Tables = []
        table_list = json.loads(get_tables_data_for_user_by_detail_id(detail_id, user_id))
        for table in table_list:
            if is_sql:
                query_obj.Tables.append('[' + table["TableName"] + ']')
            else:
                query_obj.Tables.append(obj_data["DatabaseName"] + '.' + table["TableName"])
        query_obj.Fields = []
        field_list = json.loads(get_fields_for_user_by_object_id(detail_id, user_id))
        for field in field_list:
            field_obj = Object()
            field_obj.TableName = '[' + field["TableName"] + ']'
            field_obj.FieldName = '[' + field["FieldName"] + ']'
            field_obj.DataType = field["DataType"]
            field_obj.Alias = '[' + field["AliasName"] + ']'
            field_obj.Mask = field["Mask"]
            query_obj.Fields.append(field_obj)
        query_obj.Joins = []
        join_list = json.loads(get_joins_by_detail_id(detail_id))
        for join in join_list:
            join_obj = Object()
            join_obj.LeftTable = '[' + join["Table1Name"] + ']'
            join_obj.JoinType = join["JoinType"]
            join_obj.RightTable = '[' + join["Table2Name"] + ']'
            join_obj.Condition = "="
            join_obj.LeftColumn = '[' + join["Table1Field"] + ']'
            join_obj.RightColumn = '[' + join["Table2Field"] + ']'
            query_obj.Joins.append(join_obj)
        query_obj.Where = []
        where_list = json.loads(get_where_clauses_by_detail_id(detail_id))
        for where in where_list:
            where_obj = Object()
            where_obj.TableName = '[' + where["TableName"] + ']'
            where_obj.columnName = '[' + where["FieldName"] + ']'
            where_obj.Condition = where["Condition"]
            where_obj.Value = "'" + where["CompareValue"] + "'"
            query_obj.Where.append(where_obj)
        query_obj.RowPermission = []
        row_permission_list = json.loads(get_row_permission_for_user_by_detail_id(detail_id, user_id))
        for row_permission in row_permission_list:
            row_obj = Object()
            row_obj.TableName = '[' + row_permission["TableName"] + ']'
            row_obj.ColumnName = '[' + row_permission["TableName"] + ']' + '.' + '[' + row_permission["FieldName"] + ']'
            row_obj.Value = row_permission["FieldValue"]
            query_obj.RowPermission.append(row_obj)
    query_json = json.dumps(query_obj, default=obj_dict)
    return query_json


def create_expression_for_dynamodb(json_data):
    json_data = json.loads(json_data)
    # print(json_data)
    db_name = json_data["DatabaseName"]
    nameMapDict = {}
    valueMap = {}
    projectionExprList = []
    filterExprList = []
    fieldTypeDict = {}
    fieldAlias = {}
    query_obj = {}
    proj_expr = ""
    filterExpr = ""
    for count, field in enumerate(json_data["Fields"], start=1):
        tablename = field["TableName"]
        if tablename.startswith('[') and tablename.endswith(']'):
            tablename = field["TableName"]
            tablename = tablename[1:-1]
        fieldname = field["FieldName"]
        fieldtype = field["DataType"]
        fieldalias = field["Alias"].strip('[').strip(']')
        if fieldname.startswith('[') and fieldname.endswith(']'):
            fieldname = fieldname[1:-1]
            fieldTypeDict[fieldname] = fieldtype
            if fieldalias == "":
                fieldAlias[fieldname] = fieldname
            else:
                fieldAlias[fieldname] = fieldalias
            nameMapDict = get_nameMapDict(fieldname)
            proj_expr = get_projectionExpression(fieldname)
            projectionExprList.append(proj_expr)
            # x = fieldname.split(".")
            # key1 = "#k" + str(count)
            # if not x[0] in nameMapDict.values():
            #     nameMapDict[key1] = x[0]
            #
            # p1 = list(nameMapDict.keys())[list(nameMapDict.values()).index(x[0])]
            # print("------p1")
            # print(p1)
            # if len(x) > 1:
            #     key2 = "#p" + str(count)
            #     if not x[1] in nameMapDict.values():
            #         nameMapDict[key2] = x[1]
            #     p2 = list(nameMapDict.keys())[list(nameMapDict.values()).index(x[1])]
            #     print("------p2")
            #     print(p2)
            #     projectionExprList.append(p1 + "." + p2)
            # else:
            #     projectionExprList.append(p1)

    projectionExpr = ','.join(projectionExprList)
    # print(nameMapDict)
    # print(proj_expr)
    where_list = json_data["Where"]
    type_des_obj = tdes()
    for count, field in enumerate(json_data["Where"], start=1):

        filtercolumn = field["columnName"]
        filtervalue = (field["Value"]).replace("'", "")
        condition = str(field["Condition"])

        if len(where_list) > 0:
            if filtercolumn.startswith('[') and filtercolumn.endswith(']'):
                filtercolumn = filtercolumn[1:-1]
                filtervaluetype = fieldTypeDict.get(filtercolumn)
                val = ":v" + str(count)

                newtype = tdes.deserialize(type_des_obj, {filtervaluetype: filtervalue})
                valueMap[val] = newtype
                print(newtype)
                print(type(newtype))

                # x = filtercolumn.split(".")
                # k2 = list(nameMapDict.keys())[list(nameMapDict.values()).index(x[0])]
                # if len(x) > 1:
                #     k3 = list(nameMapDict.keys())[list(nameMapDict.values()).index(x[1])]
                #     filterExprList.append(k2 + "." + k3 + condition + val)
                # else:
                #     filterExprList.append(k2 + condition + val)
                filter_expr = get_filterExpression(filtercolumn)
                filterExprList.append(filter_expr + condition + val)

    filterExpr = " and ".join(filterExprList)

    row_permission_list = json_data["RowPermission"]
    if len(row_permission_list) > 0:

        key_group = lambda x: x["ColumnName"]
        print("------------")
        print(key_group)
        fil_expr = ''
        for key, group in itertools.groupby(row_permission_list, key_group):
            if filterExpr != "":
                fil_expr = ' and '
            else:
                fil_expr = ''

            group_json = json.dumps(list(group))
            group_data = json.loads(group_json)
            key = key.split("].[")[1]
            if key.startswith('[') or key.endswith(']'):
                key = key.strip('[').strip(']')
            fl_lst = []
            for item in group_data:
                valMapDictCnt = len(valueMap)
                filtervalue = (item["Value"]).replace("'", "")
                filtervaluetype = fieldTypeDict.get(key)
                _val = ":v" + str(valMapDictCnt + 1)
                fl_lst.append(_val)
                newtype = tdes.deserialize(type_des_obj, {filtervaluetype: filtervalue})
                if filtervaluetype == "BOOL" and filtervalue == "True":
                    newtype = True
                elif filtervaluetype == "BOOL" and filtervalue == "False":
                    newtype = False
                valueMap[_val] = newtype
                print(newtype)
                # vmp = list(nameMapDict.keys())[list(nameMapDict.values()).index(key)]
                vmp = get_projectionExpression(key)

            fil_expr += vmp + " IN (" + ",".join(fl_lst) + ")"
            print(fil_expr)
            filterExpr = filterExpr + fil_expr
        print(filterExpr)

    # print("NameMapDict")
    # print(nameMapDict)
    # print("ProjectionExpression")
    # print(projectionExpr)
    # print("FilterExpression")
    # print(filterExpr)
    # print("ValueMapDictionary")
    # print(valueMap)
    query_obj["TableName"] = tablename
    query_obj["NameMapDict"] = nameMapDict
    query_obj["ValueMapDict"] = valueMap
    query_obj["ProjectionExpression"] = projectionExpr
    query_obj["FilterExpression"] = filterExpr
    query_obj["FieldTypeDict"] = fieldTypeDict
    query_obj["FieldAliasDict"] = fieldAlias
    jobj = json.dumps(query_obj, cls=DecimalEncoder)
    print(jobj)
    nameMapDictionary.clear()

    # query_json = json.dumps(jobj, default=obj_dict)
    # print(json.loads(query_json))
    return json.loads(jobj)


nameMapDictionary = {}


def get_nameMapDict(fieldname):
    count = 0
    x = fieldname.split(".")
    dict_len = len(nameMapDictionary)
    for count, field in enumerate(x):
        # print(x[count])
        dict_len = len(nameMapDictionary)
        key = "#k" + str(dict_len + 1)
        # print(key)
        if not x[count] in nameMapDictionary.values():
            nameMapDictionary[key] = x[count]
    return nameMapDictionary


def get_projectionExpression(fieldname):
    pelist = []

    x = fieldname.split(".")
    for count, field in enumerate(x):
        p = list(nameMapDictionary.keys())[list(nameMapDictionary.values()).index(x[count])]
        # print(p)
        pelist.append(p)
    pe = ".".join(pelist)
    return pe


def get_filterExpression(filtercolumn):
    felist = []
    x = filtercolumn.split(".")
    for count, field in enumerate(x):
        p = list(nameMapDictionary.keys())[list(nameMapDictionary.values()).index(x[count])]
        # print(p)
        felist.append(p)
    fe = ".".join(felist)
    return fe


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            # if o % 1 > 0:
            return float(o)
        # else:
        #     return int(o)
        return super(DecimalEncoder, self).default(o)


def get_kusto_join_type(param):
    if param == "Inner Join":
        return "inner"
    elif param == "Left Join":
        return "leftouter"
    elif param == "Right Join":
        return "rightouter"
    elif param == "Cross Join":
        return "inner"
    elif param == "Full Join":
        return "fullouter"


def create_kusto_query(query_json, object_access_level, object_id, user_id, function_name, filter_data=""):
    json_data = json.loads(query_json)
    join_list = json_data["Joins"]
    dynamic_query = ".create-or-alter function with (docstring = 'User Based Semantico Domain Object', " \
                    "folder='Graviton') " + function_name + "(){ let  mask_data=(column_data:string)  {strcat (substring(" \
                                                            "column_data, 0,2),(replace_string(column_data,column_data,'***')), strcat (substring(column_data, 4) ))}; " \
                                                            "let hash_data = (column_data:string){hash(column_data)}; external_table('"
    if len(join_list) > 0:
        first_join_clause = join_list[0]
        dynamic_query += first_join_clause["LeftTable"] + "')"
        dynamic_query += f'|join kind={get_kusto_join_type(first_join_clause["JoinType"])} '
        right_table = first_join_clause["RightTable"]
        left_column = first_join_clause["LeftColumn"]
        if first_join_clause["Condition"] == "=":
            first_join_clause["Condition"] = "=="
        join_cond = first_join_clause["Condition"]
        right_column = first_join_clause["RightColumn"]
        dynamic_query += f"external_table('{right_table}') on $left.{left_column}{join_cond}$right.{right_column}"
        for join in join_list[1:]:
            right_table = join["RightTable"]
            left_column = join["LeftColumn"]
            if join["Condition"] == "=":
                join["Condition"] = "=="
            join_cond = join["Condition"]
            dynamic_query += f'|join kind={get_kusto_join_type(join["JoinType"])} '
            dynamic_query += f"external_table('{right_table}') on $left.{left_column}{join_cond}$right.{right_column}"
    else:
        dynamic_query += json_data["Tables"][0] + "')"

    duplicate_fields = []
    select_fields = []
    for field in json_data["Fields"]:
        if field["FieldName"] in duplicate_fields:
            field["FieldName"] = field["FieldName"] + str(duplicate_fields.count(field["FieldName"]))
            duplicate_fields.append(field["FieldName"])
        else:
            duplicate_fields.append(field["FieldName"])

    user_access_level_obj = json.loads(business_object_repo.get_user_access_level_on_object(object_id, user_id))
    user_access_level = object_access_level
    if len(user_access_level_obj) > 0:
        user_access_level = user_access_level_obj[0]["AccessLevel"]
    if user_access_level == "Public":
        print("json_data>>>", json_data["Fields"])
        for field in json_data["Fields"]:
            field_access_level = str(field["AccessLevel"])
            if field_access_level == "Protected":
                field["FieldName"] = f'hash({field["FieldName"]})'
    if user_access_level == "Protected":
        for field in json_data["Fields"]:
            field_access_level = str(field["AccessLevel"])
            if field_access_level == "Private":
                field["FieldName"] = f'hash({field["FieldName"]})'

    for field in json_data["Fields"]:
        if user_access_level != 'Private':
            field_mask_encrypt = str(field["Mask"])
            if field_mask_encrypt == "2":
                field["Alias"] = f'{field["Alias"]}=hash({field["FieldName"]})'
            elif field_mask_encrypt == "1":
                field["Alias"] = f'{field["Alias"]}=mask_data({field["FieldName"]})'
            else:
                field["Alias"] = f'{field["Alias"]}={field["FieldName"]}'
        else:
            field["Alias"] = f'{field["Alias"]}={field["FieldName"]}'
        select_fields.append(field["Alias"])
    dynamic_query += f'|project {",".join(select_fields)}'

    where_list = json_data["Where"]
    if len(where_list) > 0:
        first_where_clause = where_list[0]
        sql_text = ' |where '
        if first_where_clause["Condition"] == "=":
            first_where_clause["Condition"] = "=="
        sql_text += first_where_clause["columnName"] + first_where_clause["Condition"] + first_where_clause["Value"]
        for clause in where_list[1:]:
            sql_text += " and " + clause["columnName"] + clause["Condition"] + clause["Value"]
        dynamic_query += sql_text
    row_permission_list = json_data["RowPermission"]
    if len(row_permission_list) > 0:
        if len(where_list) > 0:
            sql_text = ' and '
        else:
            sql_text = ' |where '
        key_group = lambda x: x["ColumnName"]
        for key, group in itertools.groupby(row_permission_list, key_group):
            group_json = json.dumps(list(group))
            group_data = json.loads(group_json)
            sql_text += key + " in ('" + "','".join(data["Value"] for data in group_data) + "')"
        dynamic_query += sql_text
    dynamic_query += "}"
    return dynamic_query


def get_kusto_query_json_for_user_object(user_id, detail_id):
    query_obj = Object()
    is_sql = True
    obj_data = json.loads(get_business_object_data_for_user_by_id(detail_id, user_id))
    if len(obj_data) > 0:
        obj_data = obj_data[0]
        query_obj.DatabaseName = obj_data["DatabaseName"]
        query_obj.Tables = []
        table_list = json.loads(get_tables_data_for_user_by_detail_id(detail_id, user_id))
        for table in table_list:
            if is_sql:
                query_obj.Tables.append(f'tbl_{table["TableName"]}')
            else:
                query_obj.Tables.append(obj_data["DatabaseName"] + '.' + table["TableName"])
        query_obj.Fields = []
        field_list = json.loads(get_fields_for_user_by_object_id(detail_id, user_id))
        for field in field_list:
            field_obj = Object()
            field_obj.TableName = f'tbl_{field["TableName"]}'
            field_obj.FieldName = field["FieldName"]
            field_obj.DataType = field["DataType"]
            field_obj.Alias = field["AliasName"]
            field_obj.Mask = field["Mask"]
            field_obj.AccessLevel = field["FieldAccessLevel"]
            query_obj.Fields.append(field_obj)
        query_obj.Joins = []
        join_list = json.loads(get_joins_by_detail_id(detail_id))
        for join in join_list:
            join_obj = Object()
            join_obj.LeftTable = f'tbl_{join["Table1Name"]}'
            join_obj.JoinType = join["JoinType"]
            join_obj.RightTable = f'tbl_{join["Table2Name"]}'
            join_obj.Condition = "="
            join_obj.LeftColumn = join["Table1Field"]
            join_obj.RightColumn = join["Table2Field"]
            query_obj.Joins.append(join_obj)
        query_obj.Where = []
        where_list = json.loads(get_where_clauses_by_detail_id(detail_id))
        for where in where_list:
            where_obj = Object()
            where_obj.TableName = f'tbl_{where["TableName"]}'
            where_obj.columnName = where["FieldName"]
            where_obj.Condition = where["Condition"]
            where_obj.Value = "'" + where["CompareValue"] + "'"
            query_obj.Where.append(where_obj)
        query_obj.RowPermission = []
        row_permission_list = json.loads(get_row_permission_for_user_by_detail_id(detail_id, user_id))
        for row_permission in row_permission_list:
            row_obj = Object()
            row_obj.TableName = f'tbl_{row_permission["TableName"]}'
            row_obj.ColumnName = row_permission["FieldName"]
            row_obj.Value = row_permission["FieldValue"]
            query_obj.RowPermission.append(row_obj)
    query_json = json.dumps(query_obj, default=obj_dict)
    return query_json
