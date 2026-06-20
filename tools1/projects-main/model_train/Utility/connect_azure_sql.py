import configparser
import json
import os

from sqlalchemy.engine import URL
from sqlalchemy import create_engine

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")

config_parser = configparser.ConfigParser()
print(os.path.join(config_path, "eventhub_config.ini"))
config_parser.read(os.path.join(config_path, "eventhub_config.ini"))

hub_status = 'Active'
setting_table_name = "setting_values"


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


def get_device_count_from_metadata():
    connect_engine = connect_sql()
    device_count = 0
    sql_statement = 'SELECT count(*) FROM [dbo].[tblDeviceInfo] where Device_Name not like ?'
    results = connect_engine.execute(sql_statement, "Node%")
    for row in results:
        device_count = row[0]
    return device_count


# def get_hub_name_details(simulator_type):
#     hub_names = []
#     connect_engine = connect_sql()
#
#     sql_statement = 'SELECT hub_name from [dbo].[Hub_Connection] where hub_status=? and hub_type =?'
#     results = connect_engine.execute(sql_statement, hub_status, simulator_type)
#     for row in results:
#         hub_names.append(row[0])
#     return hub_names


def get_hub_connection_details():
    connect_engine = connect_sql()
    data = {}
    # sql_statement = 'SELECT hub_name, hub_connection_string, hub_type, hub_status from [dbo].[Hub_Connection] where ' \
    #                 'hub_status=? and hub_type=? and hub_name=? '

    sql_statement = 'select iot_hub_name,iot_connection_string,event_hub_name,event_hub_connection_string,aws_access_key,aws_secret_key,aws_region,aws_stream_name from [dbo].[' + setting_table_name + ']'
    results = connect_engine.execute(sql_statement)
    for row in results:
        data['iot_hub_name'] = row[0]
        data['iot_connection_string'] = row[1]
        data['event_hub_name'] = row[2]
        data['event_hub_connection_string'] = row[3]
        data['aws_access_key'] = row[4]
        data['aws_secret_key'] = row[5]
        data['aws_region'] = row[6]
        data['aws_stream_name'] = row[7]

    return json.dumps(data)


def get_settings_count():
    connect_engine = connect_sql()
    count = 0
    sql_statement = 'SELECT count(*) from [dbo].[' + setting_table_name + ']'
    results = connect_engine.execute(sql_statement)
    for row in results:
        count = row[0]
    return count


def insert_setting_details(obj):
    connect_engine = connect_sql()
    count = get_settings_count()
    print(count)

    obj_data = json.loads(obj)
    file_obj = (obj_data["azure_subscription_id"], obj_data["iot_hub_name"], obj_data["iot_connection_string"],
                obj_data["event_hub_name"], obj_data["event_hub_connection_string"],
                obj_data["azure_storage_connection_string"], obj_data["sdv_model_name"],
                obj_data["msg_template"], obj_data["aws_access_key_id"],
                obj_data["aws_secret_key_id"], obj_data["aws_region"],
                obj_data["aws_stream_name"])

    if count == 0:
        sql = 'Insert into [dbo].[' + setting_table_name + '] (azure_subscription_id,iot_hub_name,iot_connection_string,event_hub_name,event_hub_connection_string,azure_storage_connection_string,sdv_model_name,msg_template,aws_access_key,aws_secret_key,aws_region,aws_stream_name ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
    else:
        sql = 'Update [dbo].[' + setting_table_name + '] set azure_subscription_id =?, iot_hub_name=?, iot_connection_string=?, event_hub_name=?, event_hub_connection_string=?, azure_storage_connection_string=?, sdv_model_name=?, msg_template=?, aws_access_key=?, aws_secret_key=?, aws_region=?, aws_stream_name=?'
    object_id = connect_engine.execute(sql, file_obj)
    return object_id


