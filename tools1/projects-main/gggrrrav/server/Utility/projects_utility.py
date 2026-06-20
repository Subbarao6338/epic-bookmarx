from random import weibullvariate
from Utility import postgres_conn as postgres_connection
import datetime
import json
from datetime import datetime


def get_organizationdetails():
    create_query = '''CREATE TABLE  IF NOT EXISTS public."Organization"( 
                        id SERIAL PRIMARY KEY, 
                        name varchar(100), 
                        details varchar(100) 
                    )'''
    postgres_connection.execute_create_query(create_query)
    query = '''select name from public."Organization"'''
    ret = postgres_connection.execute_get_query(query, '')
    return ret


def create_projects(request):
    current_datetime = datetime.now()
    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)['params']
    projectname = json_req['projectname']
    details = json_req['details']
    resourcegroup = json_req['resourcegroup']
    orgname = json_req['orgname']
    if bool(json_req['status']):
        status = '1'
    else:
        status = '0'
    tenant_id = json_req['tenant_id']
    org_id_response = get_org_id(orgname)
    org_id = org_id_response['data'][0]['id']
    acc_details = json_req['acc_details']
    # postgres query execution
    data_obj = (projectname, details, resourcegroup, status, org_id,
                current_datetime, acc_details)
    query = '''INSERT INTO public."Projects" (projectname, details, resourcegroup, status, orgid, created_on, created_by) values (%s, %s, %s, %s, %s, %s,%s);'''
    ret = postgres_connection.execute_insert_query(query, data_obj)
    return ret


def get_org_id(orgname):
    query = '''SELECT id from public."Organization" where name=(%s);'''
    ret = postgres_connection.execute_get_query(query, [orgname])
    return ret


def get_projectdetails(body):
    create_query = '''CREATE TABLE IF NOT EXISTS public."Projects" 
                    ( 
                        projid SERIAL PRIMARY KEY, 
                        projectname character varying(50) NOT NULL UNIQUE, 
                        details character varying(500), 
                        resourcegroup character varying(500), 
                        status boolean, 
                        orgid integer NOT NULL, 
                        created_on timestamp without time zone, 
                        created_by varchar(100), 
                        updated_on timestamp without time zone, 
                        updated_by varchar(100) 
                    )'''
    postgres_connection.execute_create_query(create_query)
    tenant_id = body
    query = '''select row_number() OVER (ORDER BY projid DESC) AS slno,a.projid,a.projectname,a.details,a.resourcegroup,a.created_on,a.status, 
               CASE a.status When '1' then 'Active' else 'InActive'end as status,a.orgid,b.name  
               from  public."Projects" a, public."Organization" b where a.orgid=b.id order by projid DESC;'''
    ret = postgres_connection.execute_get_query(query, [])
    return ret

def delete_users(body):
    user_mail = [body]
    query = '''DELETE from public."Users" WHERE user_mail = %s;'''
    ret = postgres_connection.execute_delete_query(query, user_mail)
    print(ret)
    return ret

def createuser(request):
    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)['params']
    user_name = json_req['Name']
    user_mail = json_req['Email']
    emp_id = json_req['Emp_ID']
    role_id = json_req['role_id']
    tenant_id = json_req['tenant_id']
    data_obj = (user_name, user_mail,emp_id,role_id)
    query = '''INSERT INTO public."Users" (user_name, user_mail, emp_id,role_id) values (%s,%s, %s,%s);'''
    ret = postgres_connection.execute_insert_query(query, data_obj)
    return ret

def isuserexists(user_name, user_mail,user_type, user_id): 
    if (user_type == 'create'):
        query = f"""SELECT count(user_id) FROM public."Users" WHERE user_name='{user_name}' OR user_mail='{user_mail}'"""
        result = postgres_connection.execute_get_query(query, '')
        return result
    else:
        query = f"""SELECT count(user_id) FROM public."Users" WHERE user_name='{user_mail}' OR user_mail='{user_mail}'"""
        result = postgres_connection.execute_get_query(query, '')
        return result        


def get_userdetails(body):
    create_query = '''CREATE TABLE IF NOT EXISTS public."Users" 
                    ( 
                         user_id SERIAL PRIMARY KEY,
                         user_name character varying(50) NOT NULL UNIQUE,
                         user_mail character varying(500) ,
                         user_profile character varying(500) ,
                         password character varying(500) ,
                         emp_id character varying(30)   
                    )'''
    postgres_connection.execute_create_query(create_query)
    tenant_id = body
    query = '''
               select row_number() OVER (ORDER BY user_id DESC) AS slno,user_id,user_name,user_mail,created_on,projectname,
               user_profile,password,emp_id from  public."Users" as Users
			   inner join public."Projects" as Projects on Users.user_id=Projects.projid
			   where role_id=3 order by user_id DESC
               '''
    ret = postgres_connection.execute_get_query(query, [])
    return ret


