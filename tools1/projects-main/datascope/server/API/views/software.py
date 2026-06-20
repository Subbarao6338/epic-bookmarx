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
import json
import requests
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt


Flow_ID = "143"
Tenant_ID = "d0c9f92c-e2ae-4903-b31b-25ea806607ca"
Secret_ID = "Q.2mIB_~9Ryw63IiIJgWz_.YjYJhEa2-3r"
Client_ID="762321cf-c192-484a-82ff-4aa25a69fe36"
Subscription_ID="eb52cc0f-995f-4f31-bb29-9d18d72c983e"
PayloadValue = 'flowId='+Flow_ID+'&Azure_Tenant_ID='+Tenant_ID+'&Azure_Client_Secret='+Secret_ID+'&Azure_Client_ID='+Client_ID+'&Azure_Subscription_ID='+Subscription_ID



@csrf_exempt
def deploy_software(request):
    api_name = request.GET['api_name']
    api_type = request.GET['api_type']
    print("api_name :>>",api_name)

    if api_type =="POST":

        payload= PayloadValue
        headers = {
        'authority': 'istudio.thecloudbridge.net',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'Content-Type': 'application/x-www-form-urlencoded'
        }

        if api_name == "InfraCost":
            url = "https://istudio.thecloudbridge.net/py-api/InfraCommand/prathameshwar.singh@hcl.com/azure/Graviton/App_Deployment20220426T070754413/infra-price"
        elif api_name == "DeployInfra":
            url = "https://istudio.thecloudbridge.net/py-api/InfraCommand/prathameshwar.singh@hcl.com/azure/Graviton/App_Deployment20220426T070754413/install-infra"    
        elif api_name == "DeployIstio":
            url = "https://istudio.thecloudbridge.net/py-api/kubeDeployment/prathameshwar.singh@hcl.com/azure/Graviton/App_Deployment20220426T070754413/install-tools-kube-istio/app"
            payload='flowId=143&blueprint=%7B%22id%22%3A%22143%22%2C%22label%22%3A%22App_Deployment20220426T070754413%22%2C%22nodes%22%3A%5B%7B%22id%22%3A%22n_56_765ccf96-3477-4871-b2d7-777e51303c27%22%2C%22type%22%3A%22infra-azure-vpc%22%2C%22z%22%3A%22143%22%2C%22virtualNetworkName%22%3A%22de-gr-aks-vpc%22%2C%22VirtualNetworkAddressSpace%22%3A%2215.0.0.0%2F8%22%2C%22azureVpcRegion%22%3A%22us%22%2C%22location%22%3A%22West%20US%22%2C%22x%22%3A223%2C%22y%22%3A92%2C%22wires%22%3A%5B%5B%22n_48_0bc75039-0602-4378-8eb3-86c693b1e977%22%5D%5D%7D%2C%7B%22id%22%3A%22n_48_0bc75039-0602-4378-8eb3-86c693b1e977%22%2C%22type%22%3A%22infra-azure-subnet%22%2C%22z%22%3A%22143%22%2C%22nodename%22%3A%22gr-aks-subnet%22%2C%22addressPrefix%22%3A%2215.0.0.0%2F16%22%2C%22x%22%3A468%2C%22y%22%3A53%2C%22wires%22%3A%5B%5B%22n_84_a0f71963-c2ad-486d-9ecc-0c21853dd98e%22%5D%5D%7D%2C%7B%22id%22%3A%22n_84_a0f71963-c2ad-486d-9ecc-0c21853dd98e%22%2C%22type%22%3A%22infra-azure-kubernetes%22%2C%22z%22%3A%22143%22%2C%22nodename%22%3A%22de-gr-aks-cluster%22%2C%22kubeVersion%22%3A%221.21.9%22%2C%22kubeDnsPrefix%22%3A%22kube%22%2C%22agentPoolProfileCount%22%3A%223%22%2C%22agentPoolProfileVmSeries%22%3A%22Dv2-series%22%2C%22agentPoolProfileVmSize%22%3A%22Standard_D2_v2%22%2C%22agentPoolProfileOsType%22%3A%22Linux%22%2C%22aks_dns_service_ip%22%3A%2210.0.0.10%22%2C%22aks_service_cidr%22%3A%2210.0.0.0%2F16%22%2C%22aks_docker_bridge_cidr%22%3A%22172.17.0.1%2F16%22%2C%22windowsProfileUserName%22%3A%22%22%2C%22windowsProfilePassword%22%3A%22%22%2C%22linuxProfileUserName%22%3A%22ubuntuadmin%22%2C%22linuxProfileSshKey%22%3A%22%22%2C%22x%22%3A441%2C%22y%22%3A134%2C%22wires%22%3A%5B%5B%22n_25_842264d2-5dd7-4cf9-8bb8-644eaf2ce2ef%22%5D%5D%7D%2C%7B%22id%22%3A%22n_25_842264d2-5dd7-4cf9-8bb8-644eaf2ce2ef%22%2C%22type%22%3A%22tools-kube-istio%22%2C%22z%22%3A%22143%22%2C%22serviceURL%22%3A%22thecloudbridge.org%22%2C%22uniqueIdentifier%22%3A%22graviton%22%2C%22istioProxyCpu%22%3A%22100m%22%2C%22istioInitCpu%22%3A%2250m%22%2C%22ingressgatewayAutoscaleMax%22%3A%2220%22%2C%22ingressgatewayLimitsCpu%22%3A%22100m%22%2C%22ingressgatewayLimitsMemory%22%3A%22256Mi%22%2C%22ingressgatewayRequestsCpu%22%3A%22100m%22%2C%22ingressgatewayRequestsMemory%22%3A%22256Mi%22%2C%22deploymentStrategies%22%3A%22istudioRegular%22%2C%22jenkinsURL%22%3A%22%22%2C%22userName%22%3A%22%22%2C%22password%22%3A%22%22%2C%22grafanaEnable%22%3A%22true%22%2C%22grafanaCpu%22%3A%22400m%22%2C%22grafanaMemory%22%3A%22256Mi%22%2C%22kubeStateMetrcisEnable%22%3A%22true%22%2C%22prometheusEnable%22%3A%22true%22%2C%22prometheusCpu%22%3A%22400m%22%2C%22prometheusMemory%22%3A%22256Mi%22%2C%22podStatusMonitorEnable%22%3A%22true%22%2C%22serviceStatusMonitorEnable%22%3A%22true%22%2C%22nodeMonitorEnable%22%3A%22true%22%2C%22nodeCpuThreshold%22%3A%2275%22%2C%22nodeMemoryThreshold%22%3A%2275%22%2C%22podMonitorEnable%22%3A%22true%22%2C%22podCpuThreshold%22%3A%2275%22%2C%22podMemoryThreshold%22%3A%2275%22%2C%22alertmanagerEnable%22%3A%22false%22%2C%22notificationChannel%22%3A%22Email%22%2C%22emailServerHost%22%3A%22%22%2C%22recipientIds%22%3A%22%22%2C%22senderUserId%22%3A%22%22%2C%22senderPassword%22%3A%22%22%2C%22teamsWebhookUrl%22%3A%22%22%2C%22jaegerEnable%22%3A%22true%22%2C%22zipkinEnable%22%3A%22true%22%2C%22kialiEnable%22%3A%22false%22%2C%22tracingEnable%22%3A%22true%22%2C%22x%22%3A355%2C%22y%22%3A189%2C%22wires%22%3A%5B%5B%22n_14_7f47d2b0-27c0-4c4a-bc17-1864342d77b4%22%2C%22n_14_7714a45f-61fa-4042-9862-b05191b6845a%22%5D%5D%7D%2C%7B%22id%22%3A%22n_14_7714a45f-61fa-4042-9862-b05191b6845a%22%2C%22type%22%3A%22container%22%2C%22z%22%3A%22143%22%2C%22appname%22%3A%22python%22%2C%22portnum%22%3A%225000%22%2C%22dockerrepository%22%3A%22pd30470%22%2C%22dockerImage%22%3A%22centospython212-may-2020-34-05-06-image%22%2C%22tag%22%3A%22latest%22%2C%22imagePullSecrets%22%3A%22No%22%2C%22regSecretName%22%3A%22%22%2C%22hosts%22%3A%22No%22%2C%22resourceSpecificationEnable%22%3A%22false%22%2C%22resourceLimitcpu%22%3A%22400m%22%2C%22resourceLimitram%22%3A%22512Mi%22%2C%22resourceRequestcpu%22%3A%2210m%22%2C%22resourceRequestram%22%3A%2264Mi%22%2C%22maxReplicas%22%3A%2250%22%2C%22minReplicas%22%3A%221%22%2C%22targetOn%22%3A%22cpu%22%2C%22targetAverageUtilization%22%3A%2265%22%2C%22prometheusScrape%22%3A%22false%22%2C%22metricsPath%22%3A%22%2Fmetrics%22%2C%22metricsPort%22%3A%22%22%2C%22keyList%22%3A%5B%5D%2C%22valueList%22%3A%5B%5D%2C%22x%22%3A244%2C%22y%22%3A301%2C%22wires%22%3A%5B%5B%5D%5D%7D%2C%7B%22id%22%3A%22n_14_7f47d2b0-27c0-4c4a-bc17-1864342d77b4%22%2C%22type%22%3A%22container%22%2C%22z%22%3A%22143%22%2C%22appname%22%3A%22javaapp%22%2C%22portnum%22%3A%228091%22%2C%22dockerrepository%22%3A%22pd30470%22%2C%22dockerImage%22%3A%22demo15-jun-2020-26-40-05-image%22%2C%22tag%22%3A%22latest%22%2C%22imagePullSecrets%22%3A%22No%22%2C%22regSecretName%22%3A%22%22%2C%22hosts%22%3A%22No%22%2C%22resourceSpecificationEnable%22%3A%22true%22%2C%22resourceLimitcpu%22%3A%221%22%2C%22resourceLimitram%22%3A%221Gi%22%2C%22resourceRequestcpu%22%3A%2210m%22%2C%22resourceRequestram%22%3A%2264Mi%22%2C%22maxReplicas%22%3A%2250%22%2C%22minReplicas%22%3A%221%22%2C%22targetOn%22%3A%22cpu%22%2C%22targetAverageUtilization%22%3A%2265%22%2C%22prometheusScrape%22%3A%22false%22%2C%22metricsPath%22%3A%22%2Fmetrics%22%2C%22metricsPort%22%3A%22%22%2C%22keyList%22%3A%5B%5D%2C%22valueList%22%3A%5B%5D%2C%22x%22%3A474%2C%22y%22%3A291%2C%22wires%22%3A%5B%5B%5D%5D%7D%5D%2C%22project%22%3A%22Graviton%22%2C%22keywords%22%3A%22%22%2C%22processGroup%22%3A%22Azure%22%2C%22createdBy%22%3A%22prathameshwar.singh%40hcl.com%22%2C%22assignedTo%22%3A%5B%5D%2C%22processes%22%3A%22%22%7D&Azure_Tenant_ID=d0c9f92c-e2ae-4903-b31b-25ea806607ca&Azure_Client_Secret=Q.2mIB_~9Ryw63IiIJgWz_.YjYJhEa2-3r&Azure_Client_ID=762321cf-c192-484a-82ff-4aa25a69fe36&Azure_Subscription_ID=eb52cc0f-995f-4f31-bb29-9d18d72c983e'
            headers = {
            'authority': 'istudio.thecloudbridge.net',
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9',
            'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJwcmF0aGFtZXNod2FyLnNpbmdoQGhjbC5jb20iLCJpZGVudGlmaWVyIjoicHJhY3RpY2UiLCJuYmYiOjE2NTE0OTA0NjAsImV4cCI6MTY1MTU4NDA2MCwidXNlcklkIjoiNzAiLCJhdXRob3JpdGllcyI6IlRlc3RfTWFuYWdlciIsInVzZXJuYW1lIjoicHJhdGhhbWVzaHdhci5zaW5naEBoY2wuY29tIn0.iPjmUIiTVrvcv_zQcPr0yZxHOF5jG1XcD5mhR1ovBSPBB50qLOTFCZGuFlGhyoahEAUoCootr3gtTFPeEC_6T1YxQO7Xqas3UrR-jN1HHd-pGxtAWlgwB29NKsQwCnddif8W-eeh9ryga5Ha8uKVuSXNG1Emoin13DwD7A_ZbIyQoIpIJm2d0CzxycIOdnihuZv3Ylf_SO7M4BPVAv3WliesRf3TxyTh8hIXpr262Tdiql5rBvO8rU91EpNSAvKuJUOiy2ck_8qSvelcnQ_iXAyWRiWA4gHSE_-zk7llJ0ocuydIN9qfB0OXQLwcow6mrCvX6C3-HhlwjX9yTWvcMw',
            'content-type': 'application/x-www-form-urlencoded',
            'origin': 'https://istudio.thecloudbridge.net',
            'referer': 'https://istudio.thecloudbridge.net/blueprints/143/edit',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
            }
        elif api_name == "DeployApplications":
            url = "https://istudio.thecloudbridge.net/py-api/kubeDeployment/prathameshwar.singh@hcl.com/azure/Graviton/App_Deployment20220426T070754413/install-application/app"
        elif api_name == "UnDeployInfra":
            url = "https://istudio.thecloudbridge.net/py-api/InfraCommand/prathameshwar.singh@hcl.com/azure/Graviton/App_Deployment20220426T070754413/undeploy-infra"
    
    else:

        payload={}
        headers = {}

        if api_name == "InfraCostLogs":
            url = "https://istudio.thecloudbridge.net/py-api/kubeGetLog/prathameshwar.singh%40hcl.com/azure/Graviton/App_Deployment20220426T070754413/infra-price/app"
        elif api_name == "DeployInfraLogs":
            url = "https://istudio.thecloudbridge.net/py-api/kubeGetLog/prathameshwar.singh%40hcl.com/azure/Graviton/App_Deployment20220426T070754413/install-infra/app"
        elif api_name == "DeployIstioLogs":
            url = "https://istudio.thecloudbridge.net/py-api/kubeGetLog/prathameshwar.singh%40hcl.com/azure/Graviton/App_Deployment20220426T070754413/install-tools-kube-istio/app"
        elif api_name == "DeployApplicationsLogs":
            url = "https://istudio.thecloudbridge.net/py-api/kubeGetLog/prathameshwar.singh%40hcl.com/azure/Graviton/App_Deployment20220426T070754413/install-application/app"
        elif api_name == "UnDeployInfraLogs":
            url = "https://istudio.thecloudbridge.net/py-api/kubeGetLog/prathameshwar.singh%40hcl.com/azure/Graviton/App_Deployment20220426T070754413/undeploy-infra/app"


    response = requests.request(api_type, url, headers=headers, data=payload, verify=False)
    return JsonResponse({'response': response.text})