def get_setting_details():
    connect_engine = connect_sql()
    data = {}
    # sql_statement = 'create table if not exists [dbo].[' + setting_table_name + '] (id INTEGER PRIMARY KEY AUTOINCREMENT, azure_subscription_id varchar(100), iot_hub_name varchar(100), iot_connection_string varchar(100), event_hub_name varchar(100), event_hub_connection_string varchar(100), azure_sql_connection_string varchar(100), azure_storage_connection_string varchar(100), sdv_model_name varchar(100))'
    #
    # connect_engine.execute(sql_statement)

    select_table_sql = 'select azure_subscription_id,iot_hub_name,iot_connection_string,event_hub_name,event_hub_connection_string,azure_storage_connection_string,sdv_model_name,msg_template,aws_access_key,aws_secret_key,aws_region,aws_stream_name from [dbo].[' + setting_table_name + ']'
    results = connect_engine.execute(select_table_sql)
    for row in results:
        data['azure_subscription_id'] = row[0]
        data['iot_hub_name'] = row[1]
        data['iot_connection_string'] = row[2]
        data['event_hub_name'] = row[3]
        data['event_hub_connection_string'] = row[4]
        data['azure_storage_connection_string'] = row[5]
        data['sdv_model_name'] = row[6]
        data['msg_template'] = row[7]
        data['aws_access_key'] = row[8]
        data['aws_secret_key'] = row[9]
        data['aws_region'] = row[10]
        data['aws_stream_name'] = row[11]
    return json.dumps(data)


def get_hub_name_details(cloud_service_type):
    connect_engine = connect_sql()
    data = {}
    if cloud_service_type == "Event Hub":
        select_table_sql = 'select event_hub_name from [dbo].[' + setting_table_name + ']'
    elif cloud_service_type == "IoT Hub":
        select_table_sql = 'select iot_hub_name from [dbo].[' + setting_table_name + ']'
    else:
        select_table_sql = 'select aws_stream_name from [dbo].[' + setting_table_name + ']'

    results = connect_engine.execute(select_table_sql)
    res = []
    for row in results:
        res.append(row[0])
    return res


def save_json_content(template_name, json_file):
    connect_engine = connect_sql()
    conn = connect_engine.raw_connection()
    cursor = conn.cursor()
    query = """INSERT INTO Message_Template (Template_Name,JSON,IsActive,CreatedOn,UpdatedOn) VALUES(?,?,?,
    getdate(),getdate())"""
    cursor.execute(query, template_name, json_file, True)
    cursor.execute("SELECT @@IDENTITY AS ID;")
    template_id = cursor.fetchone()[0]
    cursor.commit()
    return template_id


def save_json_content_property(propertyType, propertyName, string_value, prop_value_from, prop_value_To, template_id):
    connect_engine = connect_sql()
    query = """INSERT INTO Template_Property_Details (PropertyName,PropertyType,Prop_Value,Prop_Value_From,
    Prop_Value_To, TemplateID,CreatedOn,UpdatedOn) VALUES(?,?,?,?,?,?,getdate(),getdate()); """
    results = connect_engine.execute(query, propertyName, propertyType, string_value, prop_value_from, prop_value_To,
                                     template_id)
    print(results)
    return 'inserted successfully'


def get_template_list():
    connect_engine = connect_sql()
    data = []
    query = """SELECT Template_Name FROM [dbo].Message_Template;"""
    results = connect_engine.execute(query)
    for row in results:
        data.append(row[0])
    return data


def get_after_remove_template_model(value):
    connect_engine = connect_sql()
    data = []
    query1 = """DELETE FROM [dbo].Template_Property_Details WHERE TemplateID=""" + value + """;"""
    connect_engine.execute(query1)
    query2 = """DELETE FROM [dbo].Message_Template WHERE ID=""" + value + """;"""
    connect_engine.execute(query2)
    return get_template_models()


def get_complete_json(value):
    connect_engine = connect_sql()
    data = []
    query1 = """SELECT JSON FROM [dbo].Message_Template WHERE ID=""" + str(value) + """;"""
    results = connect_engine.execute(query1)
    for row in results:
        temp = {}
        temp["Json"] = row[0]
        data.append(temp)
        print(data)
    return data


