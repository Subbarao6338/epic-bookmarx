import json

import pandas as pd
from faker import Faker
import re

fake = Faker()


def anonymize_using_faker(uploaded_df, masking_value, column_name):
    masking_val = masking_value.replace("Faker_", "")
    if column_name in uploaded_df:
        original = uploaded_df[column_name].tolist()
        duplicate = []
        temp = {}
        for val in original:
            if val not in temp:
                temp[val] = getattr(fake, masking_val)()
        for val in original:
            duplicate.append(temp[val])
        uploaded_df[column_name] = duplicate
    return uploaded_df


def anonymize_using_regex(uploaded_df, masking_value, column_name):
    if column_name in uploaded_df:
        original = uploaded_df[column_name].tolist()
        duplicate = []
        temp = {}
        for val in original:
            if val not in temp:
                temp[val] = re.sub(masking_value, "*", str(val))
        for val in original:
            duplicate.append(temp[val])
        uploaded_df[column_name] = duplicate
    return uploaded_df


def anonymize_uploaded_data(uploaded_df, maskable_columns):
    mask_type_json = pd.read_json("config/masking_type.json", typ='series')
    for column_obj in maskable_columns:
        column_name = column_obj["propsName"]
        masking_value = mask_type_json[column_obj["type"]]
        if 'Faker' in masking_value:
            uploaded_df = anonymize_using_faker(uploaded_df, masking_value, column_name)
        else:
            uploaded_df = anonymize_using_regex(uploaded_df, masking_value, column_name)
    return uploaded_df


def remove_rows_by_index(file_path, remove_index_list):
    updated_data_frame = pd.read_csv(file_path, skiprows=remove_index_list)
    updated_data_frame.to_csv(file_path, index=False, header=True)
    print(updated_data_frame)


def add_rows_to_existing_csv(file_path, added_records):
    uploaded_df = pd.read_csv(file_path)
    added_record_df = pd.read_json(json.dumps(added_records))
    result_data_frame = pd.concat([added_record_df, uploaded_df])
    result_data_frame.to_csv(file_path, header=True, index=False)


def update_uploaded_file_as_anonymized(file_path, mask_column_list):
    if file_path.endswith(".csv"):
        uploaded_df = pd.read_csv(file_path)
    elif file_path.endswith(".json"):
        uploaded_df = pd.read_json(file_path)
    else:
        raise ValueError("Invalid train file format")
    anonymized_df = anonymize_uploaded_data(uploaded_df, mask_column_list)
    anonymized_df.to_csv(file_path, header=True, index=False)


def update_uploaded_json_file_as_anonymized(file_path, mask_column_list):
    maskable_col_list = []
    for col_list in mask_column_list:
        for internal_obj in col_list:
            maskable_col_list.append(internal_obj)
    uploaded_df = pd.read_json(file_path)
    anonymized_df = anonymize_uploaded_data(uploaded_df, maskable_col_list)
    anonymized_df.to_json(file_path)
