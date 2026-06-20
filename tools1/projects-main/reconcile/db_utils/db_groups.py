from .db_connection import execute_get_query, execute_insert_query, execute_delete_query

def get_all_group_list():
    query = """SELECT S.group_id,S.group_name,S.isactive,S.suite_id, P.suite_name FROM reconcile_schema.test_groups S INNER JOIN reconcile_schema.suites P ON P.suite_id=S.suite_id  ORDER BY S.group_name"""
    data = execute_get_query(query,)
    return data

def get_active_group_list():
    query = """SELECT S.group_id,S.group_name, S.suite_id, P.suite_name FROM reconcile_schema.test_groups S INNER JOIN reconcile_schema.suites P ON P.suite_id=S.suite_id WHERE S.isactive=1  ORDER BY S.group_name"""
    data = execute_get_query(query,)
    return data

def get_active_group_list_for_suite(suite_id):
    query = """SELECT S.group_id,S.group_name, S.suite_id, P.suite_name FROM reconcile_schema.test_groups S INNER JOIN reconcile_schema.suites P ON P.suite_id=S.suite_id WHERE S.suite_id=%s S.isactive=1  ORDER BY S.group_name"""
    data = execute_get_query(query,[suite_id])
    return data

def add_group(group_name, suite_id, is_active):
    query="""INSERT INTO reconcile_schema.test_groups (group_name,suite_id,isactive,created_on) VALUES (%s,%s,%s,current_timestamp)"""    
    result = execute_insert_query(query, [group_name, suite_id, str(1 if is_active else 0)])

    return result

def update_group(group_id, group_name, suite_id, is_active):
    query="""UPDATE reconcile_schema.test_groups SET group_name =%s,suite_id=%s,isactive=%s WHERE group_id=%s"""
    result = execute_insert_query(query, [group_name, suite_id, is_active, group_id])

    return result

def get_group(group_id):
    query = """SELECT group_id,group_name,isactive, suite_id FROM reconcile_schema.test_groups WHERE group_id=%s"""
    data = execute_get_query(query,[group_id])
    return data

def delete_group(group_id):
    query="""DELETE FROM reconcile_schema.test_groups WHERE group_id=%s"""
    result = execute_delete_query(query, [group_id])

    return result

def check_duplicate_groupname(group_name, group_id =0):
    query = """SELECT COUNT(group_name) FROM reconcile_schema.test_groups WHERE LOWER(group_name)=LOWER(%s) AND group_id<>%s"""
    data = execute_get_query(query, [group_name, group_id])
    result = int(data[0]["count"])
    if(result > 0):
        return True
    else:
        return False