# get_template_model
def get_template_models():
    connect_engine = connect_sql()
    data = []
    query = """SELECT Template_Name,JSON,ID FROM [dbo].Message_Template;"""
    results = connect_engine.execute(query)
    for row in results:
        temp = {}
        temp["TemplateName"] = row[0]
        temp["Json"] = row[1]
        temp["TemplateId"] = row[2]
        data.append(temp)
    print(data)
    return data


def fetch_template_content():
    connect_engine = connect_sql()
    response = []
    query = """SELECT PropertyName,PropertyType,Prop_Value,CAST(Prop_Value_From as INTEGER),
    CAST(Prop_Value_To as INTEGER), TemplateID from Template_Property_Details where 
    TemplateID in (select TOP(1) ID from Message_Template where Template_Name in 
    (select TOP (1) msg_template from setting_values order by id DESC)) ORDER BY ID ASC"""
    results = connect_engine.execute(query)
    for row in results:
        data = {}
        data['property_name'] = row[0]
        data['property_type'] = row[1]
        data['property_value'] = row[2]
        data['property_value_from'] = row[3]
        data['property_value_to'] = row[4]
        data['template_id'] = row[5]
        response.append(data)

    return response


def get_template_list_with_ID():
    connect_engine = connect_sql()
    data = {}
    query = """SELECT ID, Template_Name FROM [dbo].Message_Template;"""
    results = connect_engine.execute(query)
    print("My data :   ")
    for row in results:
        print(row[0], row[1])
        data[str(row[1])] = row[0]
    print(data)
    return data


def get_schema_detail_by_id(template_id):
    connect_engine = connect_sql()
    list_detail = []
    query = """SELECT PropertyName, PropertyType FROM [dbo].Template_Property_Details WHERE TemplateID='""" + str(
        template_id) + """';"""
    results = connect_engine.execute(query)
    print("View data :   ")
    for row in results:
        data = {'property_name': row[0], 'property_type': row[1]}
        list_detail.append(data)
    print(json.dumps(list_detail))
    return json.dumps(list_detail)


def insert_sdv_model(data):
    connect_engine = connect_sql()
    sql = """insert into [dbo].sdv_models (train_file, sdv_model, status) values(?,?,?)"""
    response = connect_engine.execute(sql, data)
    response = connect_engine.execute("SELECT id from [dbo].sdv_models;")
    max = 0
    for row in response:
        if row[0] > max:
            max = row[0]
    return max

def check_duplicate_model_name(model_name):
    connect_engine = connect_sql()
    sql="""SELECT TOP 1 1 FROM [dbo].sdv_models WHERE sdv_model = ?;"""
    response = connect_engine.execute(sql, model_name).fetchone()
    print(model_name,"----------",response)
    return response



def update_sdv_model(data):
    connect_engine = connect_sql()
    sql = """Update [dbo].sdv_models set end_time=?,status=? where id=?"""
    response = connect_engine.execute(sql, data)
    return response


def get_sdv_models(data=None):
    connect_engine = connect_sql()
    sql = """select * from [dbo].sdv_models order by id desc"""
    response = connect_engine.execute(sql)
    columns = ['id', 'start_time', 'train_file', 'sdv_model', 'end_time', 'status']
    data = []
    for record in response:
        data.append(dict(zip(columns, record)))
    return data


def get_sdv_models_drop(data=None):
    connect_engine = connect_sql()
    sql = """select * from [dbo].sdv_models where status='completed' order by id desc"""
    response = connect_engine.execute(sql)
    columns = ['id', 'start_time', 'train_file', 'sdv_model', 'end_time', 'status']
    data = []
    for record in response:
        data.append(dict(zip(columns, record)))
    return data


def insert_rel_sdv_model(data):
    connect_engine = connect_sql()
    sql = """insert into [dbo].rel_sdv_models (meta_file, sdv_model, status) values(?,?,?)"""
    response = connect_engine.execute(sql, data)
    response = connect_engine.execute("SELECT id from [dbo].rel_sdv_models;")
    max = 0
    for row in response:
        if row[0] > max:
            max = row[0]
    return max


