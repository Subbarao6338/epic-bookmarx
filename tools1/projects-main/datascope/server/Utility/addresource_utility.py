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
import datetime
import json
from datetime import datetime


def get_projectresource(body):
    create_query = '''CREATE TABLE  IF NOT EXISTS public."ProjectResource"
                    (
                        id SERIAL PRIMARY KEY,
                        projid integer not null,
                        AKSClusterAllocatedCount integer NOT NULL,
                        AKSNodesMaxLimit integer NOT NULL,
                        AKS_cluster_provisioned_count integer,
                        AKSNodesAllowedVmType  Varchar(500), 
                        AKSAllowedRegions Varchar(500),
                        CONSTRAINT fk_Projects
                        FOREIGN KEY (projid)
                        REFERENCES public."Projects"(projid));'''
    postgres_connection.execute_create_query(create_query)
    tenant_id = body
    query = '''select row_number() OVER (ORDER BY id DESC) AS slno,id,AKSClusterAllocatedCount,a.projid,b.projectname, AKSNodesMaxLimit ,AKS_cluster_provisioned_count,AKSNodesAllowedVmType ,AKSAllowedRegions from public."ProjectResource" a, public."Projects" b  where a.projid=b.projid order by id desc;'''
    ret = postgres_connection.execute_get_query(query, "")
    return ret


def get_configured_resources(proj_id):
    try:
        query = '''select AKSClusterAllocatedCount, AKSNodesMaxLimit ,AKS_cluster_provisioned_count,AKSNodesAllowedVmType ,AKSAllowedRegions from public."ProjectResource" where projid=%s;'''
        ret = postgres_connection.execute_get_query(query, [proj_id])
        if (len(ret['data']) == 0):
            return {"data": 0, "message": "No Configuration found"}
        else:
            return ret
    except:
        return {"data": -1, "message": "Error while fetching the data"}


def create_projectresource(request):
    print(request)
    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)['params']
    print(json_req)
    AKSClusterAllocatedCount = json_req['AKSClusterAllocatedCount']
    AKSNodesMaxLimit = json_req['AKSNodesMaxLimit']
    AKSNodesAllowedVmType = json_req['AKSNodesAllowedVmType']
    AKSAllowedRegions = json_req['AKSAllowedRegions']
    projid = json_req['projid']
    # tenant_id = json_req['tenant_id']
    data_obj = (projid, AKSClusterAllocatedCount, AKSNodesMaxLimit,
                0, AKSNodesAllowedVmType, AKSAllowedRegions)
    query = '''INSERT INTO public."ProjectResource" ( projid,AKSClusterAllocatedCount, AKSNodesMaxLimit,AKS_cluster_provisioned_count,AKSNodesAllowedVmType,AKSAllowedRegions) VALUES (%s, %s, %s, %s,%s,%s);'''
    ret = postgres_connection.execute_insert_query(query, data_obj)
    return ret


def delete_projectresource(body):
    try:
        id = [body]
        query = '''DELETE from public."ProjectResource" WHERE projid = %s;'''
        ret = postgres_connection.execute_delete_query(query, id)
        return ret
    except:
        return "Failed"


def delete_allprojectresource(self):
    query = '''DELETE from public."ProjectResource";'''
    ret = postgres_connection.execute_delete_all_query(query)
    # pass
    return ret


def delete_selected_configurations(request):
    try:
        proj_ids = request.GET['selected_proj_ids']
        project_names = request.GET['selected_project_names'].split(",")
        user_inp = request.GET['user_input'].split(",")
        if (set(project_names) == set(user_inp)):
            proj_ids = tuple(set(proj_ids.split(",")))
            query = '''DELETE from public."ProjectResource" WHERE projid IN %s'''
            ret = postgres_connection.execute_delete_query(query, [proj_ids])
            return ret
        else:
            return "Not Matched"
    except:
        return "Failed"


def update_projectresource(request):
    try:
        req_body = request.body.decode('utf-8')
        json_req = json.loads(req_body)
        print("PRINT--->", json_req)
        projid = json_req['projid']
        aksclusterallocatedcount = json_req['aksclusterallocatedcount']
        aksnodesmaxlimit = json_req['aksnodesmaxlimit']
        aksnodesallowedvmtype = json_req['aksnodesallowedvmtype']
        aksallowedregions = json_req['aksallowedregions']
        if (json_req["create"]):
            query = """INSERT INTO public."ProjectResource" (projid,aksclusterallocatedcount,aksnodesmaxlimit,
            aks_cluster_provisioned_count,aksnodesallowedvmtype,aksallowedregions) VALUES (%s, %s, %s, %s,%s,%s)"""
            ret = postgres_connection.execute_insert_query(
                query, [projid, aksclusterallocatedcount, aksnodesmaxlimit, 0, aksnodesallowedvmtype, aksallowedregions])
        else:
            query = """UPDATE public."ProjectResource" SET aksclusterallocatedcount = '{0}',aksnodesmaxlimit = '{1}', aksnodesallowedvmtype = '{2}', aksallowedregions = '{3}' WHERE projid = '{4}' """.format(
                aksclusterallocatedcount, aksnodesmaxlimit, aksnodesallowedvmtype, aksallowedregions, projid)
            ret = postgres_connection.execute_update_query(query)
        return ret
    except:
        return "Failed"
