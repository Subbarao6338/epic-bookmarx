from python_terraform import *
from az.cli import az
from kubernetes import client, config
import subprocess
import json
import yaml
from Utility import autodeploy_utility

def resource_deploy(template_dir, request):
    resource_name = request.GET.get('resource_name')
    resource_location = request.GET.get('resource_location')
    page_type = request.GET.get('page_type')
    
    data = {}
    data['resource_group_name'] = resource_name
    data['resource_group_location'] = resource_location

    if page_type == "kubernetes":
        kubernetes_name = request.GET.get('kubernetes_name')
        node_count = request.GET.get('node_count')
        data['kubernetes_cluster_name'] = kubernetes_name
        data['node_count'] = node_count

    json_data = json.dumps(data)

    tf = Terraform(working_dir=template_dir,variables=data)
    #sys.stdout = open("deploylogs.txt", "w")
    log = open("deploylogs.txt", "w")
    stdout = sys.stdout
    sys.stdout = log
    tf.init()
    tf.plan(capture_output='yes', no_color=IsNotFlagged, refresh=False)
    tf.apply(capture_output='yes', no_color=IsNotFlagged, skip_plan=True)

    if page_type == "kubernetes":
        print("\n\n Kubernetes Deployed Successfully.")
    elif page_type == "airflow":
        deploymentType = request.GET.get('deploymentType')
        if deploymentType == "App Service":
            resourcedetails = {}
            url = "https://graviton-airflow.azurewebsites.net"
            resourcedetails['access_url'] = url
            resourcedetails['steps'] = []

            print("\n\n Airflow App Service Deployed Successfully.")
            print("\n Airflow Access URL: \""+url+"\"")
            print("\n Note: Airflow Access URL will be running within minutes")
            status = "Completed"
            autodeploy_utility.updateDeployedResourcesStatus(request,json.dumps(resourcedetails),status)
    log.close()
    sys.stdout = stdout   
       