def update_rel_sdv_model(data):
    connect_engine = connect_sql()
    sql = """Update [dbo].rel_sdv_models set end_time=?,status=? where id=?"""
    response = connect_engine.execute(sql, data)
    return response


def get_rel_sdv_models(data=None):
    connect_engine = connect_sql()
    sql = """select * from [dbo].rel_sdv_models order by id desc"""
    response = connect_engine.execute(sql)
    columns = ['id', 'start_time', 'meta_file', 'sdv_model', 'end_time', 'status']
    data = []
    for record in response:
        data.append(dict(zip(columns, record)))
    return data


def get_rel_sdv_models_drop(data=None):
    connect_engine = connect_sql()
    sql = """select * from [dbo].rel_sdv_models where status='completed' order by id desc"""
    response = connect_engine.execute(sql)
    columns = ['id', 'start_time', 'meta_file', 'sdv_model', 'end_time', 'status']
    data = []
    for record in response:
        data.append(dict(zip(columns, record)))
    return data


def get_synthetic_data_list():
    connect_engine = connect_sql()
    data = []
    query = """SELECT sdg.Id,sdg.ModelName,sdg.ModelType,sdg.ModelFile,sdg.RecordCount,sdg.Status,sdg.StartTime,sdg.EndTime, ISNULL(sv.train_file,'') as train_file FROM 
    Synthetic_Data_Generation sdg LEFT OUTER JOIN sdv_models sv ON sdg.ModelFile = sv.sdv_model ORDER BY sdg.Id desc; """
    results = connect_engine.execute(query)
    for row in results:
        data_obj = {"Id": row[0], "ModelName": row[1], "ModelType": row[2], "ModelFile": row[3],
                    "RecordCount": row[4], "Status": row[5], "StartTime": row[6], "EndTime": row[7], "train_file":row[8]}
        data.append(data_obj)
    return data


def insert_synthetic_data_list(data):
    connect_engine = connect_sql()
    sql = """INSERT INTO Synthetic_Data_Generation(ModelName,ModelType,ModelFile,RecordCount,Status,StartTime) 
    values(?,?,?,?,?,?) """
    response = connect_engine.execute(sql, data)
    response = connect_engine.execute("SELECT id from [dbo].Synthetic_Data_Generation;")
    max = 0
    for row in response:
        if row[0] > max:
            max = row[0]
    return max


def update_synthetic_data_list(param):
    connect_engine = connect_sql()
    sql = """Update [dbo].Synthetic_Data_Generation set EndTime=?,Status=? where Id=?"""
    response = connect_engine.execute(sql, param)
    return response


def chk_if_data_already_exist(model_selected, row_numbers, data_type):
    connect_engine = connect_sql()
    list_detail = []
    query = """SELECT COUNT(Id) as already_exist FROM Synthetic_Data_Generation WHERE ModelFile='"""+model_selected+"""' AND RecordCount='"""+str(row_numbers)+"""' AND Status='Completed' AND ModelType='"""+data_type+"""'; """
    results = connect_engine.execute(query)
    print(query)
    for row in results:
        data = row[0]
    print(data)
    if int(data) > 0:
        return True
    else:
        return False

def dataset_counts():
    connect_engine = connect_sql()
    data = {}
    query1 = """SELECT (select count(*) from dbo.sdv_models where status='completed' ) as single_model_count,
        (select count(*)  from dbo.rel_sdv_models where status='completed') as rel_model_count,
        (select count(*) from dbo.Synthetic_Data_Generation where Status='Completed' and ModelType='Single') as single_model_generated ,
        (select count(*) from dbo.Synthetic_Data_Generation where Status='Completed' and ModelType='Relational') as multiple_model_generated
        ;"""
    results = connect_engine.execute(query1)
    #temp_count = []
    for row in results:
        #temp_count.append(row[0])
        data['single_model_count'] = row[0];
        data['rel_model_count'] = row[1];
        data['single_model_generated'] = row[2];
        data['multiple_model_generated'] = row[3];
    print(data)
    return data


