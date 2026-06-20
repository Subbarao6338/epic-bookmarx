import json
import os
from datetime import datetime
import psycopg2
from psycopg2 import Error
import configparser

cwdPath = os.path.abspath(os.getcwd())
config_path = os.path.join(cwdPath, "config")

config_parser = configparser.ConfigParser()
config_parser.read(os.path.join(config_path, "database.ini"))

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

def getstatus(task_name):
    try:
        conn = create_connection()
        cur = conn.cursor()
        print(task_name)
        query = """SELECT status FROM regex_tasks where task_name= %s"""
        items = (task_name, )
        cur.execute(query, items)
        result = cur.fetchall()
        status = 'None'
        for row in result:
            status = row[0]
        # if status != 'inprogress' | status != 'completed':
        #    getstatus(task_name)
        # else:
        #    status = 'inprogress'
        conn.commit()
        conn.close()
        print("status final :>> ", status)
        return status
    except Error as e:
        print(e)

def getresults(task_name):
    try:
        conn = create_connection()
        cur = conn.cursor()
        print(task_name)
        query = """SELECT results FROM regex_tasks where task_name=%s"""
        items = (task_name, )
        cur.execute(query, items)
        result = cur.fetchall()
        results = 'None'
        for row in result:
            print(row[0])
            results = row[0]
        conn.commit()
        conn.close()
        return results
    except Error as e:
        print(e)

def update_is_process(task_name):
    try:
        conn = create_connection()
        cur = conn.cursor()
        query = """Update regex_tasks set status= %s where task_name= %s"""
        # sql = """select * from logvalidationdtl where Id = {id}""".format(id=id)
        items = ("Draft", task_name, )
        cur.execute(query, items)
        conn.commit()
        conn.close()
        # print(object_id)
        return True

    except Error as e:
        print(e)

def getExecLog(task_name):
    try:
        conn = create_connection()
        cur = conn.cursor()
        print(task_name)
        query = """SELECT exec_log FROM regex_tasks where task_name=%s"""
        items = (task_name, )
        cur.execute(query, items)
        result = cur.fetchall()
        exec_log = 'None'
        for row in result:
            print("row:>>", row)
            exec_log = row[0]
        print("status :>> ", exec_log)
        conn.commit()
        conn.close()
        return exec_log
    except Error as e:
        print(e)


def execute_query(sql, args):
    try:
        conn = create_connection()
        cur = conn.cursor()
        if args == "":
            cur.execute(sql)
        else:
            cur.execute(sql, args,)
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


def execute_delete(sql, args):
    try:
        conn = create_connection()
        cur = conn.cursor()
        if args == "":
            cur.execute(sql)
        else:
            cur.execute(sql, args,)
        conn.commit()
        conn.close()
        return True
    except Error as e:
        print(e)


def get_task_list():
    create_task_table_if_not_exist()
    try:
        sql = """SELECT exec_log, task_name as taskname, task_description as "taskDescription", status, training_type, 
        "task_CreatedDate", "task_CompletedOn" FROM 
        regex_tasks ORDER BY "task_CompletedOn" DESC"""
        result_data = execute_query(sql, '')
        return result_data
    except Error as e:
        print(e)

    
def execute_sql(sql, obj_data):
    try:
        conn = create_connection()
        cur = conn.cursor()
        cur.execute(sql, obj_data)
        conn.commit()
        object_id = cur.lastrowid
        cur.close()
        conn.close()
        return object_id
    except Error as e:
        print(e)


def execute_many_sql(sql, obj_data):
    try:
        conn = create_connection()
        cur = conn.cursor()
        cur.executemany(sql, obj_data)
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Error as e:
        print(e)


def get_highlighted_json_data(task_name, tag_name):
    try:
        sql = """SELECT * FROM tag_selection WHERE task_name = %s and tag_name = %s"""
        result_data = execute_query(sql, args=(task_name, tag_name))
        return result_data
    except Error as e:
        print(e)


