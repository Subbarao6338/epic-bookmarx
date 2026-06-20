"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""


import datetime
import json
import db_utils.common_utils as common_utils
from db_utils import af_dbnd_db_utils as db_utils


def insert_af_pipeline_log(data):
    init_log_json = data["init_args"]
    dag_id = init_log_json["af_context"]["dag_id"]
    root_run_uid = init_log_json["root_run_uid"]
    scheduled_run_info = init_log_json["scheduled_run_info"]
    tracking_source = init_log_json["tracking_source"]
    created_at = str(datetime.datetime.now())
    is_already_exist = db_utils.check_if_run_id_already_exist(root_run_uid)
    if not is_already_exist:
        data = (dag_id, root_run_uid, scheduled_run_info, tracking_source, created_at)
        query = '''INSERT INTO af_pipeline_run_log(dag_id, root_run_id, scheduled_run_info, tracking_source, created_at) 
        VALUES(%s,%s,%s,%s,%s)'''
        return common_utils.execute_query(query, data)
    else:
        return True


def insert_af_task_info(data):
    job_info_json = data["task_runs_info"]
    run_uid = job_info_json["run_uid"]
    task_id = job_info_json["af_context"]["task_id"]
    execution_date = job_info_json["af_context"]["execution_date"]
    task_run_env_uid = job_info_json["task_run_env_uid"]
    parent_task_run_uid = job_info_json["parent_task_run_uid"]
    dynamic_task_run_update = job_info_json["dynamic_task_run_update"]
    created_at = str(datetime.datetime.now())
    dag_id = job_info_json["af_context"]["dag_id"]
    airflow_instance_uid = job_info_json["af_context"]["airflow_instance_uid"]
    upstreams_map = json.dumps(job_info_json["upstreams_map"])
    parent_child_map = json.dumps(job_info_json["parent_child_map"])
    is_already_exist = db_utils.check_if_task_info_already_exist(run_uid, task_id)
    if not is_already_exist:
        data = (run_uid, task_id, execution_date, task_run_env_uid, parent_task_run_uid, dynamic_task_run_update,
                created_at, dag_id, airflow_instance_uid, upstreams_map, parent_child_map)
        query = '''INSERT INTO af_task_info(run_uid, task_id, execution_date, task_run_env_uid, parent_task_run_uid, 
        dynamic_task_run_update, created_at, dag_id, airflow_instance_uid, upstreams_map, parent_child_map)
        VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
        return common_utils.execute_query(query, data)
    else:
        query = f"UPDATE af_task_info SET parent_task_run_uid='{parent_task_run_uid}', " \
                f"dynamic_task_run_update='{dynamic_task_run_update}', modified_at='{created_at}'," \
                f"upstreams_map='{upstreams_map}', parent_child_map='{parent_child_map}' " \
                f"WHERE run_uid='{run_uid}' and task_id='{task_id}'"
        return common_utils.execute_query(query, )


def insert_task_new_run_info(data):
    new_run_info_json = data["init_args"]["new_run_info"]
    run_uid = new_run_info_json["run_uid"]
    driver_name = new_run_info_json["driver_name"]
    end_time = new_run_info_json["end_time"]
    root_run_url = new_run_info_json["root_run"]["root_run_url"]
    root_run_uid = new_run_info_json["root_run"]["root_run_uid"]
    root_task_run_uid = new_run_info_json["root_run"]["root_task_run_uid"]
    root_task_run_attempt_uid = new_run_info_json["root_run"]["root_task_run_attempt_uid"]
    scheduled_run = new_run_info_json["scheduled_run"]
    description = new_run_info_json["description"]
    sends_heartbeat = new_run_info_json["sends_heartbeat"]
    af_user = new_run_info_json["user"]
    execution_date = new_run_info_json["execution_date"]
    job_name = new_run_info_json["job_name"]
    state = new_run_info_json["state"]
    project_name = new_run_info_json["project_name"]
    version = new_run_info_json["version"]
    cloud_type = new_run_info_json["cloud_type"]
    name = new_run_info_json["name"]
    env_name = new_run_info_json["env_name"]
    start_time = new_run_info_json["start_time"]
    task_executor = new_run_info_json["task_executor"]
    target_date = new_run_info_json["target_date"]
    is_archived = new_run_info_json["is_archived"]
    trigger = new_run_info_json["trigger"]
    cmd_name = new_run_info_json["cmd_name"]
    created_at = str(datetime.datetime.now())
    is_already_exist = db_utils.is_already_exist_new_run_info(run_uid)
    if not is_already_exist:
        data = (run_uid, driver_name, end_time, root_run_url, root_run_uid, root_task_run_uid,
                root_task_run_attempt_uid, scheduled_run, description, sends_heartbeat, af_user,
                execution_date, job_name, state, project_name, version, cloud_type, name, env_name, start_time,
                task_executor, target_date, is_archived, trigger, cmd_name, created_at)
        query = '''INSERT INTO af_task_new_run_info(run_uid, driver_name, end_time, root_run_url, root_run_uid, root_task_run_uid,
                root_task_run_attempt_uid, scheduled_run, description, sends_heartbeat, af_user,
                execution_date, job_name, state, project_name, version, cloud_type, name, env_name, start_time,
                task_executor, target_date, is_archived, trigger, cmd_name, created_at)
                VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
        return common_utils.execute_query(query, data)
    else:
        query = f"UPDATE af_task_new_run_info SET end_time='{end_time}' WHERE run_uid='{run_uid}'"
        return common_utils.execute_query(query, )


