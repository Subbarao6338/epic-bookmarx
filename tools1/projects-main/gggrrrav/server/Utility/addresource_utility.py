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
    query = '''select row_number() OVER (ORDER BY id DESC) AS slno,id,AKSClusterAllocatedCount,projid, AKSNodesMaxLimit ,AKS_cluster_provisioned_count,AKSNodesAllowedVmType ,AKSAllowedRegions from public."ProjectResource" order by id desc;'''
    ret = postgres_connection.execute_get_query(query, "")
    return ret


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
    data_obj = (projid, AKSClusterAllocatedCount, AKSNodesMaxLimit,0, AKSNodesAllowedVmType,AKSAllowedRegions)
    query = '''INSERT INTO public."ProjectResource" ( projid,AKSClusterAllocatedCount, AKSNodesMaxLimit,AKS_cluster_provisioned_count,AKSNodesAllowedVmType,AKSAllowedRegions) VALUES (%s, %s, %s, %s,%s,%s);'''
    ret = postgres_connection.execute_insert_query(query, data_obj)
    return ret    

     
def delete_projectresource(body):
    id = [body]
    query = '''DELETE from public."ProjectResource" WHERE id = %s;'''
    ret = postgres_connection.execute_delete_query(query, id)
    return ret


def delete_allprojectresource(self):
    query = '''DELETE from public."ProjectResource";'''
    ret = postgres_connection.execute_delete_all_query(query)
    # pass
    return ret 