def update_log_file_for_task(task_name, log_file_name):
    try:
        conn = create_connection()
        curr = conn.cursor()
        print(task_name, log_file_name)
        update_query = """update regex_tasks SET log_file_name = %s WHERE task_name = %s"""
        curr.execute(update_query, (log_file_name, task_name))
        conn.commit()
        curr.close()
        conn.close()
        print("log file updated successfully")
        return 'ok'
    except Error as e:
        print(e)


def create_task_table_if_not_exist():
    try:
        conn = create_connection()
        cur = conn.cursor()
        sql_create_selection_table = """CREATE TABLE IF NOT EXISTS regex_tasks (task_name VARCHAR(100), 
                                        task_description TEXT,
                                        results TEXT,
                                        exec_log TEXT,
                                        status VARCHAR(100),
                                        log_file_name VARCHAR(100),
                                        log_delimiter TEXT,
                                        training_type VARCHAR(100),
                                        "task_CreatedDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                        "task_CompletedOn" TIMESTAMP);"""

        cur.execute(sql_create_selection_table)
        conn.commit()
        cur.close()
        conn.close()
    except Error as e:
        print(e)


def insert_regex_task(tag_selection_obj):
    try:
        create_task_table_if_not_exist()
        sqlite_insert_with_param = """INSERT INTO regex_tasks(task_name, task_description, log_file_name, 
        log_delimiter, status, training_type, exec_log) VALUES (%s, %s, %s, %s, %s, %s, %s) """
        execute_sql(sqlite_insert_with_param, tag_selection_obj)
        return "ok"
    except Error as e:
        print(e)

def create_log_data_table_if_not_exist():
    try:
        conn = create_connection()
        cur = conn.cursor()
        sql_create_selection_table = """CREATE TABLE IF NOT EXISTS uploaded_log_data 
                                        (log_line_no VARCHAR(100),
                                        task_name VARCHAR(100),
                                        log_data TEXT,
                                        is_marked VARCHAR(100));"""
        cur.execute(sql_create_selection_table)
        conn.commit()
        cur.close()
        conn.close()
    except Error as e:
        print(e)


def insert_uploaded_log_data(list_data):
    try:
        create_log_data_table_if_not_exist()
        sqlite_insert_with_param = """INSERT INTO uploaded_log_data(log_line_no, task_name, log_data, is_marked) 
        VALUES (%s, %s, %s, %s)"""
        execute_many_sql(sqlite_insert_with_param, list_data)
        return True
    except Error as e:
        print(e)


def create_tag_table_if_not_exist():
    try:
        conn = create_connection()
        cur = conn.cursor()
        sql_create_selection_table = """CREATE TABLE IF NOT EXISTS tag_selection 
                                        (task_name VARCHAR(100),
                                        log_line_no VARCHAR(100),
                                        tag_id VARCHAR(100),
                                        tag_name VARCHAR(100),
                                        selected_text TEXT,
                                        text_start VARCHAR(100),
                                        text_end VARCHAR(100));"""
        cur.execute(sql_create_selection_table)
        conn.commit()
        cur.close()
        conn.close()
    except Error as e:
        print(e)


