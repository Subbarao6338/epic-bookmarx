from random import weibullvariate
from Utility import postgres_conn as postgres_connection
import json

def getkubernetes_cluster():
    query = '''select kubernetesid,kubernetes_name,resource_name,resource_location from public."KubernetesCluster" where status=(%s)'''
    ret = postgres_connection.execute_get_query(query, ['Completed'])
    return ret

def create_kubernetescluster(request):
    # create_query = '''CREATE TABLE IF NOT EXISTS public."KubernetesCluster"
    # (
    #     id SERIAL PRIMARY KEY, 
    #     resource_name character varying(50) NOT NULL UNIQUE,
    #     resource_location character varying(50) NOT NULL,
    #     kubernetes_name character varying(50) NOT NULL,
    #     node_count character varying(50) NOT NULL,
    #     status character varying(50) NOT NULL
    # )'''
    # postgres_connection.execute_create_query(create_query)


    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)['params']
    kubernetes_name = json_req['kubernetes_name'] 
    resource_name = json_req['resource_name']
    resource_location = json_req['resource_location']
    node_count = json_req['node_count']
    status = json_req['status']
    # postgres query execution
    data_obj = (kubernetes_name,resource_name,resource_location,node_count,status)
    query = '''INSERT INTO public."KubernetesCluster" (kubernetes_name, resource_name,resource_location, node_count,status) values (%s, %s, %s, %s,%s);'''
    ret = postgres_connection.execute_insert_query(query, data_obj)
    print(data_obj)
    return ret


def delete_kubernetescluster(body):
    resource_name = [body]
    query = '''DELETE from public."KubernetesCluster" WHERE resource_name = %s;'''
    ret = postgres_connection.execute_delete_query(query, resource_name)
    return ret

def saveDeployedResources(request):
    # req_body = request.body.decode('utf-8')
    # json_req = json.loads(req_body)['params']

    kubernetes_id = request.GET.get('kubernetes_id')
    deploymentType = request.GET.get('deploymentType')
    deployed_resource = request.GET.get('page_type')
    status = "In-Progress"
    resource_details = ""

    data_obj = (kubernetes_id,deploymentType,deployed_resource,resource_details,status)
    query = '''INSERT INTO public."DeployedResources" (aks_id, deployment_type, deployed_resource, resource_details, status) values (%s, %s, %s, %s,%s);'''
    ret = postgres_connection.execute_insert_query(query, data_obj)
    return ret


def updateDeployedResourcesStatus(request,resource_details,status):
    # req_body = request.body.decode('utf-8')
    # json_req = json.loads(req_body)['params']

    kubernetes_id = request.GET.get('kubernetes_id')
    page_type = request.GET.get('page_type')
    deploymentType = request.GET.get('deploymentType')
    query = """UPDATE public."DeployedResources" SET status = '{0}',resource_details = '{1}' WHERE aks_id = '{2}' and deployed_resource='{3}' and deployment_type='{4}' """.format(
    status, resource_details, kubernetes_id, page_type, deploymentType)
    ret = postgres_connection.execute_update_query(query)
    return ret


def getkubernetes_projectbased(request):
    proj_id = request.GET['proj_id']
    query = '''select row_number() OVER (ORDER BY kubernetesid DESC) AS slno,kubernetesid,kubernetes_name,resource_name,resource_location,node_count from public."KubernetesCluster" where proj_id=(%s) and status=(%s)'''
    ret = postgres_connection.execute_get_query(query, [proj_id,'Completed'])
    return ret


def getprovisionedresource_projectbased(request):
    proj_id = request.GET['proj_id']
    query = '''select row_number() OVER (ORDER BY kubernetesid DESC) AS slno,a.kubernetes_name,b.deployed_resource,b.deployment_type,b.resource_details from public."KubernetesCluster" a, public."DeployedResources" b where a.kubernetesid=b.aks_id and a.proj_id=(%s) and b.status=(%s)'''
    ret = postgres_connection.execute_get_query(query, [proj_id,'Completed'])
    return ret
