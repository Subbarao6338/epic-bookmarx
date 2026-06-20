from random import weibullvariate
from Utility import postgres_conn as postgres_connection
import datetime
import json
from datetime import datetime
import hashlib


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
    create_query = '''CREATE TABLE IF NOT EXISTS public."Projects"
                    (
                        projid SERIAL PRIMARY KEY,
                        projectname character varying(50) NOT NULL UNIQUE,
                        description character varying(500),    
                        leadid integer NOT NULL,                        
                        status boolean,
                        orgid integer,                                    
                        resourcegroup character varying(500),
                        created_on timestamp without time zone,
                        created_by varchar(100),
                        updated_on timestamp without time zone,
                        updated_by varchar(100)
                    )'''
    postgres_connection.execute_create_query(create_query)
    current_datetime = datetime.now()
    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)['params']
    projectname = json_req['projectname']
    description = json_req['description']
    resourcegroup = json_req['resourcegroup']
    org_id = 0
    status = json_req['status']
    tenant_id = json_req['tenant_id']
    user_name = json_req['user_name']
    leadid = int(get_leadid(user_name))
    acc_details = json_req['acc_details']
    # postgres query execution
    data_obj = (projectname, description, leadid, status, resourcegroup, org_id,
                current_datetime, acc_details)
    query = '''INSERT INTO public."Projects" (projectname, description, leadid, status, resourcegroup, orgid, created_on, created_by) values ( %s, %s, %s, %s, %s, %s, %s, %s);'''
    ret = postgres_connection.execute_insert_query(query, data_obj)
    return ret


def get_leadid(user_name):
    query = '''SELECT user_id from public."Users" where user_name=(%s);'''
    ret = postgres_connection.execute_get_query(query, [user_name])
    return ret["data"][0]['user_id']


def get_projectdetails():
    create_query = '''CREATE TABLE IF NOT EXISTS public."Projects"
                    (
                        projid SERIAL PRIMARY KEY,
                        projectname character varying(50) NOT NULL UNIQUE,
                        description character varying(500),    
                        leadid integer NOT NULL,                        
                        status boolean,
                        orgid integer,                                    
                        resourcegroup character varying(500),
                        created_on timestamp without time zone,
                        created_by varchar(100),
                        updated_on timestamp without time zone,
                        updated_by varchar(100)
                    )'''
    postgres_connection.execute_create_query(create_query)
    # query = '''select row_number() OVER (ORDER BY projid DESC) AS slno,a.projid,a.projectname,a.description,a.created_on,a.status,
    #             CASE a.status When '1' then 'Active' else 'InActive'end as status,a.leadid,b.user_name
    #             from  public."Projects" a, public."Users" b where a.leadid=b.user_id order by projid DESC;'''
    query = '''select row_number() OVER (ORDER BY b.projid DESC) AS slno,b.projid,b.projectname,
            b.description,b.created_on,b.status,
            CASE b.status When '1' then 'Active' else 'InActive'end as status,b.leadid,a.user_name,
            c.AKSClusterAllocatedCount,
            c.AKSNodesMaxLimit, 
            c.AKS_cluster_provisioned_count, 
            c.AKSNodesAllowedVmType,
            c.AKSAllowedRegions
            from ((public."Users" a
            inner join public."Projects" b on b.leadid=a.user_id)
            left join public."ProjectResource" c on b.projid=c.projid)
            order by projid DESC;'''
    ret = postgres_connection.execute_get_query(query, [])
    return ret


def delete_users(usermail, username):
    lead_id = get_leadid(username)
    query1 = """UPDATE public."Projects" SET leadid = NULL WHERE leadid = """ + \
        str(lead_id)
    ret1 = postgres_connection.execute_update_query(query1)
    query = '''DELETE from public."Users" WHERE user_mail = %s;'''
    # query = '''DELETE from public."Users" WHERE user_mail = %s;'''
    ret = postgres_connection.execute_delete_query(query, [usermail])
    return ret


def createuser(request):
    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)['params']
    user_name = json_req['Name']
    user_mail = json_req['Email']
    emp_id = json_req['Emp_ID']
    role_id = json_req['role_id']
    tenant_id = json_req['tenant_id']
    password = 'India@123'
    AccountRole = json_req['AccountRole']
    proj_id = json_req['proj_id']
    hassed = str(hashlib.md5(password.encode()).hexdigest())
    data_obj = (user_name, user_mail, emp_id, role_id, hassed)
    query = '''INSERT INTO public."Users" (user_name, user_mail, emp_id,role_id,password) values (%s,%s, %s,%s,%s);'''
    ret = postgres_connection.execute_insert_query(query, data_obj)
    if AccountRole != "DP Admin" and ret == "Success":
        ret = insert_userproject_mapping(
            user_name, user_mail, emp_id, role_id, proj_id)
    return ret


