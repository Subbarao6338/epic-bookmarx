"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
import os
from json import JSONEncoder
import numpy
from azure.storage.filedatalake import DataLakeServiceClient
import json
from io import StringIO
import io
import pandas as pd
import pandavro as pdx
from pretty_html_table import build_table
from detect_delimiter import detect

from connection_utility.sql_lite_connection import business_object_repo
import cryptpandas as crp
import hashlib
import connection_utility.adls_connection.adx_utility as adx_util
import connection_utility.common_utility.create_business_object_query as dynamic_query_utility
from datetime import datetime


def initialize_storage_account(storage_account_name, storage_account_key):
    try:
        global service_client
        service_client = DataLakeServiceClient(account_url="{}://{}.dfs.core.windows.net".format(
            "https", storage_account_name), credential=storage_account_key)
    except Exception as e:
        print(e)


def get_container_list(storage_name, access_key):
    list_containers = []
    initialize_storage_account(storage_name, access_key)
    list_file_systems = service_client.list_file_systems()
    for container_info in list_file_systems:
        list_containers.append(container_info.name)
    return list_containers


def get_file_list(db_name):
    list_files = []
    file_system_client = service_client.get_file_system_client(file_system=db_name)
    paths = file_system_client.get_paths()
    for path in paths:
        if not path.is_directory:
            table_name = path.name.split("/")[0]
            if table_name not in list_files:
                list_files.append(table_name)
    return list_files


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


def retrieve_columns_of_adls_file(path, db_name):
    file_system_client = service_client.get_file_system_client(db_name)
    file_client = file_system_client.get_file_client(path.name)
    file_ext = os.path.basename(path.name).split('.', 1)[1]
    if file_ext in ["csv", "tsv"]:
        with open("adls_file/csv_file.txt", "wb") as my_file:
            download = file_client.download_file()
            download.readinto(my_file)
        with open('adls_file/csv_file.txt', 'r') as file:
            data = file.read()
        row_delimiter = detect(text=data, default=None, whitelist=[',', ';', ':', '|', '\t'])
        processed_df = pd.read_csv('adls_file/csv_file.txt', sep=row_delimiter)
    if file_ext == "parquet":
        download = file_client.download_file()
        stream = io.BytesIO()
        download.readinto(stream)
        processed_df = pd.read_parquet(stream, engine='pyarrow')
    if file_ext == "avro":
        with open("adls_file/avro_file.avro", "wb") as my_file:
            download = file_client.download_file()
            download.readinto(my_file)
        processed_df = pdx.read_avro("adls_file/avro_file.avro")
    column_list = []
    for key, val in dict(processed_df.dtypes).items():
        if str(val) == 'object':
            try:
                pd.to_datetime(processed_df[str(key)])
                column_list.append({"column_name": str(key), 'data_type': 'datetime64'})
            except ValueError:
                column_list.append({"column_name": str(key), 'data_type': 'string'})
                pass
        else:
            column_list.append({"column_name": str(key), 'data_type': str(val)})
    return column_list


def get_file_schema(table_list, storage_name, access_key, db_name):
    table_field_obj = Object()
    table_field_obj.data = []
    table_list = json.loads(table_list)
    file_system_client = service_client.get_file_system_client(file_system=db_name)
    paths = file_system_client.get_paths()
    for table in table_list:
        for path in paths:
            if not path.is_directory:
                table_name = path.name.split("/")[0]
                if table_name == table:
                    column_dict = retrieve_columns_of_adls_file(path, db_name)
                    tf_obj = Object()
                    tf_obj.TableName = str(table).strip()
                    tf_obj.AliasName = ""
                    tf_obj.Fields = []
                    for item in column_dict:
                        tf_obj.Fields.append(
                            Fields(str(item['column_name']), str(item['data_type']), False, "", "", "", ""))
                    table_field_obj.data.append(tf_obj)
                    break
    return json.dumps(table_field_obj, default=obj_dict)