def insert_highlighted_values(tag_selection_obj):
    try:
        create_tag_table_if_not_exist()
        sqlite_insert_with_param = """INSERT INTO tag_selection(task_name, log_line_no, tag_id, tag_name, selected_text, 
        text_start, text_end) VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        execute_many_sql(sqlite_insert_with_param, tag_selection_obj)
        return True
    except Error as e:
        print(e)


def log_data_count_by_task_name(task_name):
    try:
        sql = "SELECT count(task_name) as total_records FROM uploaded_log_data WHERE task_name = '" + str(task_name) + "'"
        result_data = execute_query(sql, "")
        json_result = json.loads(result_data)
        return json_result[0]['total_records']
    except Error as e:
        print(e)

def get_records_of_uploaded_log(task_name, page_number, total_records):
    try:
        limit_val = int(total_records)
        offset_val = int(page_number) * int(total_records)
        sql = "SELECT * FROM uploaded_log_data WHERE task_name = '" + str(task_name) + "' ORDER BY log_line_no limit " + str(limit_val) + " offset " + str(offset_val)
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)


def get_log_record_by_id(task_name, line_number):
    try:
        sql = "SELECT * FROM uploaded_log_data WHERE task_name = '" + task_name + "' and log_line_no = '" + line_number + "'"
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)

def create_tag_data_table_if_not_exist():
    try:
        conn = create_connection()
        cur = conn.cursor()
        sql_create_selection_table = """CREATE TABLE IF NOT EXISTS tag_data 
                                        (tag_name VARCHAR(100),
                                        task_name VARCHAR(100),
                                        is_predefined VARCHAR(100),
                                        predefined_tag_json_format JSON DEFAULT NULL);"""

        cur.execute(sql_create_selection_table)
        conn.commit()
        cur.close()
        conn.close()
    except Error as e:
        print(e)


def insert_tag_data(list_tag_obj):
    try:
        create_tag_data_table_if_not_exist()
        sqlite_insert_with_param = """INSERT INTO tag_data(tag_name, task_name, is_predefined) VALUES (%s, %s, %s) """
        execute_many_sql(sqlite_insert_with_param, list_tag_obj)
        return True
    except Error as e:
        print(e)


def get_tag_list_by_task_name(task_name):
    create_tag_data_table_if_not_exist()
    try:
        sql = "SELECT * FROM tag_data WHERE task_name = '" + task_name + "'"
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)


def get_highlighted_data_list_task(task_name):
    try:
        sql = """SELECT tag_selection.*, uploaded_log_data.log_data FROM tag_selection INNER JOIN uploaded_log_data ON 
              tag_selection.task_name = uploaded_log_data.task_name and tag_selection.log_line_no = 
              uploaded_log_data.log_line_no WHERE tag_selection.task_name = '""" + task_name + """'"""
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)


def update_for_marked_log_data(task_name, line_number):
    print('task_name>>>>' + task_name)
    print('line_number>>>>' + line_number)
    try:
        conn = create_connection()
        curr = conn.cursor()
        update_query = "update uploaded_log_data SET is_marked='1' WHERE task_name = '" + task_name + "' and log_line_no = '" + line_number + "'"
        curr.execute(update_query)
        conn.commit()
        curr.close()
        conn.close()
        print("log file updated successfully")
        return True
    except Error as e:
        print(e)


def get_log_line_highlighted_data_by_task(task_name, line_number):
    try:
        sql = "SELECT * FROM tag_selection WHERE task_name = '" + task_name + "' and log_line_no = '" + line_number + "' "
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)


def get_sequence_number_by_task(task_name):
    try:
        sql = "SELECT log_line_no FROM uploaded_log_data WHERE task_name = '" + task_name + "' ORDER BY log_line_no"
        result_data = execute_query(sql, "")
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


def read_logval_taskdtl():
    create_logvalidation_table_if_not_exist()
    try:
        conn = create_connection()
        cur = conn.cursor()
        # sql = """select * from logvalidationdtl where Id = {id}""".format(id=id)
        sql = """select * from logvalidationdtl"""
        cur.execute(sql)
        result = cur.fetchall()
        columns = cur.description
        data = []
        for row in result:
            temp = []
            for i in range(len(columns)):
                temp.append(str(row[i]))
            data.append(tuple(temp))
        conn.commit()
        conn.close()
        # if(len(data)>0):
        #     return [tuple(data)]
        # else:
        #     return []
        return data
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
        # print(object_id)
        return True

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
        # print(object_id)
        return True
    except Error as e:
        print(e)


def gettasklist():
    try:
        sql = """SELECT task_name as taskname,task_description as "taskDescription",results, training_type FROM regex_tasks where (
        results IS NOT NULL and training_type='Regular Expression') OR (training_type='ML Model' and 
        status='Completed') """
        result_data = execute_query(sql, '')
        return result_data
    except Error as e:
        print(e)

def create_logvalidation_table_if_not_exist():
    try:
        conn = create_connection()
        cur = conn.cursor()
        sql_create_logval_table = """CREATE TABLE IF NOT EXISTS logvalidationdtl 
                                    ("Id" SERIAL PRIMARY KEY,
                                    "CreatedDate" TIMESTAMP,
                                    "FilePath" VARCHAR (100),
                                    "TaskName" VARCHAR (50),
                                    "TagNames" VARCHAR (500),
                                    "RegExValue" VARCHAR (500),
                                    "Status" VARCHAR (50),
                                    "TaskType" VARCHAR (50),
                                    selected_task_name TEXT,
                                    result_type TEXT,
                                    log_delimiter TEXT );"""

        cur.execute(sql_create_logval_table)
        conn.commit()
        cur.close()
        conn.close()
    except Error as e:
        print(e)

def get_task_detail_by_task_name(task_name):
    try:
        sql = "SELECT * FROM regex_tasks WHERE task_name = '" + task_name + "'"
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)


def get_training_type_by_task_name(task_name):
    try:
        sql = "SELECT training_type FROM regex_tasks WHERE task_name = '" + task_name + "'"
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)


def generate_JSON(task_name, log_line_no):
    try:
        sql = "select log_line_no, tag_id, tag_name, selected_text from tag_selection where task_name ='" + task_name + "' and log_line_no = '" + log_line_no + "' order by log_line_no, tag_id;"""
        result_data = execute_query(sql, '')
        return result_data
    except Error as e:
        print(e)

