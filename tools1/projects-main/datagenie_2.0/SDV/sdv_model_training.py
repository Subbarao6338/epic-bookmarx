from calendar import c
import glob
import math
from parser import ParserError
from random import sample

import pandas as pd
import os
import warnings
import datetime
import cloudpickle

from sdv.tabular import GaussianCopula, CTGAN, CopulaGAN, TVAE
from Utility import connect_azure_sql as azure_sql_conn
from datetime import datetime
import sys

warnings.filterwarnings("ignore")

cwdPath = os.path.abspath(os.getcwd())
sdv_path = os.path.join(cwdPath, "SDV")

def get_transformer_by_dtype(train_df):
    trans_dict = {}
    for col in train_df:
        data_type = train_df[col].dtype.name
        if 'int' in data_type:
            trans_dict[col] = 'integer'
        elif 'float' in data_type:
            trans_dict[col] = 'float'
        elif 'bool' in data_type:
            trans_dict[col] = 'boolean'
        elif 'datetime' in data_type:
            trans_dict[col] = 'datetime'
        elif 'object' in data_type:
            try:
                pd.to_datetime(train_df[col].head(10))
                trans_dict[col] = 'datetime'
            except(ParserError, ValueError, OverflowError):
                # trans_dict[col] = 'categorical'
                pass
        else:
            trans_dict[col] = 'categorical'
    return trans_dict


def single_table_sdv_model_training(file_path, model_name, model_type, batch_size, epoch_size):
    # checking if file format is valid or not
    if file_path.endswith(".csv"):
        train_df = pd.read_csv(file_path)
    elif file_path.endswith(".json"):
        train_df = pd.read_json(file_path)
        train_df = pd.json_normalize(train_df.to_dict("records"))
    else:
        raise ValueError("Invalid train file format")

    train_file = os.path.basename(file_path)

    # train_df = train_df.head(100)  # trimming training data to reduce time
    sdv_model_id = azure_sql_conn.insert_sdv_model((train_file, model_name + ".pkl", "in-progress"))
    try:
        field_trans_dict = get_transformer_by_dtype(train_df)
        exec(open(os.path.join(sdv_path, 'constraints_data.txt')).read())
        constraints = eval('return_constraints()')
        # sys.stdout = open("model_name.txt", "w")
        sys.stdout = open(model_name+".txt", "w")
        if model_type == 'GaussianCopula':
            model = GaussianCopula(field_transformers=field_trans_dict, constraints=constraints)
        elif model_type == 'CopulaGAN':
            model = CopulaGAN(field_transformers=field_trans_dict, cuda=True,
                              verbose=True, batch_size=int(batch_size), epochs=int(epoch_size), constraints=constraints)
        elif model_type == 'TVAE':
            model = TVAE(field_transformers=field_trans_dict, epochs=int(epoch_size), batch_size=int(batch_size),
                         constraints=constraints)
        else:
            model = CTGAN(verbose=True, cuda=False, batch_size=int(batch_size), epochs=int(epoch_size),
                          field_transformers=field_trans_dict, constraints=constraints)

        model.fit(train_df)
        sys.stdout.close()
        sample_df = model.sample(num_rows=100)
        sample_df.to_csv("SDV/new_files/new_" + train_file, index=False)
        #model.save("SDV/sdv_models/" + model_name + ".pkl")
        with open("SDV/sdv_models/" + model_name + ".pkl", 'wb') as f:
            cloudpickle.dump(model, f)
        datetime_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        azure_sql_conn.update_sdv_model((datetime_now, "completed", sdv_model_id))
        # try:
        #     os.remove("./" + bmodel_name + ".txt")
        # except:
        #     None
        return "model saved successfully"
    except Exception as e:
        datetime_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        azure_sql_conn.update_sdv_model((datetime_now, "failed", sdv_model_id))
        return "model generation failed"