def insert_userproject_mapping(user_name, user_mail, emp_id, role_id, proj_id):
    query = '''select user_id from  public."Users" where user_name=%s and user_mail=%s and emp_id=%s and role_id=%s;'''
    ret = postgres_connection.execute_get_query(
        query, [user_name, user_mail, emp_id, role_id])
    data_obj = (proj_id, ret['data'][0]['user_id'])
    query = '''INSERT INTO public."ProjectUsersMapping" (project_id, user_id) values (%s,%s);'''
    ret = postgres_connection.execute_insert_query(query, data_obj)
    return ret


def isuserexists(user_name, user_mail, user_type, user_id):
    if (user_type == 'create'):
        query = f"""SELECT count(user_id) FROM public."Users" WHERE user_name='{user_name}' OR user_mail='{user_mail}'"""
        result = postgres_connection.execute_get_query(query, '')
        return result
    else:
        query = f"""SELECT count(user_id) FROM public."Users" WHERE user_name='{user_mail}' OR user_mail='{user_mail}'"""
        result = postgres_connection.execute_get_query(query, '')
        return result


def get_userdetails(request):
    AccountRole = request.GET['AccountRole']
    proj_id = request.GET['proj_id']
    role_id = "3" if AccountRole == "DP Admin" else "4"
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
    if AccountRole == "DP Admin":
        query = '''SELECT row_number() OVER (ORDER BY user_id DESC) AS slno, Users.user_name,
              user_mail, joined_on,Projects.projectname,created_on FROM public."Users" as Users
              LEFT OUTER JOIN public."Projects" as Projects ON Users.user_id=Projects.leadid where role_id=3'''
        ret = postgres_connection.execute_get_query(query, [])
        temp = list(set([val['user_name'] for val in ret['data']]))
        new_ret = {}
        final_ls = []
        ind = 1
        for lead in temp:
            isvisited = 0
            user_details = {}
            project_detail = []
            for val in ret['data']:
                temp_proj = {}
                if val['user_name'] == lead and isvisited == 0:
                    user_details['slno'] = ind
                    user_details['user_name'] = val['user_name']
                    user_details['user_mail'] = val['user_mail']
                    user_details['joined_on'] = val['joined_on']
                    temp_proj['created_on'] = val['created_on']
                    temp_proj['projectname'] = val['projectname']
                    project_detail.append(json.dumps(temp_proj))
                    isvisited = 1
                    ind = ind + 1
                elif val['user_name'] == lead and isvisited == 1:
                    temp_proj['created_on'] = val['created_on']
                    temp_proj['projectname'] = val['projectname']
                    project_detail.append(json.dumps(temp_proj))
            user_details['project_details'] = project_detail
            final_ls.append(user_details)
        new_ret['data'] = final_ls
        return new_ret
    else:
        query = '''
                select row_number() OVER (ORDER BY a.user_id DESC) AS slno,a.user_id,a.user_name,a.user_mail,a.emp_id,a.joined_on,b.project_id from public."Users" a, 
                public."ProjectUsersMapping" b where a.user_id=b.user_id and role_id=%s and b.project_id=%s order by a.user_id DESC
                '''
        ret = postgres_connection.execute_get_query(query, [role_id, proj_id])
        return ret


def update_projects(request):
    current_datetime = datetime.now()
    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)
    projid = json_req['projid']
    projectname = json_req['projectname']
    description = json_req['description']
    user_name = json_req['user_name']
    leadid = int(get_leadid(user_name))
    acc_details = json_req['acc_details']
    query = """UPDATE public."Projects" SET projectname = '{0}',description = '{1}', leadid = '{2}',updated_on = '{3}', updated_by = '{4}' WHERE projid = '{5}' """.format(
        projectname, description, leadid, current_datetime,
        acc_details, projid)
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
    count_ret = postgres_connection.execute_get_query(
        count_query, [AccountMail])
    if count_ret['data'][0]['count'] == '0':
        query = '''select projectname from public."Projects" where status=true order by projid desc limit 1'''
        ret = postgres_connection.execute_get_query(query, [])
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
    ret = postgres_connection.execute_get_query(query, [])

    projectlist = []
    for i in range(len(ret['data'])):
        projectlist.append(ret['data'][i]['projectname'])

    return projectlist


def update_projects_config(request):
    current_datetime = datetime.now()
    AccountMail = request.GET['AccountMail']
    ProjectName = request.GET['ProjectName']
    count_query = '''select count(*) from public."ProjectsConfig" where acc_mail=%s'''
    count_ret = postgres_connection.execute_get_query(
        count_query, [AccountMail])

    if count_ret['data'][0]['count'] == '0':
        data_obj = (ProjectName, AccountMail, current_datetime, AccountMail)
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