def insert_task_run_def_info(data):
    new_run_info_json = data["task_runs_info"]["task_definitions"]
    for item in new_run_info_json:
        run_uid = data["task_runs_info"]["run_uid"]
        task_definition_uid = item["task_definition_uid"]
        module_source = item["module_source"]
        family = item["family"]
        source_hash = item["source_hash"]
        source = item["source"]
        name = item["name"]
        module_source_hash = item["module_source_hash"]
        class_version = item["class_version"]
        type = item["type"]
        created_at = str(datetime.datetime.now())
        is_already_exist = db_utils.is_task_run_def_exist(run_uid, task_definition_uid)
        if not is_already_exist:
            data = (run_uid, task_definition_uid, module_source, family, source_hash, source, name, module_source_hash,
                    class_version, type, created_at)
            query = '''INSERT INTO af_task_run_def_info(run_uid, task_definition_uid, module_source, family, source_hash, source, name, module_source_hash,
                    class_version, type, created_at)VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
            common_utils.execute_query(query, data)
            param_def_list = item["task_param_definitions"]
            for params in param_def_list:
                af_group = params["group"]
                value_type = params["value_type"]
                description = params["description"]
                load_on_build = params["load_on_build"]
                name = params["name"]
                af_default = params["default"]
                kind = params["kind"]
                significant = params["significant"]
                created_at = str(datetime.datetime.now())
                data = (run_uid, task_definition_uid, af_group, value_type, description, load_on_build, name, af_default,
                        kind, significant, created_at)
                query = '''INSERT INTO af_task_run_def_params_info(run_uid, task_definition_uid, af_group, value_type, 
                description, load_on_build, name, af_default, kind, significant, created_at)
                VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
                common_utils.execute_query(query, data)
    return True


