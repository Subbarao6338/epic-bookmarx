import json
import os
import csv
from datetime import datetime
import psycopg2
from psycopg2 import Error
import configparser

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")

config_parser = configparser.ConfigParser()
config_parser.read(os.path.join(config_path, "database.ini"))

cwdPath = os.path.abspath(os.getcwd())
OutputCSVDir = os.path.join(cwdPath, "OutputCSV")
if not os.path.isdir(OutputCSVDir):
    os.makedirs(OutputCSVDir)

def create_connection():
    conn = None
    host = config_parser.get("postgresql", "host")
    database = config_parser.get("postgresql", "database")
    user = config_parser.get("postgresql", "user")
    password = config_parser.get("postgresql", "password")
    port = config_parser.get("postgresql", "port")
    try:
        conn = psycopg2.connect(dbname=database, user=user, password=password, host=host, port=port)
    except Error as e:
        print(e)
    return conn

def execute_query(sql, args):
    try:
        conn = create_connection()
        cur = conn.cursor()
        if args == "":
            cur.execute(sql)
        else:
            cur.execute(sql, (args,))
        result = cur.fetchall()
        columns = cur.description
        data = []
        for row in result:
            temp = {}
            for i in range(len(columns)):
                temp[columns[i].name] = str(row[i])
            data.append(temp)
        conn.commit()
        conn.close()
        return json.dumps(data)
        
    except Error as e:
        print(e)

def get_task_list():
    try:
        sql = """SELECT task_name, task_description, training_type, status FROM regex_tasks"""
        result_data = execute_query(sql, '')
        return result_data
    except Error as e:
        print(e)


def get_task_status(task_name):
    try:
        print(task_name)
        sql = "SELECT task_name, status FROM regex_tasks where task_name='" + task_name+ "'"
        result_data = execute_query(sql, '')
        print(result_data)
        return result_data
    except Error as e:
        print(e)


def get_job_status(jobid):
    try:
        sql = """select "Id" as "JobId", selected_task_name as "JobName","Status" as "JobStatus" from logvalidationdtl where "Id"=""" + str(jobid)
        result_data = execute_query(sql, args="")
        return result_data
    except Error as e:
        print(e)

def create_validation_job(taskname):
    try:
        conn = create_connection()
        cur = conn.cursor()
        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        query = """INSERT INTO logvalidationdtl("CreatedDate","TaskName") VALUES (%s,%s); """
        data = (dt_string, taskname)
        cur.execute(query, data)
        conn.commit()
        object_id = cur.lastrowid
        print(object_id)
        conn.close()
        return object_id
    except Error as e:
        print(e)

def get_task_generated_regex(task_name):
    try:
        print(task_name)
        sql = "SELECT task_name,results,log_delimiter FROM regex_tasks where task_name='" + task_name+ "'"
        result_data = execute_query(sql, '')
        print(result_data)
        return result_data
    except Error as e:
        print(e)


def save_logval_taskdtl(dt_string, filepath, taskname, tagnames, regexvalue, status, tasktype, selected_task_name,
                        result_type, log_delimiter):
    try:
        conn = create_connection()
        cur = conn.cursor()
        query = """INSERT INTO logvalidationdtl("CreatedDate", "FilePath", "TaskName","TagNames", "RegExValue", "Status", 
        "TaskType", selected_task_name, result_type, log_delimiter) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s); """

        data = (dt_string, filepath, taskname, tagnames, regexvalue, status, tasktype, selected_task_name, result_type,
                log_delimiter)
        cur.execute(query, data)
        conn.commit()
        object_id = cur.lastrowid
        conn.close()
        return object_id
    except Error as e:
        print(e)


def get_log_validation_by_id(task_id):
    try:
        sql = """select selected_task_name, result_type, log_delimiter from logvalidationdtl where "Id"="""+str(task_id)
        result_data = execute_query(sql, args="")
        return result_data
    except Error as e:
        print(e)

def update_task_status(taskid, status):
    try:
        conn = create_connection()
        cur = conn.cursor()
        # sql = """select * from logvalidationdtl where Id = {id}""".format(id=id)
        sql = """Update logvalidationdtl set "Status"= %s where "Id"= %s"""
        data = (status, taskid)
        cur.execute(sql, data)
        conn.commit()
        conn.close()
        sql = """select "Id", "TaskName", "Status" from logvalidationdtl where "Id"=""" + str(taskid)
        result_data = execute_query(sql, args="")
        return result_data
    except Error as e:
        print(e)

def get_validation_task_list():
    try:
        sql = """SELECT "Id" as validation_task_id, "TaskName" as validation_task_name, "Status" as status, selected_task_name as training_name, 
        result_type as training_type  FROM logvalidationdtl """
        result_data = execute_query(sql, '')
        return result_data
    except Error as e:
        print(e)


def get_validation_result_by_id(task_id):
    try:
        sql = """SELECT "FilePath" FROM logvalidationdtl WHERE "Id"='"""+str(task_id)+"""'"""
        result_data = execute_query(sql, '')
        json_result = json.loads(result_data)
        log_file_name = json_result[0]["FilePath"]
        result_file_name = log_file_name.split('.')[0]
        response_data = []
        csv_file_path = os.path.join(OutputCSVDir, result_file_name + '.csv')
        with open(csv_file_path, encoding='utf-8') as csvf:
            csv_reader = csv.DictReader(csvf)
            for rows in csv_reader:
                response_data.append(rows)
        return response_data
    except Error as e:
        print(e)
