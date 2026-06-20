"""Copyright"""
"""
* =============================================================================
* COPYRIGHT NOTICE
* =============================================================================
*  © Copyright HCL Technologies Ltd. 2021, 2022
* Proprietary and confidential. All information contained herein is, and
* remains the property of HCL Technologies Limited. Copying or reproducing the
* contents of this file, via any medium is strictly prohibited unless prior
* written permission is obtained from HCL Technologies Limited.
"""


import configparser
import json
import os
from datetime import datetime
from sqlalchemy.engine import URL
from sqlalchemy import create_engine

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")
config_parser = configparser.ConfigParser()
#print(os.path.join(config_path, "db_config.ini"))
config_parser.read(os.path.join(config_path, "db_config.ini"))


def connect_sql():
    TargetServer = config_parser.get("device_connection_info", "TargetServer")
    TargetDb = config_parser.get("device_connection_info", "TargetDb")
    UserName = config_parser.get("device_connection_info", "UserName")
    Password = config_parser.get("device_connection_info", "Password")

    # Configure the Connection
    connection_string = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=' + TargetServer + ';DATABASE=' + TargetDb + ';UID=' + UserName + ';PWD=' + Password
    connection_url = URL.create("mssql+pyodbc", query={"odbc_connect": connection_string})
    engine = create_engine(connection_url, echo=True)
    return engine


def file_content(title_name, file_name):
    connect_engine = connect_sql()
    conn = connect_engine.raw_connection()
    cursor = conn.cursor()
    #date=CAST(GETDATE() as date)
    query = """INSERT INTO [dbo].Anomaly_Input_Files (Title_Name,File_Name,Uploaded_Date,Datasource_type)
     VALUES(?,?,FORMAT(getdate(), 'yyyy-MM-dd hh:mm:ss'),'Local')"""
    cursor.execute(query, title_name, file_name)
    cursor.execute("SELECT @@IDENTITY AS ID;")
    title_id = cursor.fetchone()[0]
    cursor.commit()
    return title_id


def save_db_details(connection_str, json_body):
    title_name = json_body['title_name']
    db_type = json_body['database_type']
    selected_set = json_body['dataset_name']
    # print(json_body)
    if db_type== 'sqlite':
        path = json_body['db_path']     
        file_name = json.dumps({'Database':db_type, 'Table':selected_set,'path': path, 'connection_string':connection_str})
    elif db_type!= 'sqlite':
        username = json_body['username']
        # password = json_body['password']
        # host = json_body['host']
        # port = json_body['port']
        db_name = json_body['database_name']
        file_name = json.dumps({'Database':db_type, 'Table':selected_set,'db_name': db_name,  'user': username, 'connection_string':connection_str})
    
    # print(title_name, file_name)
    connect_engine = connect_sql()
    conn = connect_engine.raw_connection()
    cursor = conn.cursor()
    #date=CAST(GETDATE() as date)
    query = """INSERT INTO [dbo].Anomaly_Input_Files (Title_Name,File_Name,Uploaded_Date,Datasource_type)
     VALUES(?,?,getdate(),'Database')"""
    cursor.execute(query, title_name, file_name)
    cursor.execute("SELECT @@IDENTITY AS ID;")
    title_id = cursor.fetchone()[0]
    cursor.commit()
    return title_id


def save_kafka_details(title_name,kafka_body):
    # print(kafka_body)
    # kafka_host = kafka_body[0]
    # topic = kafka_body[1]
    # group_id = kafka_body[2]
    # conn_string = kafka_body[3]
    #file_name = json.dumps({'host': kafka_host, 'topic': topic, 'group_id': group_id, 'conn_string': conn_string})
    file_name=kafka_body
    # print(title_name, file_name)
    connect_engine = connect_sql()
    conn = connect_engine.raw_connection()
    cursor = conn.cursor()
    #date=CAST(GETDATE() as date)
    query = """INSERT INTO [dbo].Anomaly_Input_Files (Title_Name,File_Name,Uploaded_Date,Datasource_type)
     VALUES(?,?,getdate(),'Apache_Kafka')"""
    cursor.execute(query, title_name, file_name)
    cursor.execute("SELECT @@IDENTITY AS ID;")
    title_id = cursor.fetchone()[0]
    cursor.commit()
    return title_id


def get_files():
    connect_engine = connect_sql()
    data = []
    #query = """SELECT Title_Name,File_Name,Uploaded_Date,ID, Datasource_Type FROM [dbo].Anomaly_Input_Files ORDER BY ID DESC;"""
    query="""select [ID],[Title_Name],[Uploaded_Date],[Datasource_type],
     (case when Datasource_Type='Local' then SUBSTRING(File_Name,charindex('/',File_Name)+1,len(File_Name)) 
     else SUBSTRING(File_Name,2,53)
     end) as File_Name FROM [dbo].[Anomaly_Input_Files] ORDER BY ID DESC;"""
    results = connect_engine.execute(query)
    for row in results:
        # p=row[1].split("/")
        # print(p[-1])
        temp = {"Title_Name": row[1], "File_Name": row[4], "Uploaded_Date": row[2], "ID": row[0], "Datasource_Type":row[3]}
        data.append(temp)
    return data


