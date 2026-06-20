from azure.kusto.data import KustoClient, KustoConnectionStringBuilder
from azure.kusto.data.helpers import dataframe_from_result_table

adx_cluster = "https://gravitonadxcluster.eastus.kusto.windows.net"
adx_db = "graviton_db"
client_id = "d85bdcd8-5642-4de2-832d-c872ee328a18"
client_secret = "yCr8Q~9o-oAbUzCFW9pmWiWLaBz2UksyGS9bmaK~"
tenant_id = "d0c9f92c-e2ae-4903-b31b-25ea806607ca"


def create_kusto_client():
    kcsb_data = KustoConnectionStringBuilder.with_aad_application_key_authentication(
        adx_cluster, client_id, client_secret, tenant_id
    )
    kusto_client = KustoClient(kcsb_data)
    return kusto_client


def execute_kusto_query(kusto_query):
    kusto_client = create_kusto_client()
    response = kusto_client.execute(adx_db, kusto_query)
    return dataframe_from_result_table(response.primary_results[0])


def retrieve_data_from_adx(kusto_query):
    kusto_client = create_kusto_client()
    response = kusto_client.execute(adx_db, kusto_query)
    return dataframe_from_result_table(response.primary_results[0])