def get_data_from_adls(storage_name, access_key, container_name, parent_folder_name, field_list):
    initialize_storage_account(storage_name, access_key)
    file_system_client = service_client.get_file_system_client(container_name)
    file_paths = file_system_client.get_paths(path=parent_folder_name)
    main_df = pd.DataFrame()
    for path in file_paths:
        if not path.is_directory:
            file_client = file_system_client.get_file_client(path.name)
            file_ext = os.path.basename(path.name).split('.', 1)[1]
            if file_ext in ["csv", "tsv"]:
                with open("adls_file/csv_file.txt", "wb") as my_file:
                    download = file_client.download_file()
                    download.readinto(my_file)
                with open('adls_file/csv_file.txt', 'r') as file:
                    data = file.read()
                row_delimiter = detect(text=data, default=None, whitelist=[',', ';', ':', '|', '\t'])
                processed_df = pd.read_csv('adls_file/csv_file.txt', sep=row_delimiter)
            if file_ext == "parquet":
                download = file_client.download_file()
                stream = io.BytesIO()
                download.readinto(stream)
                processed_df = pd.read_parquet(stream, engine='pyarrow')
            if file_ext == "avro":
                with open("adls_file/avro_file.avro", "wb") as my_file:
                    download = file_client.download_file()
                    download.readinto(my_file)
                processed_df = pdx.read_avro("adls_file/avro_file.avro")
            if not main_df.empty:
                main_df = main_df.append(pd.DataFrame(processed_df[field_list]), ignore_index=True)
            else:
                main_df = pd.DataFrame(processed_df[field_list])
    return main_df


# storage_name = "gravitondatastorage"
# access_key = "GK1i3ySEfapzpN+9erlzMo2ZMpa+I/abz05D0hzNYB+NQbJ896AEzjVWfy5ti3A6lJVtKiMPah6k+AStzt6gpg=="
# container_name = "rawdatazone"
# parent_folder_name = "customer_transaction"


def get_join_type(param):
    if param == "Inner Join":
        return "inner"
    elif param == "Left Join":
        return "left"
    elif param == "Right Join":
        return "right"
    elif param == "Cross Join":
        return "inner"
    elif param == "Full Join":
        return "outer"