def get_after_remove_file(value):
    connect_engine = connect_sql()
    data = []
    query1 = """DELETE FROM [dbo].Anomaly_Input_Files WHERE ID='""" + value + """';"""
    connect_engine.execute(query1)
    q="""DELETE FROM [dbo].Anomaly_Detection_Form WHERE Result_JSON is null;"""
    connect_engine.execute(q)
    query2 = """SELECT Title_Name,File_Name,Uploaded_Date FROM [dbo].Anomaly_Input_Files;"""
    results = connect_engine.execute(query2)
    for row in results:
        temp = {"Title_Name": row[0], "File_Name": row[1], "Uploaded_Date": row[2]}
        data.append(temp)
    #print(data)
    return data


def get_file_path(anomaly_id):
    file_path = ""
    query2 = """SELECT File_Name, Datasource_type FROM [dbo].Anomaly_Input_Files WHERE ID = """+str(anomaly_id)+""";"""
    connect_engine = connect_sql()
    results = connect_engine.execute(query2)
    for row in results:
        file_path = row[0]
        type = row[1]
    return [file_path, type]


def save_anomaly(anomaly_id,anomaly_type,anomaly_interval,anomaly_params,date_param,model_name,Input_Type):
    connect_engine = connect_sql()
    conn = connect_engine.raw_connection()
    cursor = conn.cursor()
    q = """DELETE FROM [dbo].Anomaly_Detection_Form WHERE Result_JSON is null;"""
    connect_engine.execute(q)
    query = """INSERT INTO [dbo].Anomaly_Detection_Form (Anomaly_ID,Anomaly_Type,Anomaly_Interval,Anomaly_Parameters,Timeseries_Parameter,Model_Name,Input_Type) 
    VALUES(?,?,?,?,?,?,?)"""
    cursor.execute(query, anomaly_id, anomaly_type, anomaly_interval, anomaly_params, date_param,model_name,Input_Type)
    cursor.execute("SELECT @@IDENTITY AS ID;")
    form_id = cursor.fetchone()[0]
    cursor.commit()
    return form_id


def anomaly_form():
    connect_engine = connect_sql()
    data = []
    query = """select i.Title_Name,f.Anomaly_Type,f.Anomaly_Interval,f.Anomaly_Parameters,f.Timeseries_Parameter,
    f.Result_JSON,f.ID from dbo.Anomaly_Detection_Form f inner join dbo.Anomaly_Input_Files i on f.Anomaly_ID = i.ID
    where f.Model_Name is null or f.Model_Name='' and f.Result_JSON is not null order by f.ID desc;"""
    results = connect_engine.execute(query)
    for row in results:
        temp = {}
        temp["Anomaly_ID"] = row[0]
        temp["Anomaly_Type"] = row[1]
        temp["Anomaly_Interval"] = row[2]
        temp["Anomaly_Parameters"] = row[3]
        temp["Timeseries_Parameter"] = row[4]
        temp["Result_JSON"] = row[5]
        temp['ID'] = row[6]
        data.append(temp)
    #print(data)
    return data


def graviton_table():
    connect_engine = connect_sql()
    data = []
    query = """select i.Title_Name, f.Anomaly_Parameters,f.Timeseries_Parameter,f.Model_Name,f.Result_JSON,f.ID,f.Input_Type 
    from dbo.Anomaly_Detection_Form f inner join dbo.Anomaly_Input_Files i on f.Anomaly_ID = i.ID
    where f.Model_Name is not null and f.Model_Name!=''and f.Result_JSON is not null order by f.ID desc;"""
    results = connect_engine.execute(query)
    for row in results:
        temp = {}
        temp["Anomaly_ID"] = row[0]
        temp['Model_Name'] = row[3]
        temp["Anomaly_Parameters"] = row[1]
        temp["Timeseries_Parameter"] = row[2]
        temp["Result_JSON"] = row[4]
        temp['ID'] = row[5]
        temp['Input_Type']=row[6]
        data.append(temp)
    return data


def update_results(form_id,json_data, total_row_count, anomaly_row_count):
    connect_engine = connect_sql()
    sql = """Update [dbo].Anomaly_Detection_Form set Anomaly_Row_Count='"""+str(anomaly_row_count)+"""' ,
    Total_Row_Count='"""+str(total_row_count)+"""' ,Result_JSON='"""+json_data+"""' where ID='"""+str(form_id)+"""'"""
    connect_engine.execute(sql)
    return "success"