def get_recent_sdv_models(data=None):
    connect_engine = connect_sql()
    sql = """select TOP(3) id,train_file, sdv_model from [dbo].sdv_models order by id desc"""
    response = connect_engine.execute(sql)
    columns = ['id', 'train_file', 'sdv_model']
    data = []
    for record in response:
        data.append(dict(zip(columns, record)))
    return data


def get_recent_rel_sdv_models(data=None):
    connect_engine = connect_sql()
    sql = """select TOP(3) id,meta_file,sdv_model from [dbo].rel_sdv_models where status='completed' order by id desc"""
    response = connect_engine.execute(sql)
    columns = ['id', 'meta_file', 'sdv_model']
    data = []
    for record in response:
        data.append(dict(zip(columns, record)))
    return data


def get_modal_list_by_type(dataset_type):
    connect_engine = connect_sql()
    if dataset_type == 'Relational':
        sql = """select sdv_model from [dbo].rel_sdv_models where status='completed'"""
    else:
        sql = """select sdv_model from [dbo].[sdv_models] where status='completed'"""
    response = connect_engine.execute(sql)
    data = []
    for record in response:
        modal_obj = {"modal_name": record[0]}
        data.append(modal_obj)
    return data


def remove_generated_record(generated_id):
    connect_engine = connect_sql()
    query1 = """DELETE FROM [dbo].[Synthetic_Data_Generation] WHERE Id=""" + generated_id + """;"""
    connect_engine.execute(query1)
    return True


def remove_single_sdv_model(model_name):
    connect_engine = connect_sql()
    query1 = """DELETE FROM [dbo].[sdv_models] WHERE sdv_model='""" + model_name + """';"""
    connect_engine.execute(query1)
    return True


def remove_relational_sdv_model(model_name):
    connect_engine = connect_sql()
    query1 = """DELETE FROM [dbo].[rel_sdv_models] WHERE sdv_model='""" + model_name + """';"""
    connect_engine.execute(query1)
    return True


# create table[dbo].[cloud_servicetype_details]([id][int] IDENTITY(1, 1) NOT NULL, [cloud_type][varchar](max) NULL, [cloud_service_type][varchar](max) NULL);
# insert into[dbo].[cloud_servicetype_details] values('Azure', 'Event Hub');
# insert into[dbo].[cloud_servicetype_details] values('Azure', 'IoT Hub');
# insert into[dbo].[cloud_servicetype_details] values('AWS', 'Kinesis');

def get_cloudtype_details():
    connect_engine = connect_sql()
    select_table_sql = '  select distinct(cloud_type) from [dbo].[cloud_servicetype_details] ;'
    results = connect_engine.execute(select_table_sql)
    res = []
    for row in results:
        res.append(row[0])
    print("Pavithran",res)
    return res

def get_cloudservicetype_details(cloud_type):
    connect_engine = connect_sql()
    select_table_sql = """ select cloud_service_type from [dbo].[cloud_servicetype_details] where cloud_type='""" + cloud_type + """'"""
    results = connect_engine.execute(select_table_sql)
    res = []
    for row in results:
        res.append(row[0])
    return res

def get_train_data_format(model_name):
    connect_engine = connect_sql()
    query11= """ select ModelName,ModelFile from[dbo].[ Synthetic_Data_Generation] Where Data_Generation='""" +model_name +"""' ; """
    with open('output.jsonl', 'w') as jsonfile:
         for i in JSON_file:
            json.dump(i, jsonfile)
            jsonfile.write('\n')
            print(i)
    connect_engine.execute(query11)
    return True


def get_file_name_for_model(model_name):
    connect_engine = connect_sql()
    select_table_sql = """SELECT train_file FROM [dbo].[sdv_models] WHERE sdv_model = '""" + model_name + """'"""
    results = connect_engine.execute(select_table_sql)
    res = []
    for row in results:
        res.append(row[0])
    return res[0]

def get_sdv_model_name():
    connect_engine = connect_sql()
    select_table_sql = 'SELECT sdv_model_name from [dbo].[setting_values];'
    results = connect_engine.execute(select_table_sql)
    res = []
    for row in results:
        # print(row[0])
        res.append(row[0])
    return res












