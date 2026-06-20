import time
from azure.identity import ClientSecretCredential
from azure.mgmt.datafactory import DataFactoryManagementClient
from azure.mgmt.datafactory.models import *
from django.core.cache import cache
import configparser
from asgiref.sync import sync_to_async
import aiohttp
import asyncio
from utility.azure_monitor import AzureMonitorQuery
from grafana_api.views import _get_grafana_config


parser = configparser.ConfigParser()
parser.read('config.ini')

subscription_id = parser.get('azure_data_factory', 'subscription_id')
tenant_id = parser.get('azure_data_factory', 'tenant_id')
client_id = parser.get('azure_data_factory', 'client_id')
client_secret = parser.get('azure_data_factory', 'client_secret')
resource_group = parser.get('azure_data_factory', 'resource_group')
factory_name = parser.get('azure_data_factory', 'factory_name')


def get_adf_client():
    credential = ClientSecretCredential(
        tenant_id=tenant_id,
        client_id=client_id,
        client_secret=client_secret,
    )
    adf_client = DataFactoryManagementClient(credential, subscription_id)
    return adf_client


def get_pipeline_list(resourceGroupName=resource_group, factory=factory_name):
    adf_client = get_adf_client()
    pipelines = adf_client.pipelines.list_by_factory(
        resource_group_name=resourceGroupName, factory_name=factory)
    return pipelines


def get_pipeline_runs(resourceGroupName=resource_group, factory=factory_name, filter_parameters={}):
    adf_client = get_adf_client()
    pipeline_runs = adf_client.pipeline_runs.query_by_factory(
        resourceGroupName,
        factory,
        filter_parameters=filter_parameters
    )
    return pipeline_runs


async def get_adf_pipeline_metrics(start_dt, end_dt, pipelines=[]):
    client = AzureMonitorQuery().metrics_client()
    metrics_uri = "/subscriptions/cdd13030-77e0-41a5-b0d9-558c7e10551c/resourceGroups/DE-CDP/providers/Microsoft.DataFactory/factories/prathamcdpfactory"
    response = await client.query_resource(
        metrics_uri,
        metric_names=["PipelineFailedRuns", "PipelineSucceededRuns"],
        timespan=(start_dt, end_dt),
        granularity="P1D",
        filter=" or ".join(["Name eq '{}'".format(pipeline)
                            for pipeline in pipelines])
    )
    await client.close()
    return response


async def get_alert_rules():
    config = await sync_to_async(_get_grafana_config)()
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(config['url']+'/api/ruler/grafana/api/v1/rules?subtype=cortex', timeout=1) as response:
                return await response.json()
        except:
            return {}


async def get_alerts():
    config = await sync_to_async(_get_grafana_config)()
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(config['url']+'/api/prometheus/grafana/api/v1/rules', timeout=1) as response:
                return await response.json()
        except:
            return {}
