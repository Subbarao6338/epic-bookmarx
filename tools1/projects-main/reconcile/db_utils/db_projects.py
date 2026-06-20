from .db_connection import execute_get_query, execute_insert_query, execute_delete_query

def get_all_project_list():
    query = """SELECT project_id,project_name,isactive FROM reconcile_schema.projects ORDER BY project_name"""
    data = execute_get_query(query,)
    return data

def get_active_project_list():
    query = """SELECT project_id,project_name FROM reconcile_schema.projects WHERE isactive=B'1'  ORDER BY project_name"""
    data = execute_get_query(query,)
    return data

def add_project(project_name, is_active):
    query="""INSERT INTO reconcile_schema.projects (project_name,isactive) VALUES (%s,%s)"""    
    result = execute_insert_query(query, [project_name, str(1 if is_active else 0)])

    return result

def update_project(project_id, project_name, is_active):
    query="""UPDATE reconcile_schema.projects SET project_name =%s,isactive=%s WHERE project_id=%s"""
    result = execute_insert_query(query, [project_name, is_active, project_id])

    return result

def get_project(project_id):
    query = """SELECT project_id,project_name,isactive FROM reconcile_schema.projects WHERE project_id=%s"""
    data = execute_get_query(query,[project_id])
    return data

def delete_project(project_id):
    query="""DELETE FROM reconcile_schema.projects WHERE project_id=%s"""
    print(query)
    result = execute_delete_query(query, [project_id])

    return result

def check_duplicate_projectname(project_name, project_id =0):
    query = """SELECT COUNT(project_name) FROM reconcile_schema.projects WHERE LOWER(project_name)=LOWER(%s) AND project_id<>%s"""
    data = execute_get_query(query, [project_name, project_id])
    result = int(data[0]["count"])
    if(result > 0):
        return True
    else:
        return False