def generate_PDF(task_name):
    try:
        sql = """select log_line_no,log_data from uploaded_log_data where task_name=%s and is_marked='1';"""
        result_data = execute_query(sql, args=(task_name))
        return result_data
    except Error as e:
        print(e)


def generate_FIELD_DICT(task_name):
    try:
        sql = """select tag_name from tag_data where task_name=%s;"""
        result_data = execute_query(sql, args=(task_name))
        return result_data
    except Error as e:
        print(e)


def update_deeplearning_taskstatus(task_name, status):
    try:
        conn = create_connection()
        curr = conn.cursor()
        print(task_name, status)
        dateTimeObj = datetime.now()
        update_query = """update regex_tasks SET status = %s, "task_CompletedOn" = %s WHERE task_name = %s"""
        curr.execute(update_query, (status, dateTimeObj, task_name))
        conn.commit()
        curr.close()
        conn.close()
        print("Task Status updated successfully")
        return 'ok'
    except Error as e:
        print(e)


def get_log_validation_by_id(task_id):
    try:
        sql = """select selected_task_name, result_type, log_delimiter from logvalidationdtl where "Id"=""" + str(task_id)
        result_data = execute_query(sql, args="")
        return result_data
    except Error as e:
        print(e)


def update_ml_executionsummary(log, task_name):
    try:
        sql = "SELECT exec_log FROM regex_tasks WHERE task_name =%s"
        result_data = execute_query(sql, args=(task_name))
        final_log = ""
        list_exec_logs = json.loads(result_data)
        str_exec_log = list_exec_logs[0]["exec_log"]
        if str_exec_log == "":
            final_log = log
        else:
            final_log = str_exec_log + "\n\n" + log
        conn = create_connection()
        curr = conn.cursor()
        update_query = """update regex_tasks SET exec_log = %s WHERE task_name = %s """
        curr.execute(update_query, (final_log, task_name))
        conn.commit()
        curr.close()
        conn.close()
    except Error as e:
        print(e)


def get_log_line_data(task_name, line_no):
    try:
        sql = "select log_data from uploaded_log_data where task_name='" + task_name + "' and log_line_no='" + line_no + "'"
        print(sql)
        result_data = execute_query(sql, args="")
        return result_data
    except Error as e:
        print(e)

def delete_all_from_table(table_name):
    try:
        sql = "DELETE FROM " + table_name
        result_data = execute_delete(sql, args="")
        return result_data
    except Error as e:
        print(e)

def insert_update_configuration_detail(req_data):
    obj_data = json.loads(req_data)
    insert_data = (str(obj_data["re_steps"]), str(obj_data["ml_steps"]), obj_data["access_key"], obj_data["secret_key"],
                   'i-01c30dab40749dae2', obj_data["pem_filename"], obj_data["ami_image_id"])
    return insert_configuration_data(insert_data)


