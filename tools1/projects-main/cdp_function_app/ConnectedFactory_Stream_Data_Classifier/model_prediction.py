
import numpy as np
import pandas as pd
try:
    from sklearn.externals import joblib
except:
    import joblib
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.pipeline import Pipeline
import os
import logging
import json
import pandas as pd
import dice_ml

def loadModel():
    logging.info("Loading the Model")
    model = joblib.load(os.path.dirname(os.path.abspath(__file__))+"/model_file/yieldPredictor.sav")
    logging.info("Model Loaded")
    return model


def load_couter_factual_model():
    model = joblib.load(os.path.dirname(os.path.abspath(__file__))+"/model_file/yieldPredictor.sav")
    return model, model.feature_names_in_.tolist()


def update_with_global_feature(pass_dataframe):
    global_feature_info = pd.read_json(os.path.dirname(os.path.abspath(__file__))+"/model_file/Model_Importance.json")
    df1 = pd.DataFrame(pass_dataframe.to_dict(orient="records"))
    df1["Sensor_ID"] = df1["Sensor_ID"].values.astype(str)
    # df1["CFs1"] = ''
    # df1["CFs2"] = ''
    df3 = pd.DataFrame(global_feature_info.to_dict(orient="records"))
    df3.rename(columns={"Imp": "Priority_Value", "FeatureName": "Sensor_ID"}, inplace=True)
    df3["Priority_Value"] = df3["Priority_Value"].apply(lambda x: x*1000)
    df3["Priority_Value"] = df3["Priority_Value"].values.astype(int)
    # df3["CFs1"] = ""
    # df3["CFs2"] = ""
    df3["Sensor_ID"] = df3["Sensor_ID"].values.astype(str)
    result = pd.merge(df1, df3[['Sensor_ID', "Priority_Value"]], on="Sensor_ID", how="left")
    result = result.fillna(0)
    # df1.loc[df1[col].isin(df3[col]), cols_to_replace] = df3.loc[df3[col].isin(df1[col]), cols_to_replace].values
    return result


def create_explanation(model, training_data, target='Pass/Fail'):
    cols = training_data.columns.tolist()
    cols = [col for col in cols if col not in ['Pass/Fail']]
    
    d1 = dice_ml.Data(dataframe=training_data, continuous_features=cols, outcome_name=target)
    m1 = dice_ml.Model(model=model, backend='sklearn')
    expln = dice_ml.Dice(d1, m1, method='genetic')
    logging.info("explanation created")
    return expln

def load_training_data(training_feat_data, training_label_data):
    df1 = pd.read_parquet(training_feat_data)
    df2 = pd.read_csv(training_label_data)
    col = ['Pass/Fail']
    df = pd.concat([df1, df2[col]], axis=1)
    return df

def getVals(x):
    ''' This function generates percentage change value compared to actuals data'''
    try:
        if x[0] != 0:
            value = float(((x[1]- x[0])/x[0])*100)

            if value == np.nan or value == np.inf:
                return 0
            else:
                return abs(value)
        else:
            return 0
    except Exception as e:
        print(e)
        return 0 


def generate_explanation(expln, data, colList,  impfeatList, directory, index=0):
    data1 = data[colList].copy()
    mssingValueDict = loadMissingValue()
    data1 = data1.fillna(mssingValueDict)  
    expln_val = expln.generate_counterfactuals(data1.iloc[index:index+1, :], features_to_vary=impfeatList, total_CFs=2, proximity_weight=1.5, diversity_weight=1.0, desired_class='opposite')
    df_expln_selected = expln_val.cf_examples_list[0].final_cfs_df
    df_expln_selected2 = df_expln_selected[impfeatList].reset_index(drop=True)
    # print(df_expln_selected2)

    
    df_data = data1.iloc[index:index+1, :][impfeatList].transpose()
    df_data.rename(columns={index: 'Actuals'}, inplace=True)
    df_cfs = df_expln_selected2.transpose()
    df_cfs.rename(columns={0: 'CFs_1', 1: 'CFs_2'}, inplace=True)

    df_data = pd.concat([df_data, df_cfs], axis=1)
    df_data['CFs_1_per'] = df_data[['Actuals', 'CFs_1']].apply(getVals, axis=1)
    df_data['CFs_2_per'] = df_data[['Actuals', 'CFs_2']].apply(getVals, axis=1)
    df_data.reset_index(drop=False, inplace=True)
    df_data.sort_values('CFs_1_per', ascending=False)
    return df_data


def load_feature_imp():
    df = pd.read_json(os.path.dirname(os.path.abspath(__file__))+"/model_file/Model_Importance.json", dtype='str')
    df['Imp'] = df['Imp'].astype('float')
    feat_list = df[df['Imp']>0.0]['FeatureName'].unique().tolist()
    return feat_list


def get_local_features(fail_dataframe):
    model, colList  = load_couter_factual_model()
    data = load_training_data(os.path.dirname(os.path.abspath(__file__))+'/model_file/train_feat_ovs.parquet', os.path.dirname(os.path.abspath(__file__))+'/model_file/train_label_ovs.csv')
    expln = create_explanation(model, data)
    feat_list = load_feature_imp()
    conter_factual_df = generate_explanation(expln, fail_dataframe, colList, feat_list, '', index=0)
    return conter_factual_df


def update_with_local_feature(fail_dataframe, counter_factual_df):
    df1 = pd.DataFrame(fail_dataframe.to_dict(orient="records"))
    df1["Sensor_ID"] = df1["Sensor_ID"].values.astype(str)
    df3 = pd.DataFrame(counter_factual_df.to_dict(orient="records"))
    df3.rename(columns={"CFs_1_per": "Priority_Value", "index": "Sensor_ID", "CFs_1":"CFs1", "CFs_2":"CFs2"}, inplace=True)
    df3["Priority_Value"] = df3["Priority_Value"].values.astype(int)
    df3["Sensor_ID"] = df3["Sensor_ID"].values.astype(str)
    result = pd.merge(df1, df3[['Sensor_ID', "Priority_Value", "CFs1", "CFs2"]], on="Sensor_ID", how="left")
    result = result.fillna(0)
    # df1.loc[df1[col].isin(df3[col]), cols_to_replace] = df3.loc[df3[col].isin(df1[col]), cols_to_replace].values
    return result


def loadMissingValue():
    missingValueDict = joblib.load(os.path.dirname(os.path.abspath(__file__))+"/model_file/missingValue.sav")
    return missingValueDict


def predictJson(data):
    try:
        targetName='Prediction'
        model = loadModel()
        x = pd.read_json(data.to_json())
        logging.info("Prediction Initiated")
        mssingValueDict = loadMissingValue()
        x2 = x[model.feature_names_in_.tolist()].fillna(value=mssingValueDict).copy()
        pred = model.predict(x2)
        x[targetName] = pred
        output = x        
        return(output)
    except KeyError as e:
        output = {"status":"FAIL","message":str(e).strip('"')}
        print("predictions:",json.dumps(output))
        return (json.dumps(output))
    except Exception as e:
        output = {"status":"FAIL","message":str(e).strip('"')}
        print("predictions:",json.dumps(output))
        return (json.dumps(output))

# if __name__ == "__main__":
#     model  = loadModel(os.path.dirname(os.path.abspath(__file__))+"/model_file/yieldPredictor.sav")

#     print(model)
#     predictJson(model, 'model/training/test.json', 'model/output/result.json', targetName='Prediction')
