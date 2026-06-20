"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""


from db_utils import common_utils


def check_if_run_id_already_exist(root_run_uid):
    query = f"SELECT COUNT(1) as count from af_pipeline_run_log WHERE root_run_id='{root_run_uid}'"
    data = common_utils.execute_get_query(query, )
    if data is not None:
        result = int(data[0]["count"])
        if result > 0:
            return True
    else:
        return False


def check_if_task_info_already_exist(run_uid, task_id):
    query = f"SELECT COUNT(1) as count from af_task_info WHERE run_uid='{run_uid}' and task_id='{task_id}'"
    data = common_utils.execute_get_query(query, )
    if data is not None:
        result = int(data[0]["count"])
        if result > 0:
            return True
    else:
        return False


def is_already_exist_new_run_info(run_uid):
    query = f"SELECT COUNT(1) as count from af_task_new_run_info WHERE run_uid='{run_uid}'"
    data = common_utils.execute_get_query(query, )
    if data is not None:
        result = int(data[0]["count"])
        if result > 0:
            return True
    else:
        return False


def is_task_run_def_exist(run_uid, task_definition_uid):
    query = f"SELECT COUNT(1) as count from af_task_run_def_info WHERE run_uid='{run_uid}' " \
            f"and task_definition_uid='{task_definition_uid}'"
    data = common_utils.execute_get_query(query, )
    if data is not None:
        result = int(data[0]["count"])
        if result > 0:
            return True
    else:
        return False


def is_task_env_info_already_exist(run_uid, task_run_env_uid):
    query = f"SELECT COUNT(1) as count from af_task_run_env_info WHERE run_uid='{run_uid}' " \
            f"and task_run_env_uid='{task_run_env_uid}'"
    data = common_utils.execute_get_query(query, )
    if data is not None:
        result = int(data[0]["count"])
        if result > 0:
            return True
    else:
        return False


def is_task_run_info_already_exist(run_uid, task_definition_uid, task_run_attempt_uid, task_run_uid):
    query = f"SELECT COUNT(1) as count from af_task_run_info WHERE run_uid='{run_uid}'" \
            f" and task_definition_uid='{task_definition_uid}'" \
            f" and task_run_attempt_uid='{task_run_attempt_uid}'" \
            f" and task_run_uid='{task_run_uid}'"
    data = common_utils.execute_get_query(query, )
    if data is not None:
        result = int(data[0]["count"])
        if result > 0:
            return True
    else:
        return False


def is_metric_info_already_exist(task_run_attempt_uid):
    query = f"SELECT COUNT(1) as count from af_metrics_info WHERE task_run_attempt_uid='{task_run_attempt_uid}'"
    data = common_utils.execute_get_query(query, )
    if data is not None:
        result = int(data[0]["count"])
        if result > 0:
            return True
    else:
        return False


def is_task_run_log_info_already_exist(task_run_attempt_uid):
    query = f"SELECT COUNT(1) as count from af_task_run_log_info WHERE task_run_attempt_uid='{task_run_attempt_uid}'"
    data = common_utils.execute_get_query(query, )
    if data is not None:
        result = int(data[0]["count"])
        if result > 0:
            return True
    else:
        return False


def is_dataset_already_exist(run_uid, task_run_attempt_uid, task_run_uid, operation_type):
    query = f"SELECT COUNT(1) as count from af_dataset_info WHERE task_run_attempt_uid='{task_run_attempt_uid}'" \
            f" and run_uid='{run_uid}' and task_run_uid='{task_run_uid}' and operation_type='{operation_type}'"
    data = common_utils.execute_get_query(query, )
    if data is not None:
        result = int(data[0]["count"])
        if result > 0:
            return True
    else:
        return False


def is_target_info_already_exist(run_uid, task_run_attempt_uid, task_run_uid, task_def_uid):
    query = f"SELECT COUNT(1) as count from af_targets_info WHERE task_run_attempt_uid='{task_run_attempt_uid}'" \
            f" and run_uid='{run_uid}' and task_run_uid='{task_run_uid}' and task_def_uid='{task_def_uid}'"
    data = common_utils.execute_get_query(query, )
    if data is not None:
        result = int(data[0]["count"])
        if result > 0:
            return True
    else:
        return False
