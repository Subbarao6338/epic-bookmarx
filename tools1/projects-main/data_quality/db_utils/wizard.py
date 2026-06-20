from .db_connection import execute_get_query, execute_insert_query, execute_update_query, execute_delete_query


def drop_wizard():
    drop_wizard = "DROP TABLE IF EXISTS wizard_flow_data"
    result = execute_delete_query(drop_wizard,)
    return result

def create_wizard():
    wizard_table = """CREATE TABLE IF NOT EXISTS wizard_flow_data (
	id SERIAL PRIMARY KEY,
    status VARCHAR,
    current_page VARCHAR,
	datasource_name VARCHAR UNIQUE,
	data_assets VARCHAR,
    asset_for_profile VARCHAR,
    all_columns VARCHAR,
	selected_ce VARCHAR,
    expectation_suite_name VARCHAR,
    suite_config VARCHAR,
    run_name VARCHAR
    );"""
    execute_insert_query(wizard_table,)
    return "Connected"


def get_count():
    query = """SELECT COUNT(*) FROM wizard_flow_data"""
    data = execute_get_query(query)
    length = int(data[0]['count'])
    return length

def insert_datasource_name_to_wizard(datasource_name):
    drop_wizard()
    create_wizard()
    current_page = "datasource"
    status = "in-progress"
    length = get_count()

    if (length==0):   
        query = """INSERT INTO wizard_flow_data (status, current_page, datasource_name) VALUES (%s, %s, %s);"""
        result = execute_insert_query(query, [status, current_page, datasource_name])
        return result
    else:
        query = """UPDATE wizard_flow_data SET status=%s, current_page=%s, datasource_name=%s WHERE id=1"""
        result = execute_update_query(query, [status, current_page, datasource_name])
        return result

def get_wizard_detail():
    query = """SELECT * FROM wizard_flow_data WHERE id=1;"""
    data = execute_get_query(query,)
    return data[0]

def update_asset_to_wizard(datasource_name, current_page, status, data_assets):
    query = """UPDATE wizard_flow_data SET status=%s, current_page=%s, data_assets=%s WHERE datasource_name=%s"""
    result = execute_update_query(query, [status, current_page, data_assets, datasource_name])
    return result

def update_all_cols_to_wizard(all_cols, asset_for_profile):
    query = """UPDATE wizard_flow_data SET asset_for_profile=%s, all_columns=%s WHERE id=1"""
    result = execute_update_query(query, [asset_for_profile, all_cols])
    return result

def update_wizard_status(status, current_page):
    query = """UPDATE wizard_flow_data SET status=%s, current_page=%s WHERE id=1"""
    result = execute_update_query(query, [status, current_page])
    return result

def update_selected_ce_to_wizard(selected_CEs, current_page):
    query = """UPDATE wizard_flow_data SET current_page=%s, selected_CE=%s WHERE id=1"""
    result = execute_update_query(query, [current_page, selected_CEs])
    return result

def update_suite_name_to_wizard(name):
    query = """UPDATE wizard_flow_data SET expectation_suite_name=%s WHERE id=1"""
    result = execute_update_query(query, [name])
    return result