def execute_select_query_backup(object_id, user_id):
    domain_object_detail_obj = json.loads(business_object_repo.get_business_object_data_by_id(object_id))
    object_access_level = domain_object_detail_obj[0]["AccessLevel"]
    container_name = domain_object_detail_obj[0]["DatabaseName"]
    storage_name = domain_object_detail_obj[0]["StorageName"]
    access_key = domain_object_detail_obj[0]["StorageAccessKey"]
    field_list_obj = business_object_repo.get_fields_for_user_by_object_id(object_id, user_id)
    data_frame_list = []
    table_data_obj = json.loads(business_object_repo.get_tables_data_by_detail_id(object_id))
    for table in table_data_obj:
        parent_folder_name = table["TableName"]
        field_list = []
        for field in json.loads(field_list_obj):
            if field["TableName"] == table["TableName"]:
                field_list.append(str(field["FieldName"]))
        data_frame = get_data_from_adls(storage_name, access_key, container_name, parent_folder_name, field_list)
        where_details_obj = business_object_repo.get_where_clauses_by_detail_id_and_table_name(object_id,
                                                                                               table["TableName"])
        if where_details_obj is not None:
            where_details = json.loads(where_details_obj)
            if where_details is not None and len(where_details) > 0:
                for item in where_details:
                    data_frame = data_frame[data_frame[str(item["FieldName"])] == str(item["CompareValue"])]

        row_perm_details = business_object_repo.get_row_permission_for_user_by_detail_and_table_id(object_id, user_id,
                                                                                                   table["TableId"])
        if row_perm_details is not None:
            row_permission_obj = json.loads(row_perm_details)
            if row_permission_obj is not None and len(row_permission_obj) > 0:
                list_values = []
                for row_item in row_permission_obj:
                    list_values.append(row_item["FieldValue"])
                data_frame = data_frame[data_frame[row_permission_obj[0]["FieldName"]].isin(list_values)]

        user_access_level_obj = json.loads(business_object_repo.get_user_access_level_on_object(object_id, user_id))
        user_access_level = ""
        if len(user_access_level_obj) > 0:
            user_access_level = user_access_level_obj[0]["AccessLevel"]
        if user_access_level == "":
            user_access_level = object_access_level
        if user_access_level == "Public":
            for field in json.loads(field_list_obj):
                if field["TableName"] == parent_folder_name:
                    field_access_level = str(field["AccessLevel"])
                    if field_access_level == "Protected":
                        data_frame[str(field["FieldName"])] = data_frame[str(field["FieldName"])].astype(str)
                        data_frame[str(field["FieldName"])] = data_frame[str(field["FieldName"])].apply(
                            lambda x:
                            hashlib.sha256(x.encode()).hexdigest()
                        )
        if user_access_level == "Protected":
            for field in json.loads(field_list_obj):
                if field["TableName"] == parent_folder_name:
                    field_access_level = str(field["AccessLevel"])
                    if field_access_level == "Private":
                        data_frame[str(field["FieldName"])] = data_frame[str(field["FieldName"])].astype(str)
                        data_frame[str(field["FieldName"])] = data_frame[str(field["FieldName"])].apply(
                            lambda x:
                            hashlib.sha256(x.encode()).hexdigest()
                        )
        for field in json.loads(field_list_obj):
            if field["TableName"] == parent_folder_name:
                if user_access_level != 'Private':
                    field_mask_encrypt = str(field["Mask"])
                    if field_mask_encrypt == "2":
                        data_frame[str(field["FieldName"])] = data_frame[str(field["FieldName"])].astype(str)
                        data_frame[str(field["FieldName"])] = data_frame[str(field["FieldName"])].apply(
                            lambda x:
                            hashlib.sha256(x.encode()).hexdigest()
                        )
                    if field_mask_encrypt == "1":
                        data_frame[str(field["FieldName"])] = data_frame[str(field["FieldName"])].astype(str)
                        data_frame[str(field["FieldName"])] = data_frame[str(field["FieldName"])].apply(
                            lambda x:
                            '*' * (len(x) - 5) + x[-5:]
                        )
        data_frame_list.append({"table_name": table["TableName"], "dataframe": data_frame})
    join_details_obj = business_object_repo.get_joins_by_detail_id(object_id)
    if join_details_obj is not None and len(json.loads(join_details_obj)) > 0:
        data_frame = pd.DataFrame()
        for join in json.loads(join_details_obj):
            for item in data_frame_list:
                if item["table_name"] == join["Table1Name"]:
                    left_df = item["dataframe"]
                if item["table_name"] == join["Table2Name"]:
                    right_df = item["dataframe"]
            if data_frame.empty:
                join_type = get_join_type(join["JoinType"])
                data_frame = pd.merge(left_df, right_df, how=join_type, left_on=str(join["Table1Field"]),
                                      right_on=str(join["Table2Field"]))
            else:
                join_type = get_join_type(join["JoinType"])
                data_frame = pd.merge(data_frame, right_df, how=join_type, left_on=str(join["Table1Field"]),
                                      right_on=str(join["Table2Field"]))
    return {"result_html": data_frame.to_html(classes='table table-striped text-left', justify='left', index=False),
            "result_count": len(data_frame)}


class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, numpy.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)


def get_field_values(tb_name, field_name, domain_object_id):
    domain_object_detail_obj = json.loads(business_object_repo.get_business_object_data_by_id(domain_object_id))
    container_name = domain_object_detail_obj[0]["DatabaseName"]
    storage_name = domain_object_detail_obj[0]["StorageName"]
    access_key = domain_object_detail_obj[0]["StorageAccessKey"]
    data_frame = get_data_from_adls(storage_name, access_key, container_name, tb_name, [str(field_name)])
    list_values = [data_frame[field_name].unique() for col_name in data_frame.columns]
    encodedNumpyData = json.loads(json.dumps(list_values, cls=NumpyArrayEncoder))[0]
    field_values = []
    for item in encodedNumpyData:
        field_values.append(item)
    return field_values