def update_projects(request):
    current_datetime = datetime.now()
    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)
    projectname = json_req['projectname']
    projid = json_req['projid']
    details = json_req['details']
    resourcegroup = json_req['resourcegroup']
    orgid = json_req['orgid']
    if bool(json_req['status']):
        status = '1'
    else:
        status = '0'
    acc_details = json_req['acc_details']
    query = """UPDATE public."Projects" SET projectname = '{0}',details = '{1}', resourcegroup= '{2}', status = '{3}', updated_on = '{4}', updated_by = '{5}',orgid = '{6}' WHERE projid = '{7}' """.format(
        projectname, details, resourcegroup, status, current_datetime,
        acc_details, orgid, projid)
    ret = postgres_connection.execute_update_query(query)
    return ret


def delete_projects(body):
    projectname = [body]
    query = '''DELETE from public."Projects" WHERE projectname = %s;'''
    ret = postgres_connection.execute_delete_query(query, projectname)
    return ret


def isprojectexists(project_name, page_type, project_id):
    if (page_type == 'create'):
        query = '''SELECT count(projid) FROM public."Projects" WHERE projectname ilike %s'''
        result = postgres_connection.execute_get_query(query, [project_name])
        return result
    else:
        query = '''SELECT count(projid) FROM public."Projects" WHERE projid <> %s and projectname ilike %s'''
        result = postgres_connection.execute_get_query(
            query, [project_id, project_name])
        return result

def projects_config(request):
    AccountMail = request.GET['AccountMail']

    create_query = '''CREATE TABLE IF NOT EXISTS public."ProjectsConfig" 
                    ( 
                        id SERIAL PRIMARY KEY, 
						projectname varchar(50) NOT NULL, 
						acc_mail varchar(100),
                        selected_on timestamp without time zone, 
                        selected_by varchar(100) 
                    )'''

    postgres_connection.execute_create_query(create_query)

    count_query = '''select count(*) from public."ProjectsConfig" where acc_mail=%s'''
    count_ret = postgres_connection.execute_get_query(count_query, [AccountMail])
    if count_ret['data'][0]['count'] == '0':
        query = '''select projectname from public."Projects" where status=true order by projid desc limit 1'''
        ret = postgres_connection.execute_get_query(query,[])
        return ret
    else:
        query = '''select projectname from public."ProjectsConfig" where acc_mail=%s'''
        ret = postgres_connection.execute_get_query(query, [AccountMail])
        return ret

def projects_nameslist(request):
    # AccountMail = request.GET['AccountMail']
    # query = '''select projectname from public."Projects" where status=true and created_by=%s order by projid desc'''
    # ret = postgres_connection.execute_get_query(query, [AccountMail])

    query = '''select projectname from public."Projects" where status=true order by projid desc'''
    ret = postgres_connection.execute_get_query(query,[])
    
    projectlist = []
    for i in range(len(ret['data'])):
        projectlist.append(ret['data'][i]['projectname'])

    return projectlist

def update_projects_config(request):
    current_datetime = datetime.now()
    AccountMail = request.GET['AccountMail']
    ProjectName = request.GET['ProjectName']

    count_query = '''select count(*) from public."ProjectsConfig" where acc_mail=%s'''
    count_ret = postgres_connection.execute_get_query(count_query, [AccountMail])

    if count_ret['data'][0]['count'] == '0':
        data_obj = (ProjectName,AccountMail,current_datetime,AccountMail)
        query = '''INSERT INTO public."ProjectsConfig" (projectname, acc_mail, selected_on, selected_by) values (%s, %s, %s, %s);'''
        ret = postgres_connection.execute_insert_query(query, data_obj)
        return ret
    else:
        query = """UPDATE public."ProjectsConfig" SET projectname = '{0}',selected_on = '{1}' WHERE acc_mail = '{2}' """.format(
        ProjectName, current_datetime, AccountMail)
        ret = postgres_connection.execute_update_query(query)
        return ret

def getprojects_userbased(request):
    AccountMail = request.GET['AccountMail']
    AccountName = request.GET['AccountName']
    
    #query = '''select projid,projectname,description from public."Projects" where created_by=%s order by projid DESC;'''
    query = '''select * from public."Projects" a, public."Users" b where a.leadid=b.user_id and user_name=%s order by projid DESC'''
    ret = postgres_connection.execute_get_query(query, [AccountName])
    return ret

def getresources_projectbased(request):
    proj_id = request.GET['proj_id']
    query = '''select projid,aksclusterallocatedcount,aksnodesmaxlimit,aks_cluster_provisioned_count,aksnodesallowedvmtype,aksallowedregions from public."ProjectResource" where projid=%s'''
    ret = postgres_connection.execute_get_query(query, [proj_id])
    return ret

    