def insert_configuration_data(insert_data):
    try:
        create_configuration_table_if_not_exist()
        delete_all_from_table('configuration')
        sqlite_insert_with_param = """INSERT INTO configuration(re_step_count, ml_step_count, access_key, secret_key, 
        instance_id, pem_filename, ami_image_id) VALUES (%s, %s, %s, %s, %s, %s, %s) """
        execute_sql(sqlite_insert_with_param, insert_data)
        return True
    except Error as e:
        print(e)


def create_configuration_table_if_not_exist():
    try:
        conn = create_connection()
        cur = conn.cursor()
        sql_create_config_table = """CREATE TABLE IF NOT EXISTS configuration (
                                        re_step_count TEXT,
                                        ml_step_count TEXT,
                                        access_key TEXT,
                                        secret_key TEXT,
                                        instance_id TEXT ,
                                        pem_filename TEXT,
                                        ami_image_id TEXT);"""

        cur.execute(sql_create_config_table)
        conn.commit()
        cur.close()
        conn.close()
    except Error as e:
        print(e)


def get_config_details():
    create_configuration_table_if_not_exist()
    try:
        sql = """SELECT * FROM configuration"""
        result_data = execute_query(sql, '')
        return result_data
    except Error as e:
        print(e)


def get_validation_task_detail(val_task_id):
    try:
        sql = """SELECT * FROM logvalidationdtl WHERE "Id"= """ + val_task_id
        result_data = execute_query(sql, '')
        return result_data
    except Error as e:
        print(e)

def delete_task_by_name(task_name):
    try:
        table_list = ["regex_tasks", "tag_data", "tag_selection", "uploaded_log_data", "user_defined_format"]
        for table_name in table_list:
            try:
                sql = "DELETE FROM " + table_name + " WHERE task_name = '" + task_name + "'"
                # print(sql)
                result_data = execute_delete(sql, args="")
            except Error as e:
                print(e)
        return True
    except Error as e:
        print(e)


def delete_validation_task_by_id(task_id):
    try:
        sql = """DELETE FROM logvalidationdtl WHERE "Id" = '""" + task_id + """'"""
        print(sql)
        result_data = execute_delete(sql, args="")
        return result_data
    except Error as e:
        print(e)


def update_tag_data_user_defined_format(task_name, tag_name, is_predefined, predefined_tag_json_format):
    try:
        conn = create_connection()
        curr = conn.cursor()
        print(task_name, tag_name, is_predefined, predefined_tag_json_format)
        update_query = """update tag_data SET is_predefined = %s , predefined_tag_json_format = %s WHERE task_name = %s  and 
        tag_name = %s"""
        curr.execute(update_query, (str(is_predefined), predefined_tag_json_format, task_name, tag_name))
        conn.commit()
        curr.close()
        conn.close()
        print("Task Status updated successfully")
        return True
    except Error as e:
        print(e)


def getJSONFormat(task_name):
    try:
        conn = create_connection()
        cur = conn.cursor()
        print(task_name)
        cur.execute(
            "SELECT predefined_tag_json_format FROM tag_data where task_name='" + task_name + "' and is_predefined = '1'")
        result = cur.fetchall()
        exec_log = 'None'
        jsonFormat = {}
        for row in result:
            exec_log = json.loads(row[0])
            jsonFormat.update(exec_log)

        conn.commit()
        conn.close()

        return jsonFormat
    except Error as e:
        print(e)


def get_non_predefined_tag_list_by_task_name(task_name):
    create_tag_data_table_if_not_exist()
    try:
        sql = "SELECT * FROM tag_data WHERE task_name = '" + task_name + "' and is_predefined = '0'"
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)

def delete_highlighted_data_by_tag(task_name, tag_id, line_no):
    try:
        sql = "DELETE FROM tag_selection WHERE task_name = '" + task_name + "' and log_line_no='" + line_no + "' and " \
                                                                                                              "tag_id='" + tag_id + "' "
        execute_delete(sql, args="")
        return True
    except Error as e:
        print(e)


