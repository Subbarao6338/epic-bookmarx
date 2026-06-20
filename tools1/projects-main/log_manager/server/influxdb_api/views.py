from asyncore import read
import json
from msilib.schema import tables
import time
import csv
import datetime
from tracemalloc import stop
import pandas as pd
from urllib import response
import requests
from django.http import HttpResponse, JsonResponse
from django.core.cache import cache
from azure.identity import ClientSecretCredential
from azure.monitor.query import LogsQueryClient, MetricsQueryClient, LogsQueryStatus, LogsBatchQuery
from influxdb_client import InfluxDBClient, Point, WritePrecision, Dialect
from influxdb_client.client.write_api import SYNCHRONOUS

from config_api.models import ConfigString
from utility.metric_forcast import get_forecasted_metrics

import configparser

parser = configparser.ConfigParser()
parser.read('config.ini')

subscription_id = parser.get('azure_monitor', 'subscription_id')
tenant_id = parser.get('azure_monitor', 'tenant_id')
client_id = parser.get('azure_monitor', 'client_id')
client_secret = parser.get('azure_monitor', 'client_Secret')
workspace_id = parser.get('azure_monitor', 'workspace_id')

# Create your views here.


def _get_influxdb_config():
    cache_key = 'prefix'+'metric_storage'
    obj = cache.get(cache_key)

    if not obj:
        obj = ConfigString.objects.filter(
            config_name='metric_storage').values().first()
        cache.set(cache_key, obj)

    return json.loads(obj['value'])


def _influxdb_client():
    config = _get_influxdb_config()
    client = InfluxDBClient(
        url=config['url'],
        token=config['token'],
        org=config['org']
    )
    return client


def _sync_adf_logs(last_sync):
    current_datetime = datetime.datetime.utcnow()
    timespan = (last_sync, current_datetime)

    requests = [
        LogsBatchQuery(
            query="""ADFActivityRun""",
            timespan=timespan,
            workspace_id=workspace_id
        ),
        LogsBatchQuery(
            query="""ADFPipelineRun""",
            timespan=timespan,
            workspace_id=workspace_id
        ),
        LogsBatchQuery(
            query="""ADFTriggerRun""",
            timespan=timespan,
            workspace_id=workspace_id
        ),
    ]

    credential = ClientSecretCredential(
        tenant_id=tenant_id,
        client_id=client_id,
        client_secret=client_secret
    )

    logs_client = LogsQueryClient(credential)
    influxdb_client = _influxdb_client()
    write_client = influxdb_client.write_api(write_options=SYNCHRONOUS)

    results = logs_client.query_batch(requests)

    for response in results:
        if response.status == LogsQueryStatus.SUCCESS:
            data = response.tables
            for table in data:
                df = pd.DataFrame(data=table.rows, columns=table.columns)
                df.set_index("TimeGenerated", inplace=True)
                print("updated_logs_count", df.shape)
                write_client.write('my-bucket',
                                   record=df,
                                   data_frame_measurement_name='adf_logs',
                                   data_frame_tag_columns=["TenantId", "SourceSystem", "ResourceId", "Category", "Level", "Location", "Status", "FailureType",
                                                           "PipelineName", "Type"]
                                   )

    commit_point = Point('adf_logs').time(
        current_datetime).field('adf_last_sync', True)
    write_client.write('my-bucket', record=commit_point)
    write_client.close()

    return timespan

######################################################################


def get_buckets_list(request):
    if request.method == 'GET':
        config = _get_influxdb_config()
        url = config['url'] + "/api/v2/buckets"
        response = requests.get(
            url,
            headers={'Authorization': 'Token ' + config['token']},
            params={'org': config['org']}
        )
        # print(response)
        return HttpResponse(response)


def influxdb_query_proxy(request):
    if request.method == 'POST':
        config = _get_influxdb_config()
        url = config['url'] + "/api/v2/query"
        response = requests.post(
            url,
            headers={'Authorization': 'Token ' + config['token']},
            params={"org": config['org']},
            data=request.body
        )
        # print(response.raw)
        return HttpResponse(response)