def generate_sdv_data(model_path, sel_model_name, num_rows, data_type):
    model_name = sel_model_name.split(".")[0]
    datetime_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    generated_id = azure_sql_conn.insert_synthetic_data_list(
        (model_name, data_type, sel_model_name, num_rows, "In Progress", datetime_now))
    model_name = sel_model_name.split(".")[0]
    file_name = azure_sql_conn.get_file_name_for_model(sel_model_name)
    file_type = file_name.split('.')[1]
    try:
        loaded = GaussianCopula.load(model_path)
        if num_rows > 500000:
            div_part = num_rows / 500000
            div_part = math.ceil(div_part)
            num, div = num_rows, int(div_part)
            supported_rownum_list = [num // div + (1 if x < num % div else 0) for x in range(div)]
            count = 0
            for num in supported_rownum_list:
                gen_df = loaded.sample(num_rows=num)
                gen_df.to_csv("SDV/splited_files/" + model_name + "_" + str(num) + "_" + str(count) + ".csv", index=False)
                count = count + 1
            splited_file_path = "SDV/splited_files/"
            all_filenames = glob.glob(os.path.join(splited_file_path, "*.csv"))
            combined_csv = pd.concat([pd.read_csv(f) for f in all_filenames])
            combined_csv.to_csv("SDV/generated_files/" + model_name + "_" + str(num_rows) + ".csv", index=False)
            for f in all_filenames:
                os.remove(f)
        else:
            
            sample_df = loaded.sample(num_rows=num_rows)
            if file_type == "csv":
                sample_df.to_csv("SDV/generated_files/" + model_name + "_" + str(num_rows) + ".csv", index=False)
            else:
                sample_df.to_json("SDV/generated_files/" + model_name + "_" + str(num_rows) + ".json", orient="records")
        datetime_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        azure_sql_conn.update_synthetic_data_list((datetime_now, "Completed", generated_id))
        return "Data Generated successfully !!"
    except Exception as e:
        datetime_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        azure_sql_conn.update_synthetic_data_list((datetime_now, "Completed", generated_id))
        return "Data generation failed !!"





# def generate_sdv_data(model_path, sel_model_name, num_rows, data_type):
#     model_name = sel_model_name.split(".")[0]
#     datetime_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#     generated_id1 = azure_sql_conn.insert_synthetic_data_list(
#         (model_name, data_type, sel_model_name, num_rows, "In Progress", datetime_now))
#     model_name = sel_model_name.split(".")[0]
#     file_name = azure_sql_conn.get_file_name_for_model(sel_model_name)
#     file_type = file_name.split('.')[1]
    
#     try:
#         loaded = GaussianCopula.load(model_path)
#         if num_rows > 1000:
#             div_part = num_rows / 1000
#             div_part = math.ceil(div_part)
#             num, div = num_rows, int(div_part)
#             supported_rownum_list = [num // div + (1 if x < num % div else 0) for x in range(div)]
#             count = 0
           
#             for num in supported_rownum_list:
#                 gen_df = loaded.sample(num_rows=num)
#                 gen_df.to_csv("SDV/splited_files/" + model_name + "_" + str(num) + "_" + str(count) + ".csv", index=False)
#                 count = count + 1
#             splited_file_path = "SDV/splited_files/"
#             all_filenames = glob.glob(os.path.join(splited_file_path, "*.csv"))
#             combined_csv = pd.concat([pd.read_csv(f) for f in all_filenames])
#             combined_csv.to_csv("SDV/generated_files/" + model_name + "_" + str(num_rows) + ".csv", index=False)
#             for f in all_filenames:
#                 os.remove(f)
               
#         else:
            
#             sample_df = loaded.sample(num_rows=num_rows)
#             if file_type == "csv":
#                 sample_df.to_csv("SDV/generated_files/" + model_name + "_" + str(num_rows) + ".csv", index=False)
#             else:
#                 sample_df.to_json("SDV/generated_files/" + model_name + "_" + str(num_rows) + ".json", orient="records")
       