def component_deploy(request):
    resource_name = request.GET.get('resource_name')
    page_type = request.GET.get('page_type')
    kubernetes_name = request.GET.get('kubernetes_name')
    
    if page_type == "airflow":   
        adminuser = request.GET.get('adminuser')
        adminpassword = request.GET.get('adminpassword')
        update_yaml_values(adminuser,adminpassword);
        repo_url = 'https://airflow.apache.org'
        repo_name = 'apache-airflow'
        release_name = 'airflow'
        chart_name = 'apache-airflow/airflow'
        namespace = '--namespace=airflow'
      
    elif page_type == "airbyte":  
        repo_url = 'https://contra.github.io/helm-charts/charts/airbyte/'
        repo_name = 'airbyte'
        release_name = 'airbyte'
        chart_name = 'airbyte/airbyte'
        namespace = '--namespace=airbyte'
      
 
    finalresource_name = resource_name+"_rg"
    log = open("deploylogs.txt", "w")
    stdout = sys.stdout
    sys.stdout = log
    exit_code, result_dict, logs = az("aks get-credentials --name "+kubernetes_name+" --resource-group "+finalresource_name+" --overwrite-existing")

    config.load_kube_config()  # for local environment
    # # or
    # config.load_incluster_config()

    subprocess.run(['curl', '-LO', 'https://storage.googleapis.com/kubernetes-release/release/v1.18.0/bin/windows/amd64/kubectl.exe'])

    subprocess.run(['kubectl', 'config', 'use-context', kubernetes_name], stdout=log, stderr=log)

    # Creating namespace
    subprocess.run(['kubectl', 'create', 'namespace', page_type], stdout=log, stderr=log)

    # set the namespace
    subprocess.run(['kubectl', 'config', 'set-context', kubernetes_name, namespace], stdout=log, stderr=log)
   
    # Add airflow repo into helm
    subprocess.run(['helm', 'repo', 'add', repo_name, repo_url ,'--force-update'], stdout=log, stderr=log)
   
    # Update Helm Repo
    subprocess.run(['helm', 'repo', 'update'], stdout=log, stderr=log)

    if page_type == "airflow":
        # install airflow
        subprocess.run(['helm', 'install', release_name, chart_name, '--namespace', page_type, '-f', './airflow.yaml', '--debug'], stdout=log, stderr=log)
    elif page_type == "airbyte":
        subprocess.run(['helm', 'install', release_name, chart_name, '--namespace', page_type, '--debug'], stdout=log, stderr=log)

    # Check the services details
    subprocess.run(['kubectl', 'get', 'service'], stdout=log, stderr=log)

    if page_type == "airflow":
        # run the airflow
        url = "https://localhost:8080"
        steps_arr = []
        Step1 = "1. Install KubeCtl"
        Step2 = "2. Run this Command: \"kubectl port-forward --namespace "+page_type+" service/airflow-webserver 8080:8080\""
        Step3 = "3. Airflow Access URL: \""+url+"\""
        steps_arr.append(Step1)
        steps_arr.append(Step2)
        steps_arr.append(Step3)

        print("\n\n Airflow Deployed in Kubernetes Successfully.")
        print("\n\n Note:")
        print(Step1)
        print(Step2)
        print(Step3)
        #print("\t\t kubectl port-forward --namespace "+page_type+" service/airflow-webserver 8080:8080")
        #print("\t\t https://localhost:8080")
        #subprocess.run(['kubectl', 'port-forward', '--namespace', page_type, 'service/airflow-webserver', '8080:8080'], stdout=log, stderr=log)
        
    elif page_type == "airbyte":
        url = "https://localhost:8080"
        Step1 = "1. Install KubeCtl"
        Step2 = "2. Run this Command: \"kubectl port-forward --namespace "+page_type+" service/airbyte-webapp 8080:80\""
        Step3 = "3. Airbyte Access URL: \""+url+"\""
        steps_arr.append(Step1)
        steps_arr.append(Step2)
        steps_arr.append(Step3)


        print("\n\n Airbyte Deployed in Kubernetes Successfully.")
        print("\n\n Note:")
        print(Step1)
        print(Step2)
        print(Step3)
        #subprocess.run(['kubectl', 'port-forward', '--namespace', page_type, 'service/airbyte-webapp', '8080:80'], stdout=log, stderr=log)
    log.close()
    sys.stdout = stdout

    resourcedetails = {}
    resourcedetails['access_url'] = url
    resourcedetails['steps'] = steps_arr
    status = "Completed"
    autodeploy_utility.updateDeployedResourcesStatus(request,json.dumps(resourcedetails),status)

def update_yaml_values(adminuser,adminpassword):
    filename = "airflow.yaml"
    with open(filename) as f:
        data = yaml.safe_load(f)
        data['webserver']['defaultUser']['username'] = adminuser
        data['webserver']['defaultUser']['password'] = adminpassword

    with open(filename, 'w') as yaml_file:
        yaml_file.write( yaml.dump(data, default_flow_style=False))

    ### AIRFLOW ###
    # --------
    # DEPLOY:
    # ========
    # kubectl create namespace airflow
    # kubectl config set-context graviton_kubeairflow_aks --namespace=airflow
    # helm repo add apache-airflow https://airflow.apache.org
    # helm repo update
    # helm install airflow apache-airflow/airflow --namespace airflow --debug
    # kubectl get service
    # kubectl port-forward service/airflow-web 8080:8080
    # --------
    # DELETE:
    # ========
    # helm delete airflow --namespace airflow
    # kubectl delete namespace airflow


    ### AIRBYTE ###
    # --------
    # DEPLOY:
    # ========
    # az aks get-credentials --name graviton_airflow_pavi_aks --resource-group graviton_airflow_pavi_rg
    # kubectl config use-context graviton_airflow_pavi_aks
    # kubectl create ns airbyte
    # kubectl config set-context graviton_airflow_pavi_aks --namespace=airbyte
    # helm repo add airbyte https://contra.github.io/helm-charts/charts/airbyte/
    # helm repo update
    # helm search repo airbyte
    # helm install airbyte airbyte/airbyte --namespace airbyte --debug
    # kubectl get service
    # kubectl port-forward --namespace airbyte service/airbyte-webapp 8080:80
    # --------
    # DELETE:
    # ========
    # helm delete airbyte --namespace airbyte
    # kubectl delete namespace airbyte