def update_mark_status(task_name):
    try:
        sql = "SELECT count(task_name) as total_records FROM tag_selection WHERE task_name = '" + str(task_name) + "'"
        result_data = execute_query(sql, "")
        json_result = json.loads(result_data)
        total_count = json_result[0]['total_records']
        if total_count == 0:
            conn = create_connection()
            curr = conn.cursor()
            update_query = "update uploaded_log_data SET is_marked='0' WHERE task_name = '" + task_name + "'"
            curr.execute(update_query)
            conn.commit()
            curr.close()
            conn.close()
            return True
    except Error as e:
        print(e)


def delete_highlighted_data_and_tag_data(task_name, tag_id, tag_name):
    sql_list = ["DELETE FROM tag_data WHERE task_name='" + task_name + "' and tag_name='" + tag_name + "'",
                "DELETE FROM tag_selection WHERE task_name='" + task_name + "' and tag_id='" + tag_id + "'"]
    for sql_query in sql_list:
        try:
            execute_delete(sql_query, args="")
        except Error as e:
            print(e)
    update_mark_status(task_name)
    return True


def log_datas_by_task_name(task_name):
    try:
        conn = create_connection()
        cur = conn.cursor()
        print("log_datas_by_task_name", task_name)
        cur.execute(
            "SELECT log_line_no,log_data FROM uploaded_log_data where task_name='" + task_name + "' order by log_line_no")
        result = cur.fetchall()
        conn.commit()
        conn.close()
        return result
    except Error as e:
        print(e)


def update_for_marked_log_data_basedtagselection(task_name):
    try:
        print('task_name>>>>' + task_name)
        conn = create_connection()
        curr = conn.cursor()
        update_query = "update uploaded_log_data SET is_marked='1' WHERE task_name = '" + task_name + "' and log_line_no IN (select distinct(log_line_no) from tag_selection where task_name='" + task_name + "')"
        curr.execute(update_query)
        conn.commit()
        curr.close()
        conn.close()
        print("log file updated successfully")
        return True
    except Error as e:
        print(e)

def is_configuration_done():
    try:
        sql = "SELECT pem_filename  FROM configuration"
        result_data = execute_query(sql, "")
        json_result = json.loads(result_data)
        if len(json_result) > 0 and json_result[0]["pem_filename"] != "":
            return True
        return False
    except Error as e:
        print(e)


def getUserDefinedValuesInfo(task_name, tag_name):
    create_user_defined_format_table_if_not_exist()
    try:
        sql = "SELECT * FROM user_defined_format WHERE task_name = '" + task_name + "' and tag_name = '" + tag_name + "'"
        result_data = execute_query(sql, "")
        return result_data
    except Error as e:
        print(e)

def create_user_defined_format_table_if_not_exist():
    try:
        conn = create_connection()
        cur = conn.cursor()
        sql_create_selection_table = """CREATE TABLE IF NOT EXISTS user_defined_format (
                                        tag_name TEXT,
                                        task_name TEXT,
                                        predefined_tag_type_value TEXT,
                                        predefined_date_format_value TEXT,
                                        predefined_string_start_value TEXT,
                                        predefined_string_end_value TEXT
                                    ); """

        cur.execute(sql_create_selection_table)
        conn.commit()
        cur.close()
        conn.close()
    except Error as e:
        print(e)


def insert_user_defined_format_data(insert_predefined_data_obj):
    try:
        sqlite_insert_with_param = """INSERT INTO user_defined_format(tag_name, task_name, predefined_tag_type_value, predefined_date_format_value, 
        predefined_string_start_value, predefined_string_end_value) VALUES (%s, %s, %s, %s, %s, %s) """
        execute_sql(sqlite_insert_with_param, insert_predefined_data_obj)
        return True
    except Error as e:
        print(e)


def update_user_defined_format_data(req_obj):
    try:
        conn = create_connection()
        curr = conn.cursor()
        update_query = '''update user_defined_format SET tag_name = %s , predefined_tag_type_value = %s, predefined_date_format_value = %s, 
            predefined_string_start_value = %s, predefined_string_end_value = %s WHERE task_name = %s and tag_name = %s'''
        curr.execute(update_query, req_obj)
        conn.commit()
        curr.close()
        conn.close()
        print("log file updated successfully")
        return True
    except Error as e:
        print(e)