def insert_task_run_env_info(data):
    env_info_json = data["init_args"]["task_run_env"]
    run_uid = data["init_args"]["run_uid"]
    task_run_env_uid = env_info_json["uid"]
    user_code_committed = env_info_json["user_code_committed"]
    databand_version = env_info_json["databand_version"]
    heartbeat = env_info_json["heartbeat"]
    cmd_line = env_info_json["cmd_line"]
    af_user = env_info_json["user"]
    machine = env_info_json["machine"]
    user_data = env_info_json["user_data"]
    project_root = env_info_json["project_root"]
    user_code_version = env_info_json["user_code_version"]
    created_at = str(datetime.datetime.now())
    is_already_exist = db_utils.is_task_env_info_already_exist(run_uid, task_run_env_uid)
    if not is_already_exist:
        data = (run_uid, task_run_env_uid, user_code_committed, databand_version, heartbeat, cmd_line, af_user,
                machine, user_data, project_root, user_code_version, created_at)
        query = '''INSERT INTO af_task_run_env_info(run_uid, task_run_env_uid, user_code_committed, databand_version, heartbeat, cmd_line,af_user,
                machine, user_data, project_root, user_code_version, created_at)
                VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
        return common_utils.execute_query(query, data)
    else:
        return True


def insert_af_task_run_info(data):
    task_runs_info_json = data["task_runs_info"]["task_runs"]
    for item in task_runs_info_json:
        run_uid = item["run_uid"]
        task_definition_uid = item["task_definition_uid"]
        task_run_attempt_uid = item["task_run_attempt_uid"]
        task_run_uid = item["task_run_uid"]
        version = item["version"]
        external_links = item["external_links"]
        task_signature = item["task_signature"]
        is_dynamic = item["is_dynamic"]
        name = item["name"]
        has_downstreams = item["has_downstreams"]
        execution_date = item["execution_date"]
        is_reused = item["is_reused"]
        has_upstreams = item["has_upstreams"]
        task_af_id = item["task_af_id"]
        command_line = item["command_line"]
        is_root = item["is_root"]
        state = item["state"]
        target_date = item["target_date"]
        is_skipped = item["is_skipped"]
        created_at = str(datetime.datetime.now())
        is_already_exist = db_utils.is_task_run_info_already_exist(run_uid, task_definition_uid,
                                                                   task_run_attempt_uid, task_run_uid)
        if not is_already_exist:
            data = (run_uid, task_definition_uid, task_run_attempt_uid, task_run_uid, version, external_links, task_signature,
                    is_dynamic, name, has_downstreams, execution_date, is_reused, has_upstreams, task_af_id,
                    command_line, is_root, state, target_date, is_skipped, created_at)
            query = '''INSERT INTO af_task_run_info(run_uid, task_definition_uid, task_run_attempt_uid,task_run_uid, version, 
                    external_links, task_signature, is_dynamic, name, has_downstreams, execution_date, is_reused, 
                    has_upstreams, task_af_id, command_line, is_root, state, target_date, is_skipped, created_at)
                    VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
            common_utils.execute_query(query, data)
            task_run_params = item["task_run_params"]
            for param in task_run_params:
                parameter_name = param["parameter_name"]
                value = param["value"]
                value_origin = param["value_origin"]
                data = (run_uid, task_definition_uid, task_run_attempt_uid, task_run_uid, parameter_name, value,
                        value_origin, created_at)
                query = '''INSERT INTO af_task_run_params_info(run_uid, task_definition_uid, task_run_attempt_uid, 
                task_run_uid, parameter_name, value, value_origin, created_at)
                VALUES(%s,%s,%s,%s,%s,%s,%s,%s)'''
                common_utils.execute_query(query, data)
    return True


def insert_init_run_log_info(data):
    if insert_af_pipeline_log(data):
        insert_af_task_info(data["init_args"])
        insert_af_task_run_info(data["init_args"])
        insert_task_run_def_info(data["init_args"])
        insert_task_new_run_info(data)
        insert_task_run_env_info(data)


def insert_add_task_runs_info(data):
    if insert_af_task_info(data):
        insert_af_task_run_info(data)
        insert_task_run_def_info(data)


def update_task_run_attempts(data):
    update_task_runs = data["task_run_attempt_updates"]
    for run_info in update_task_runs:
        task_run_uid = run_info["task_run_uid"]
        task_run_attempt_uid = run_info["task_run_attempt_uid"]
        state = run_info["state"]
        timestamp = run_info["timestamp"]
        query = f"UPDATE af_task_run_info SET state = '{state}', modified_at='{timestamp}' " \
                f"WHERE task_run_uid = '{task_run_uid}' and task_run_attempt_uid='{task_run_attempt_uid}'"
        common_utils.execute_query(query,)
    return True


def insert_metrics_info(data):
    metrics_info_json = data["metrics_info"]
    for item in metrics_info_json:
        task_run_attempt_uid = item["task_run_attempt_uid"]
        metric = json.dumps(item["metric"])
        source = item["source"]
        created_at = str(datetime.datetime.now())
        is_already_exist = db_utils.is_metric_info_already_exist(task_run_attempt_uid)
        if not is_already_exist:
            data = (task_run_attempt_uid, metric, source, created_at)
            query = """INSERT INTO af_metrics_info(task_run_attempt_uid, metric, source, created_at)
            VALUES(%s,%s,%s,%s)"""
            return common_utils.execute_query(query, data)
        else:
            query = f"UPDATE af_metrics_info SET metric = '{metric}', source = '{source}', modified_at='{created_at}' " \
                    f"WHERE task_run_attempt_uid = '{task_run_attempt_uid}'"
            return common_utils.execute_query(query,)


