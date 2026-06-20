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
from python_terraform import *
from az.cli import az
from kubernetes import client, config
import subprocess
from Utility import autodeploy_utility
import os

cwdPath = os.path.abspath(os.getcwd())
Template_Path = os.path.join(cwdPath, 'terraform_template')


def resource_destroy(template_dir, request):
    template_dir = os.path.join(Template_Path, template_dir)
    resource_name = request.GET.get('resource_name')
    resource_location = request.GET.get('selectedresource_location')
    page_type = request.GET.get('page_type')

    data = {}
    data['resource_group_name'] = resource_name
    data['resource_group_location'] = resource_location

    if page_type == "kubernetes":
        kubernetes_name = request.GET.get('kubernetes_name')
        node_count = request.GET.get('node_count')
        data['kubernetes_cluster_name'] = kubernetes_name
        data['node_count'] = node_count

    # json_data = json.dumps(data)

    tf = Terraform(working_dir=template_dir, variables=data)
    log = open(os.path.join(cwdPath, 'deploylogs.txt'), "w")
    stdout = sys.stdout
    sys.stdout = log
    print("\n\nTerraform Destroy")
    print("-----------------")
    tf.destroy(capture_output='yes', no_color=IsNotFlagged,
               force=IsNotFlagged, auto_approve=True)

    if page_type == "kubernetes":
        print("\n\n Kubernetes Deleted Successfully.")
    elif page_type == "airflow":
        deploymentType = request.GET.get('deploymentType')
        if deploymentType == "App Service":
            print("\n\n Airflow App Service Deleted Successfully.")
            autodeploy_utility.updateDeployedResourcesStatus(
                request, "", "Deleted")

    log.close()
    sys.stdout = stdout


def component_destroy(request):
    page_type = request.GET.get('page_type')
    resource_name = request.GET.get('resource_name')
    kubernetes_name = request.GET.get('kubernetes_name')
    finalresource_name = resource_name+"_rg"
    log = open(os.path.join(cwdPath, 'deploylogs.txt'), "w")
    stdout = sys.stdout
    sys.stdout = log
    exit_code, result_dict, logs = az("aks get-credentials --name "+kubernetes_name +
                                      " --resource-group "+finalresource_name+" --overwrite-existing")

    config.load_kube_config()  # for local environment
    # # or
    # config.load_incluster_config()

    subprocess.run(['kubectl', 'config', 'use-context',
                   kubernetes_name], stdout=log, stderr=log)

    # Delete Helm Chart
    subprocess.run(['helm', 'delete', page_type, '--namespace',
                   page_type], stdout=log, stderr=log)

    # Delete Namespace
    subprocess.run(['kubectl', 'delete', 'namespace',
                   page_type], stdout=log, stderr=log)

    if page_type == "airflow":
        print("\n\n Airflow Deleted in Kubernetes Successfully.")
    elif page_type == "airbyte":
        print("\n\n Airbyte Deleted in Kubernetes Successfully.")
    # autodeploy_utility.updateDeployedResourcesStatus(request, "", "Deleted")
    autodeploy_utility.deleteDeployedResource(request)

    log.close()
    sys.stdout = stdout
