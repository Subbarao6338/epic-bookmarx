import glob
import shutil

import pandas as pd
import os
import warnings
import json
from sdv.relational import HMA1
#from Utility.connect_sqlite import insert_rel_sdv_model, update_rel_sdv_model
from Utility.connect_azure_sql import insert_rel_sdv_model, update_rel_sdv_model
from datetime import datetime
from sdv import Metadata
from Utility import connect_azure_sql as azure_sql_conn

warnings.filterwarnings("ignore")


def make_archive(source, destination):
    base = os.path.basename(destination)
    name = base.split('.')[0]
    format = base.split('.')[1]
    archive_from = os.path.dirname(source)
    archive_to = os.path.basename(source.strip(os.sep))
    shutil.make_archive(name, format, archive_from, archive_to)
    shutil.move('%s.%s' % (name, format), destination)


def relational_sdv_model_training(array_file_path, meta_file_path, model_name):
    print(array_file_path)
    print(meta_file_path)
    # checking if file format is valid or not
    df_list = {}
    for file_path in array_file_path:
        if file_path.endswith(".csv"):
            train_df = pd.read_csv(file_path)
            # train_df = train_df.head(100)  # trimming training data to reduce time
            name = os.path.basename(file_path)[:-4]
            df_list[name] = train_df
        elif file_path.endswith(".json"):
            train_df = pd.read_json(file_path)
            # train_df = train_df.head(100)  # trimming training data to reduce time
            name = os.path.basename(file_path)[:-5]
            df_list[name] = train_df
        else:
            raise ValueError("Invalid train file format")

    if meta_file_path.endswith(".csv"):
        meta_df = pd.read_csv(meta_file_path)
    elif meta_file_path.endswith(".json"):
        meta_df = pd.read_json(meta_file_path)
    else:
        raise ValueError("Invalid Metadata file format")

    # # print(df_list)
    # parent_table = df_list['users']
    # secondary_table = df_list['sessions']
    # third_table = df_list['transactions']

    # metadata = Metadata()
    # metadata.add_table(name='users', data=parent_table, primary_key='user_id')
    # metadata.add_table(name='sessions', data=secondary_table, primary_key='session_id', parent='users', foreign_key='user_id')
    # metadata.add_table(name = 'transactions',data = third_table, primary_key = 'transaction_id',parent = 'sessions')

    # dir = os.getcwd() + '/SDV_REL/metadata/metadata.json'
    loaded = Metadata(meta_file_path)
    meta_filename = os.path.basename(meta_file_path)
    id = insert_rel_sdv_model((meta_filename, model_name + ".pkl", "in-progress"))
    try:
        model = HMA1(loaded)
        model.fit(df_list)
        new_data = model.sample(num_rows=100)
        generated_data = []
        # print("new_data['users']")
        # print(new_data['users'])
        i=1
        for data in new_data:
            generated_data.append(new_data[data].to_json())
            new_data[data].to_json(os.getcwd() + "/SDV_REL/new_files/synthesized_" + str(i) + ".json")
            i=i+1

        path_rem = os.path.join(os.getcwd() + '/SDV_REL/new_files/result.zip')
        if os.path.exists(path_rem):
            os.remove(path_rem)

        make_archive(os.getcwd() + "/SDV_REL/new_files", path_rem)
        model.save("SDV_REL/sdv_models/" + model_name + ".pkl")
        datetime_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        update_rel_sdv_model((datetime_now, "completed", id))
        return "model saved successfully"
    except Exception as e:
        print(e)
        datetime_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        update_rel_sdv_model((datetime_now, "failed", id))
        return "model training failed"


def generate_rel_sdv_data(model_path, sel_model_name, num_rows, data_type):
    model_name = sel_model_name.split(".")[0]
    datetime_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    generated_id = azure_sql_conn.insert_synthetic_data_list(
        (model_name, data_type, sel_model_name, num_rows, "In Progress", datetime_now))
    model_name = sel_model_name.split(".")[0]
    try:
        loaded = HMA1.load(model_path)
        sample_df = loaded.sample(num_rows=num_rows)
        files = glob.glob('SDV_REL/relational_data_files/*')
        for f in files:
            os.remove(f)
        i = 1
        for df in sample_df:
            print(sample_df[df])
            sample_df[df].to_csv("SDV_REL/relational_data_files/gen_" + str(i) + ".csv", index=False)
            i = i + 1
        path_rem = os.path.join(os.getcwd()+'/SDV_REL/generated_files/'+model_name+"_"+str(num_rows)+".zip")
        if os.path.exists(path_rem):
            os.remove(path_rem)
        make_archive(os.getcwd() + "/SDV_REL/relational_data_files", path_rem)
        datetime_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        azure_sql_conn.update_synthetic_data_list((datetime_now, "Completed", generated_id))
        return "Data Generated Successfully!"
    except Exception as e:
        print(e)
        datetime_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        azure_sql_conn.update_synthetic_data_list((datetime_now, "Failed", generated_id))
        return "Data generation failed!"