def insert_task_run_log_info(data):
    task_run_log_json = data
    task_run_attempt_uid = data["task_run_attempt_uid"]
    log_body = data["log_body"]
    local_log_path = data["local_log_path"]
    created_at = str(datetime.datetime.now())
    is_already_exist = db_utils.is_task_run_log_info_already_exist(task_run_attempt_uid)
    if not is_already_exist:
        data = (task_run_attempt_uid, log_body, local_log_path, created_at)
        query = """INSERT INTO af_task_run_log_info(task_run_attempt_uid, log_body, local_log_path, created_at)
        VALUES(%s,%s,%s,%s)"""
        return common_utils.execute_query(query, data)
    else:
        query = f"UPDATE af_task_run_log_info SET log_body='{log_body}', local_log_path='{local_log_path}', " \
                f"modified_at='{created_at}' WHERE task_run_attempt_uid='{task_run_attempt_uid}'"
        return common_utils.execute_query(query,)


def insert_dataset_info(data):
    dataset_list = data["datasets_info"]
    for dataset_info in dataset_list:
        run_uid = dataset_info["run_uid"]
        task_run_attempt_uid = dataset_info["task_run_attempt_uid"]
        task_run_uid = dataset_info["task_run_uid"]
        operation_error = dataset_info["operation_error"]
        operation_source = dataset_info["operation_source"]
        operation_type = dataset_info["operation_type"]
        task_run_name = dataset_info["task_run_name"]
        operation_path = dataset_info["operation_path"]
        value_preview = json.dumps(dataset_info["value_preview"])
        with_partition = json.dumps(dataset_info["with_partition"])
        data_schema = json.dumps(dataset_info["data_schema"])
        data_dimensions = json.dumps(dataset_info["data_dimensions"])
        query = dataset_info["query"]
        dataset_uri = dataset_info["dataset_uri"]
        timestamp = dataset_info["timestamp"]
        operation_status = dataset_info["operation_status"]
        columns_stats = dataset_info["columns_stats"]
        created_at = str(datetime.datetime.now())
        is_already_exist = db_utils.is_dataset_already_exist(run_uid, task_run_attempt_uid, task_run_uid,
                                                             operation_type)
        if not is_already_exist:
            data = (run_uid, task_run_attempt_uid, task_run_uid, operation_error, operation_source, operation_type,
                    task_run_name, operation_path, value_preview, with_partition, data_schema, data_dimensions,
                    query, dataset_uri, timestamp, operation_status, columns_stats, created_at)
            query = """INSERT INTO af_dataset_info(run_uid, task_run_attempt_uid, task_run_uid, operation_error, operation_source, operation_type,
                    task_run_name, operation_path, value_preview, with_partition, data_schema, data_dimensions,
                    query, dataset_uri, timestamp, operation_status, columns_stats, created_at)
                    VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
            common_utils.execute_query(query, data)
    return True


def insert_targets_info(data):
    target_list = data["targets_info"]
    for target_info in target_list:
        run_uid = target_info["run_uid"]
        task_run_attempt_uid = target_info["task_run_attempt_uid"]
        task_run_uid = target_info["task_run_uid"]
        task_def_uid = target_info["task_def_uid"]
        target_path = target_info["target_path"]
        operation_type = target_info["operation_type"]
        task_run_name = target_info["task_run_name"]
        value_preview = target_info["value_preview"]
        data_schema = target_info["data_schema"]
        data_dimensions = target_info["data_dimensions"]
        param_name = target_info["param_name"]
        data_hash = target_info["data_hash"]
        operation_status = target_info["operation_status"]
        created_at = str(datetime.datetime.now())
        is_already_exist = db_utils.is_target_info_already_exist(run_uid, task_run_attempt_uid, task_run_uid,
                                                                 task_def_uid)
        if not is_already_exist:
            data = (run_uid, task_run_attempt_uid, task_run_uid, task_def_uid, target_path, operation_type,
                    task_run_name, value_preview, data_schema, data_dimensions, param_name, data_hash,
                    operation_status, created_at)
            query = """INSERT INTO af_targets_info(run_uid, task_run_attempt_uid, task_run_uid, task_def_uid, target_path, operation_type,
                    task_run_name, value_preview, data_schema, data_dimensions, param_name, data_hash,
                    operation_status, created_at)
                    VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
            common_utils.execute_query(query, data)
    return True


def set_run_state(data):
    run_uid = data["run_uid"]
    state = data["state"]
    modified_at = str(datetime.datetime.now())
    query = f"UPDATE af_pipeline_run_log SET state = '{state}', modified_at = '{modified_at}' " \
            f"WHERE root_run_id = '{run_uid}'"
    return common_utils.execute_query(query, )