def view_anomaly(value):
    connect_engine = connect_sql()
    data = {}
    query1 = """SELECT Result_JSON,Anomaly_Parameters,Anomaly_ID,Timeseries_Parameter,Model_Name,Input_Type
     FROM [dbo].Anomaly_Detection_Form WHERE ID=""" + str(value) + """;"""
    results = connect_engine.execute(query1)
    for row in results:
        param = row[1]
        anomaly_id = row[2]
        timeseries_param = row[3]
        model=row[4]
        input_type=row[5]
        #print(row[0])
        if row[0]== '''"No anomalies were detected in the time series."''':
            data = json.loads(row[0])
        else:
            ls = json.loads(row[0])
            temp = []
            for val in ls:
                keys = list(val.keys())
                values = list(val.values())
                temp_dict = {}
                for i in range(len(keys)):
                    if keys[i]== 'value':
                        temp_dict[param] = values[i]
                    else:
                        temp_dict[keys[i]]= values[i]
                temp.append(temp_dict)
            data = temp
    # print(param)
    return [data, param, anomaly_id, timeseries_param,input_type]


def get_setting_values():
    connect_engine = connect_sql()
    data = {}
    query1 = """SELECT * FROM [dbo].AnomalyServiceConfig;"""
    results = connect_engine.execute(query1)
    for row in results:
        data['service_type'] = row[1]
        data['subscription_key'] = row[2]
        data['ad_endpoint'] = row[3]
    return data


def update_anomaly(anomaly_services, subscription_key, ad_endpoint):
    connect_engine = connect_sql()
    conn = connect_engine.raw_connection()
    cursor = conn.cursor()
    query1 = """select count (*) from [dbo].AnomalyServiceConfig"""
    cursor.execute(query1)
    count = cursor.fetchall()[0][0]
    if count==0:
        query = """INSERT INTO [dbo].AnomalyServiceConfig (AnomalyServiceType, SUBSCRIPTION_KEY,ANOMALY_DETECTOR_ENDPOINT)
         VALUES(?,?,?)"""
        cursor.execute(query, [anomaly_services, subscription_key, ad_endpoint])
    if count==1:
        query = """Update [dbo].AnomalyServiceConfig set AnomalyServiceType='"""+anomaly_services+"""',
         SUBSCRIPTION_KEY='""" + subscription_key + """', ANOMALY_DETECTOR_ENDPOINT='""" + ad_endpoint + """' where id=1"""
        cursor.execute(query)
    cursor.commit()
    return "Success"


def settings_anomaly_service():
    connect_engine = connect_sql()
    conn = connect_engine.raw_connection()
    cursor = conn.cursor()
    query1 = """select * from [dbo].AnomalyServiceConfig"""
    cursor.execute(query1)
    anamoly_service_type = cursor.fetchall()[0][1]
    return {"anomaly_service_type": anamoly_service_type}


def dataset_counts():
    connect_engine = connect_sql()
    data = {}
    query1 = """select Datasource_type,sum(Total_Row_Count) as Total_Row_Count ,sum(Anomaly_Row_count) as Anomaly_Row_count
     FROM [dbo].[Anomaly_Input_Files] INNER JOIN [dbo].[Anomaly_Detection_Form] ON [dbo].[Anomaly_Input_Files].[ID]=Anomaly_ID
      GROUP BY Datasource_type;"""
    # q="""SELECT b.Datasource_type,sum(a.[Total_Row_Count]),sum(a.[Anomaly_Row_count]) FROM [dbo].[Anomaly_Detection_Form] as a inner join [dbo].[Anomaly_Input_Files] as b on a.Anomaly_ID=b.ID group by Datasource_type"""
    results = connect_engine.execute(query1)
    # print(results)
    #temp_count = []
    data = {}
    for row in results:
        #temp_count.append(row[0])
        temp = {}
        temp['Total_Row_Count'] = row[1]
        temp['Anomaly_Row_count'] = row[2]
        data[row[0]] = temp
    # print(data)
    return data


def chart_classification():
    connect_engine = connect_sql()
    sql1 = """select sum(Total_Row_Count) from [dbo].[Anomaly_Detection_Form];"""
    sql2 = """select sum(Anomaly_Row_count) from [dbo].[Anomaly_Detection_Form];"""
    results1 = connect_engine.execute(sql1)
    results2 = connect_engine.execute(sql2)
    data = {}
    for row in results1:
        # print("count:>>",row[0])
        data['Total_Row_Count'] = row[0]

    for row in results2:
        data['Anomaly_Row_count'] = row[0]
    # print(data)
    return data


def get_kafka():
    connect_engine = connect_sql()
    sql = """SELECT [File_Name],[ID] FROM [dbo].[Anomaly_Input_Files] where Datasource_type='Apache_Kafka';"""
    results = connect_engine.execute(sql)
    data = {}
    for row in results:
        data = json.loads(row[0])
        data.update({'ID':row[1]})
    return data
