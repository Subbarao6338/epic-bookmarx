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
import json


def getkubernetes_cluster():
    query = '''select kubernetesid,kubernetes_name,resource_name,resource_location from public."KubernetesCluster" where status=(%s)'''
    ret = postgres_connection.execute_get_query(query, ['Completed'])
    return ret


def create_kubernetescluster(request):
    create_query = '''CREATE TABLE IF NOT EXISTS public."KubernetesCluster"
    (
        kubernetesid SERIAL PRIMARY KEY, 
        resource_name Varchar (50)  unique,
        kubernetes_name character varying(50) NOT NULL,
        node_count character varying(50) NOT NULL,
        aks_nodes_vm_type    Varchar (30),
        resource_location varchar(30) ,
        environment    Varchar (30),
        proj_id    Integer,
        status character varying(50) NOT NULL
    )'''
    postgres_connection.execute_create_query(create_query)
    resource_name = request.GET.get('resource_name')
    kubernetes_name = request.GET.get('kubernetes_name')
    resource_location = request.GET.get('selectedresource_location')
    page_type = request.GET.get('page_type')
    environment = request.GET.get('environment')
    proj_id = request.GET.get('selectedProject')
    aks_nodes_vm_type = request.GET.get('selectedaks_nodes_vm_type')
    node_count = request.GET.get('node_count')
    status = request.GET.get('status')

    data_obj = (resource_name, kubernetes_name, node_count,
                resource_location, environment, proj_id, aks_nodes_vm_type, status)
    query = '''INSERT INTO public."KubernetesCluster" (resource_name,kubernetes_name,node_count,resource_location,environment,proj_id,aks_nodes_vm_type,status) values (%s, %s,%s,%s,%s,%s,%s,%s);'''
    ret = postgres_connection.execute_insert_query(query, data_obj)
    print(data_obj)
    return ret


def delete_kubernetescluster(resource_name, project_id):
    query = '''DELETE from public."KubernetesCluster" WHERE resource_name = %s;'''
    ret = postgres_connection.execute_delete_query(query, [resource_name])
    query1 = f"""UPDATE public."ProjectResource" SET aks_cluster_provisioned_count = aks_cluster_provisioned_count - 1 WHERE projid = '{project_id}'"""
    result = postgres_connection.execute_update_query(query1,)
    print(ret and result)
    return ret


def saveDeployedResources(request):
    kubernetes_id = request.GET.get('kubernetes_id')
    deploymentType = request.GET.get('deploymentType')
    deployed_resource = request.GET.get('page_type')
    status = "In-Progress"
    resource_details = ""
    data_obj = (kubernetes_id, deploymentType,
                deployed_resource, resource_details, status)
    query = '''INSERT INTO public."DeployedResources" (aks_id, deployment_type, deployed_resource, resource_details, status) values (%s, %s, %s, %s,%s);'''
    ret = postgres_connection.execute_insert_query(query, data_obj)
    return ret


def updateDeployedResourcesStatus(request, resource_details, status):
    kubernetes_id = request.GET.get('kubernetes_id')
    page_type = request.GET.get('page_type')
    deploymentType = request.GET.get('deploymentType')
    query = """UPDATE public."DeployedResources" SET status = '{0}',resource_details = '{1}' WHERE aks_id = '{2}' and deployed_resource='{3}' and deployment_type='{4}' """.format(
        status, resource_details, kubernetes_id, page_type, deploymentType)
    ret = postgres_connection.execute_update_query(query)
    return ret


def deleteDeployedResource(request):
    deploymentType = request.GET.get('deploymentType')
    deployed_resource = request.GET.get('deployed_resource')
    aks_id = request.GET.get('kubernetes_id')
    query = """DELETE FROM public."DeployedResources" WHERE aks_id=%s and deployment_type=%s and deployed_resource=%s"""
    ret = postgres_connection.execute_delete_query(
        query, [aks_id, deploymentType, deployed_resource])
    return ret


def getkubernetes_projectbased(request):
    proj_id = request.GET['proj_id']
    query = '''select row_number() OVER (ORDER BY kubernetesid DESC) AS slno,kubernetesid,kubernetes_name,resource_name,resource_location,node_count, aks_nodes_vm_type from public."KubernetesCluster" where proj_id=(%s) and status=(%s)'''
    ret = postgres_connection.execute_get_query(query, [proj_id, 'Completed'])
    return ret


def getprovisionedresource_projectbased(request):
    proj_id = request.GET['proj_id']
    query = '''select row_number() OVER (ORDER BY kubernetesid DESC) AS slno,a.kubernetes_name,a.kubernetesid,a.resource_name,b.deployed_resource,b.deployment_type,b.resource_details from public."KubernetesCluster" a, public."DeployedResources" b where a.kubernetesid=b.aks_id and a.proj_id=(%s) and b.status=(%s)'''
    ret = postgres_connection.execute_get_query(query, [proj_id, 'Completed'])
    return ret

############


def iskubernetesclusterexists(resource_name):
    query = '''SELECT count(kubernetesid) FROM public."KubernetesCluster" WHERE resource_name = %s'''
    result = postgres_connection.execute_get_query(query, [resource_name])
    return result


def update_status(resource_name, status):
    table_name = 'public."KubernetesCluster"'
    query = f"UPDATE {table_name} SET status='{str(status)}' WHERE resource_name = '{str(resource_name)}'"
    result = postgres_connection.execute_update_query(query,)
    return result


def get_leadid(user_mail):
    query = '''Select user_id from public."Users" where user_mail like %s;'''
    ret = postgres_connection.execute_get_query(query, [user_mail])
    return ret["data"][0]['user_id']


def get_project_name(request):
    AccountMail = request.GET['AccountMail']
    AccountName = request.GET['AccountName']
    query = '''select a.projid,a.projectname from public."Projects" a, public."Users" b where a.leadid=b.user_id and user_name=%s and user_mail=%s order by projid DESC'''
    ret = postgres_connection.execute_get_query(
        query, [AccountName, AccountMail])
    return ret


def get_project_resource(project_id):
    query = '''select aksallowedregions,aksnodesallowedvmtype, aksnodesmaxlimit, aks_cluster_provisioned_count, aksclusterallocatedcount
    from public."ProjectResource" where projid=%s'''
    ret = postgres_connection.execute_get_query(query, [project_id])
    print(ret)
    return ret


def update_provisioned_aks_count(project_id):
    query = f"""UPDATE public."ProjectResource" SET aks_cluster_provisioned_count = aks_cluster_provisioned_count + 1 WHERE projid = '{project_id}'"""
    result = postgres_connection.execute_update_query(query,)
    return result

def getvalidationforclear(request):
    proj_ids = request.GET['selected_proj_ids']
    proj_ids = tuple(set(proj_ids.split(",")))
    query = '''select aks_cluster_provisioned_count
    from public."ProjectResource" where projid in %s'''
    ret = postgres_connection.execute_get_query(query, [proj_ids])
    count = 0
    for count_ind in ret['data']:
        count = count + int(count_ind['aks_cluster_provisioned_count'])    
    return count