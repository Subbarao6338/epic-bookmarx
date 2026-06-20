"""
=============================================================================
COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
emains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""

from datetime import timedelta, datetime
from fileinput import close
from typing import Any
from azure.monitor.query.aio import MetricsQueryClient
from azure.identity.aio import DefaultAzureCredential, ClientSecretCredential
import configparser

parser = configparser.ConfigParser()
parser.read('config.ini')

subscription_id = parser.get('azure_monitor', 'subscription_id')
tenant_id = parser.get('azure_monitor', 'tenant_id')
client_id = parser.get('azure_monitor', 'client_id')
client_secret = parser.get('azure_monitor', 'client_Secret')
workspace_id = parser.get('azure_monitor', 'workspace_id')


class MetricsQueryClientAIO(MetricsQueryClient):
    def __init__(self, credential, **kwargs: Any) -> None:
        self._credential = credential
        super().__init__(credential, **kwargs)

    async def close(self) -> None:
        await self._credential.close()
        return await super().close()


class AzureMonitorQuery:
    def __init__(
        self,
        tenant_id=tenant_id,
        client_id=client_id,
        client_secret=client_secret,
    ):
        self._tenant_id = tenant_id
        self._client_id = client_id
        self._client_secret = client_secret
        self._credential = ClientSecretCredential(
            tenant_id=self._tenant_id,
            client_id=self._client_id,
            client_secret=self._client_secret
        )

    def metrics_client(self):
        client = MetricsQueryClientAIO(self._credential)
        return client

    def logs_client():
        pass