def get_file_schema_ext_table(table_list, storage_name, access_key, db_name):
    table_field_obj = []
    file_system_client = service_client.get_file_system_client(file_system=db_name)
    paths = file_system_client.get_paths()
    for table in table_list:
        for path in paths:
            if not path.is_directory:
                table_name = path.name.split("/")[0]
                if table_name == table:
                    column_dict = retrieve_columns_of_adls_file(path, db_name)
                    for item in column_dict:
                        if item["data_type"] == "int64":
                            item["data_type"] = "int"
                        if item["data_type"] == "datetime64":
                            item["data_type"] = "datetime"
                        if item["data_type"] == "float64":
                            item["data_type"] = "real"
                        table_field_obj.append(item['column_name'] + ":" + item['data_type'])
                    break
    return json.dumps(table_field_obj, default=obj_dict)


def execute_select_query(object_id, user_key):
    try:
        user_id = json.loads(business_object_repo.get_userdetails_by_user_key(user_key))[0]["UserId"]
        domain_object_detail_obj = json.loads(business_object_repo.get_business_object_data_by_id(object_id))
        object_access_level = domain_object_detail_obj[0]["AccessLevel"]
        container_name = domain_object_detail_obj[0]["DatabaseName"]
        storage_name = domain_object_detail_obj[0]["StorageName"]
        access_key = domain_object_detail_obj[0]["StorageAccessKey"]
        initialize_storage_account(storage_name, access_key)
        table_data_obj = json.loads(business_object_repo.get_tables_data_for_user_by_detail_id(object_id, user_id))
        for table in table_data_obj:
            parent_folder_name = table["TableName"]
            column_list = json.loads(
                get_file_schema_ext_table([parent_folder_name], storage_name, access_key, container_name))
            external_table_query = f".create-or-alter external table tbl_{parent_folder_name}("
            storage_url = f"https://{storage_name}.blob.core.windows.net/{container_name}/{parent_folder_name}/;{access_key}"
            external_table_query += ",".join(column_list)
            external_table_query += ") kind=adl dataformat=csv (h@'" + storage_url + "')"
            external_table_query += 'with (includeHeaders = "All")'
            adx_util.execute_kusto_query(external_table_query)
        query_json = dynamic_query_utility.get_kusto_query_json_for_user_object(user_id, object_id)
        import uuid
        function_name = str(uuid.uuid4()).replace("-", "_")
        dynamic_query = dynamic_query_utility.create_kusto_query(query_json, object_access_level,
                                                                 object_id, user_id, function_name)
        adx_util.execute_kusto_query(dynamic_query)
        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        business_object_repo.insert_adx_function(user_id, object_id, function_name, dt_string)
        return {"Message": function_name}
    except Exception as ex:
        print(ex)
        return ""


def check_function_availability(object_id, user_key):
    user_id = json.loads(business_object_repo.get_userdetails_by_user_key(user_key))[0]["UserId"]
    adx_functions = business_object_repo.get_adx_functions_by_user_and_object_id(user_id, object_id)
    column_list = business_object_repo.get_fields_for_user_by_object_id(object_id, user_id)
    if adx_functions is not None:
        return {"Message": "Function with name:" + adx_functions["FunctionName"] + " already exist.", "isExist": True,
                "Result": adx_functions["FunctionName"], "Column_List": column_list}
    else:
        return {"Message": "Function not exist.", "isExist": False, "Column_List": column_list, "Result": ""}


def fetch_data_from_adx(user_key, function_name, filter_data, object_id):
    print("filter data >>>", filter_data)
    print("Started>>", datetime.now())
    if filter_data is not None and filter_data != "":
        function_name += " | where "+filter_data
    result_data_frame = adx_util.execute_kusto_query(function_name)
    print("End>>", datetime.now())
    return {"result_html": result_data_frame.to_html(classes='table table-striped text-left', justify='left', index=False), "result_count": len(result_data_frame)}
