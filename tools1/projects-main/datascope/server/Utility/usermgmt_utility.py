"""
=============================================================================
COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
from random import weibullvariate
from Utility import postgres_conn as postgres_connection
from datetime import datetime
import json


def get_users():
    query = '''select * from public."Users" where role_id=3 order by user_id asc'''
    ret = postgres_connection.execute_get_query(query, '')
    return ret


def get_project_details(request):
    tenant_id = request.GET.get("tenant_id")
    account_mail = request.GET.get("user_mail")
    account_mail = json.loads(account_mail)["accountMail"]
    proj_id = get_projid_by_mail(account_mail)
    if (proj_id == "No Project"):
        return "No Project"
    else:
        ret = get_project_details_by_projid(proj_id)
        return ret


def get_projid_by_mail(mail):
    try:
        query = '''select a.project_id from public."ProjectUsersMapping" a, public."Users" b where a.user_id=b.user_id and b.user_mail like %s'''
        ret = postgres_connection.execute_get_query(query, [str(mail)])
        proj_id = ret['data'][0]["project_id"]
        return proj_id
    except:
        return "No Project"


def get_project_details_by_projid(project_id):
    # this should be a relational query to get lead detail by project id
    query = '''select a.projectname, a.created_on, a.status ,b.user_name as lead_name, b.user_mail as lead_mail
               from public."Projects" a, public."Users" b where a.leadid=b.user_id and a.projid =%s'''
    ret = postgres_connection.execute_get_query(query, [project_id])
    return ret


# rovisioned Resources
def get_resource_provisioned(request):
    tenant_id = request.GET.get("tenant_id")
    account_mail = request.GET.get("account_mail")
    # account_details = json.loads(account_details)
    project_id = get_projid_by_mail(account_mail)
    if (project_id == "No Project"):
        return "No Project"
    else:
        return get_resources_by_project_id(project_id)


def get_resources_by_project_id(project_id):
    # this should be a relational query to get resources details by project id
    query_kub = '''SELECT * FROM public."KubernetesCluster" WHERE proj_id=%s'''
    query_res = '''SELECT *
                FROM public."KubernetesCluster"
                INNER JOIN public."DeployedResources"
                ON "KubernetesCluster".kubernetesid = "DeployedResources".aks_id 
                WHERE "KubernetesCluster".proj_id = %s'''
    ret_kub = postgres_connection.execute_get_query(query_kub, [project_id])
    ret_res = postgres_connection.execute_get_query(query_res, [project_id])
    return ret_kub, ret_res