def influxdb_sync_logs(request):
    query = """from(bucket: "my-bucket")
        |> range(start: -24h, stop: now())
        |> filter(fn: (r) => r["_measurement"] == "adf_logs")
        |> filter(fn: (r) => r["_field"] == "adf_last_sync")
        |> keep(columns: ["_time"])
        |> sort(columns: ["_time"], desc: false)
        |> last(column: "_time")"""

    influxdb_client = _influxdb_client()
    query_client = influxdb_client.query_api()

    tables = query_client.query(query=query)

    try:
        last_sync = tables[0].records[0]["_time"]
    except:
        last_sync = datetime.datetime.utcnow() - datetime.timedelta(hours=24)

    sync_timespan = _sync_adf_logs(last_sync=last_sync)
    return JsonResponse({"update_timespan": sync_timespan})


def query_logs(request):
    timestamp = request.GET.get("timestamp")
    t_window = request.GET.get("t_window", 3600)
    timespan = request.GET.get("timespan", "")
    filters = request.GET.getlist("filter")

    [start, stop] = ["-12h", "now()"]

    if timestamp:
        timestamp_unix = int(timestamp)//1000
        stop = timestamp_unix
        start = (stop - t_window)

    if timespan:
        timespan_split = timespan.split('|')
        [start, stop] = timespan_split if len(timespan_split) == 2 else [
            timespan_split[0], stop]
        # in case of timestamp values -> convert to unix timestamp
        try:
            [start, stop] = [int(start)//1000, int(stop)//1000]
        except:
            pass

    if len(filters):
        filters = [filter.split("|") for filter in filters]
        filters = " ".join(
            [f'|> filter(fn: (r) => r["{key}"] == "{value}")' for [key, value] in filters])
    else:
        filters = ""

    query = f"""
    from(bucket: "my-bucket")
        |> range(start: {start}, stop: {stop})
        |> filter(fn: (r) => r["_measurement"] == "adf_logs")
        |> filter(fn: (r) => r["_field"] != "adf_last_sync")
        {filters}
        |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> group()
        """

    influxdb_client = _influxdb_client()
    query_client = influxdb_client.query_api()
    tables = query_client.query_raw(query=query)

    return HttpResponse(tables)


def metric_forecast(request):
    timeframe_h = request.GET.get('timeframe_h', 1)
    if not isinstance(timeframe_h, int):
        timeframe_h = int(timeframe_h)
    forecasted_metrics = get_forecasted_metrics(timeframe_h)
    return HttpResponse(forecasted_metrics)


def fluentd_sync_logs(request):
    # query = """from(bucket: "my-bucket")
    #     |> range(start: -24h, stop: now())
    #     |> filter(fn: (r) => r["_measurement"] == "adf_logs" or r["_measurement"] == "winevt.raw" or r["_measurement"] == "prometheus_remote_write")
    #     |> filter(fn: (r) => r["_field"] == "TriggerFailureType" or r["_field"] == "account_for_which_logon_failed.account_domain" or r["_field"] == "account_for_which_logon_failed.account_name" or r["_field"] == "account_for_which_logon_failed.security_id" or r["_field"] == "activityfailedruns_count_average" or r["_field"] == "activityfailedruns_count_max" or r["_field"] == "activityfailedruns_count_min" or r["_field"] == "activityfailedruns_count_total" or r["_field"] == "af_agg_dagrun_duration_failed" or r["_field"] == "af_agg_dagrun_duration_failed_count" or r["_field"] == "af_agg_dagrun_duration_failed_sum" or r["_field"] == "af_agg_operator_failures" or r["_field"] == "af_agg_ti_failures" or r["_field"] == "failure_information.failure_reason" or r["_field"] == "failure_information.status" or r["_field"] == "failure_information.sub_status" or r["_field"] == "net_conntrack_dialer_conn_failed_total" or r["_field"] == "pipelinefailedruns_count_average" or r["_field"] == "pipelinefailedruns_count_max" or r["_field"] == "pipelinefailedruns_count_min" or r["_field"] == "pipelinefailedruns_count_total" or r["_field"] == "prometheus_engine_query_log_failures_total" or r["_field"] == "prometheus_remote_storage_exemplars_failed_total" or r["_field"] == "prometheus_remote_storage_metadata_failed_total" or r["_field"] == "prometheus_remote_storage_samples_failed_total" or r["_field"] == "prometheus_sd_consul_rpc_failures_total" or r["_field"] == "prometheus_sd_dns_lookup_failures_total" or r["_field"] == "prometheus_sd_failed_configs" or r["_field"] == "prometheus_sd_kuma_fetch_failures_total" or r["_field"] == "prometheus_target_scrape_pool_reloads_failed_total" or r["_field"] == "prometheus_target_scrape_pools_failed_total" or r["_field"] == "prometheus_target_sync_failed_total" or r["_field"] == "prometheus_template_text_expansion_failures_total" or r["_field"] == "prometheus_treecache_zookeeper_failures_total" or r["_field"] == "prometheus_tsdb_checkpoint_creations_failed_total" or r["_field"] == "prometheus_tsdb_checkpoint_deletions_failed_total" or r["_field"] == "prometheus_tsdb_compactions_failed_total" or r["_field"] == "prometheus_tsdb_head_truncations_failed_total" or r["_field"] == "prometheus_tsdb_reloads_failures_total" or r["_field"] == "prometheus_tsdb_wal_truncations_failed_total" or r["_field"] == "prometheus_tsdb_wal_writes_failed_total" or r["_field"] == "prometheus_wal_watcher_record_decode_failures_total" or r["_field"] == "triggerfailedruns_count_average" or r["_field"] == "triggerfailedruns_count_max" or r["_field"] == "triggerfailedruns_count_min" or r["_field"] == "triggerfailedruns_count_total" or r["_field"] == "Error" or r["_field"] == "ErrorCode" or r["_field"] == "ErrorMessage" or r["_field"] == "af_agg_dag_processing_import_errors" or r["_field"] == "prometheus_sd_file_read_errors_total" or r["_field"] == "prometheus_tsdb_snapshot_replay_error_total" or r["_field"] == "prometheus_web_federation_errors_total" or r["_field"] == "statsd_exporter_events_error_total" or r["_field"] == "statsd_exporter_tag_errors_total" or r["_field"] == "statsd_exporter_tcp_connection_errors_total")
    #     |> sort(columns: ["_time"], desc: true)
    #     """
    query= """from(bucket: "my-bucket")
        |> range(start: -24h, stop: now())
        |> filter(fn: (r) => r["_measurement"] == "adf_logs" or r["_measurement"] == "winevt.raw" or r["_measurement"] == "prometheus_remote_write")
        |> filter(fn: (r) => r["_field"] == "TriggerFailureType" or r["_field"] == "account_for_which_logon_failed.account_domain" or r["_field"] == "account_for_which_logon_failed.account_name" or r["_field"] == "account_for_which_logon_failed.security_id" or r["_field"] == "activityfailedruns_count_average" or r["_field"] == "activityfailedruns_count_max" or r["_field"] == "activityfailedruns_count_min" or r["_field"] == "activityfailedruns_count_total" or r["_field"] == "af_agg_dagrun_duration_failed" or r["_field"] == "af_agg_dagrun_duration_failed_count" or r["_field"] == "af_agg_dagrun_duration_failed_sum" or r["_field"] == "af_agg_operator_failures" or r["_field"] == "af_agg_ti_failures" or r["_field"] == "failure_information.failure_reason" or r["_field"] == "failure_information.status" or r["_field"] == "failure_information.sub_status" or r["_field"] == "net_conntrack_dialer_conn_failed_total" or r["_field"] == "pipelinefailedruns_count_average" or r["_field"] == "pipelinefailedruns_count_max" or r["_field"] == "pipelinefailedruns_count_min" or r["_field"] == "pipelinefailedruns_count_total" or r["_field"] == "prometheus_engine_query_log_failures_total" or r["_field"] == "prometheus_remote_storage_exemplars_failed_total" or r["_field"] == "prometheus_remote_storage_metadata_failed_total" or r["_field"] == "prometheus_remote_storage_samples_failed_total" or r["_field"] == "prometheus_sd_consul_rpc_failures_total" or r["_field"] == "prometheus_sd_dns_lookup_failures_total" or r["_field"] == "prometheus_sd_failed_configs" or r["_field"] == "prometheus_sd_kuma_fetch_failures_total" or r["_field"] == "prometheus_target_scrape_pool_reloads_failed_total" or r["_field"] == "prometheus_target_scrape_pools_failed_total" or r["_field"] == "prometheus_target_sync_failed_total" or r["_field"] == "prometheus_template_text_expansion_failures_total" or r["_field"] == "prometheus_treecache_zookeeper_failures_total" or r["_field"] == "prometheus_tsdb_checkpoint_creations_failed_total" or r["_field"] == "prometheus_tsdb_checkpoint_deletions_failed_total" or r["_field"] == "prometheus_tsdb_compactions_failed_total" or r["_field"] == "prometheus_tsdb_head_truncations_failed_total" or r["_field"] == "prometheus_tsdb_reloads_failures_total" or r["_field"] == "prometheus_tsdb_wal_truncations_failed_total" or r["_field"] == "prometheus_tsdb_wal_writes_failed_total" or r["_field"] == "prometheus_wal_watcher_record_decode_failures_total" or r["_field"] == "triggerfailedruns_count_average" or r["_field"] == "triggerfailedruns_count_max" or r["_field"] == "triggerfailedruns_count_min" or r["_field"] == "triggerfailedruns_count_total" or r["_field"] == "Error" or r["_field"] == "ErrorCode" or r["_field"] == "ErrorMessage" or r["_field"] == "af_agg_dag_processing_import_errors" or r["_field"] == "prometheus_sd_file_read_errors_total" or r["_field"] == "prometheus_tsdb_snapshot_replay_error_total" or r["_field"] == "prometheus_web_federation_errors_total" or r["_field"] == "statsd_exporter_events_error_total" or r["_field"] == "statsd_exporter_tag_errors_total" or r["_field"] == "statsd_exporter_tcp_connection_errors_total")
        |> sort(columns: ["_time"], desc: true)
        """
    influxdb_client = _influxdb_client()
    query_client = influxdb_client.query_api()

    tables = query_client.query(query=query)

    try:
        last_sync = tables[0].records[0]["_time"]
    except:
        last_sync = datetime.datetime.utcnow() - datetime.timedelta(hours=24)

    return JsonResponse({"update_timespan": last_sync})


def fluentd_logs(request):
    timestamp = request.GET.get("timestamp")
    t_window = request.GET.get("t_window", 3600)
    timespan = request.GET.get("timespan", "")
    filters = request.GET.getlist("filter")

    [start, stop] = ["-2d", "now()"]

    if timestamp:
        timestamp_unix = int(timestamp)//1000
        stop = timestamp_unix
        start = (stop - t_window)

    if timespan:
        timespan_split = timespan.split('|')
        [start, stop] = timespan_split if len(timespan_split) == 2 else [
            timespan_split[0], stop]
        # in case of timestamp values -> convert to unix timestamp
        try:
            [start, stop] = [int(start)//1000, int(stop)//1000]
        except:
            pass

    if len(filters):
        filters = [filter.split("|") for filter in filters]
        filters = " ".join(
            [f'|> filter(fn: (r) => r["{key}"] == "{value}")' for [key, value] in filters])
    else:
        filters = ""

    # query = f"""
    # from(bucket: "my-bucket")
    #     |> range(start: {start}, stop: {stop})
    #     |> filter(fn: (r) => r["_measurement"] == "adf_logs" or r["_measurement"] == "winevt.raw" or r["_measurement"] == "prometheus_remote_write")
    #     |> filter(fn: (r) => r["_field"] == "TriggerFailureType" or r["_field"] == "account_for_which_logon_failed.account_domain" or r["_field"] == "account_for_which_logon_failed.account_name" or r["_field"] == "account_for_which_logon_failed.security_id" or r["_field"] == "activityfailedruns_count_average" or r["_field"] == "activityfailedruns_count_max" or r["_field"] == "activityfailedruns_count_min" or r["_field"] == "activityfailedruns_count_total" or r["_field"] == "af_agg_dagrun_duration_failed" or r["_field"] == "af_agg_dagrun_duration_failed_count" or r["_field"] == "af_agg_dagrun_duration_failed_sum" or r["_field"] == "af_agg_operator_failures" or r["_field"] == "af_agg_ti_failures" or r["_field"] == "failure_information.failure_reason" or r["_field"] == "failure_information.status" or r["_field"] == "failure_information.sub_status" or r["_field"] == "net_conntrack_dialer_conn_failed_total" or r["_field"] == "pipelinefailedruns_count_average" or r["_field"] == "pipelinefailedruns_count_max" or r["_field"] == "pipelinefailedruns_count_min" or r["_field"] == "pipelinefailedruns_count_total" or r["_field"] == "prometheus_engine_query_log_failures_total" or r["_field"] == "prometheus_remote_storage_exemplars_failed_total" or r["_field"] == "prometheus_remote_storage_metadata_failed_total" or r["_field"] == "prometheus_remote_storage_samples_failed_total" or r["_field"] == "prometheus_sd_consul_rpc_failures_total" or r["_field"] == "prometheus_sd_dns_lookup_failures_total" or r["_field"] == "prometheus_sd_failed_configs" or r["_field"] == "prometheus_sd_kuma_fetch_failures_total" or r["_field"] == "prometheus_target_scrape_pool_reloads_failed_total" or r["_field"] == "prometheus_target_scrape_pools_failed_total" or r["_field"] == "prometheus_target_sync_failed_total" or r["_field"] == "prometheus_template_text_expansion_failures_total" or r["_field"] == "prometheus_treecache_zookeeper_failures_total" or r["_field"] == "prometheus_tsdb_checkpoint_creations_failed_total" or r["_field"] == "prometheus_tsdb_checkpoint_deletions_failed_total" or r["_field"] == "prometheus_tsdb_compactions_failed_total" or r["_field"] == "prometheus_tsdb_head_truncations_failed_total" or r["_field"] == "prometheus_tsdb_reloads_failures_total" or r["_field"] == "prometheus_tsdb_wal_truncations_failed_total" or r["_field"] == "prometheus_tsdb_wal_writes_failed_total" or r["_field"] == "prometheus_wal_watcher_record_decode_failures_total" or r["_field"] == "triggerfailedruns_count_average" or r["_field"] == "triggerfailedruns_count_max" or r["_field"] == "triggerfailedruns_count_min" or r["_field"] == "triggerfailedruns_count_total" or r["_field"] == "Error" or r["_field"] == "ErrorCode" or r["_field"] == "ErrorMessage" or r["_field"] == "af_agg_dag_processing_import_errors" or r["_field"] == "prometheus_sd_file_read_errors_total" or r["_field"] == "prometheus_tsdb_snapshot_replay_error_total" or r["_field"] == "prometheus_web_federation_errors_total" or r["_field"] == "statsd_exporter_events_error_total" or r["_field"] == "statsd_exporter_tag_errors_total" or r["_field"] == "statsd_exporter_tcp_connection_errors_total")
    #     |> sort(columns: ["_time"], desc: true)
    #     {filters}
    #     |> pivot(rowKey: ["_time"], columnKey: ["_stop"], valueColumn: "_value")
    #     |> group()
    #     """
    query= f"""
    from(bucket: "my-bucket")
        |> range(start: {start}, stop: {stop})
        |> filter(fn: (r) => r["_measurement"] == "adf_logs" or r["_measurement"] == "winevt.raw" or r["_measurement"] == "prometheus_remote_write")
        |> filter(fn: (r) => r["_field"] == "TriggerFailureType" or r["_field"] == "account_for_which_logon_failed.account_domain" or r["_field"] == "account_for_which_logon_failed.account_name" or r["_field"] == "account_for_which_logon_failed.security_id" or r["_field"] == "failure_information.failure_reason" or r["_field"] == "failure_information.status" or r["_field"] == "failure_information.sub_status" or r["_field"] == "Error" or r["_field"] == "ErrorCode" or r["_field"] == "ErrorMessage")
        |> sort(columns: ["_time"], desc: true)
        {filters}
        |> pivot(rowKey: ["_time"], columnKey: ["_stop"], valueColumn: "_value")
        |> group()
        """

    influxdb_client = _influxdb_client()
    query_client = influxdb_client.query_api()
    tables = query_client.query_raw(query=query)

    return HttpResponse(tables)
