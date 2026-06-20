from asyncio.windows_utils import pipe
from django.http import HttpResponse, JsonResponse
import json

import requests
from api_services.azure_df.utils import get_adf_client, get_adf_pipeline_metrics, get_alert_rules, get_alerts, get_pipeline_list, get_pipeline_runs
from datetime import date, datetime, timedelta
import asyncio
from asgiref.sync import sync_to_async
from api_services.grafana_api.views import _get_grafana_config


def list_factories(request, rg=None):
    if request.method == 'GET':
        adf_client = get_adf_client()
        if rg:
            factories = adf_client.factories.list_by_resource_group(rg)
        else:
            factories = adf_client.factories.list()
        pipelines = [pipeline.as_dict() for pipeline in pipelines]
        return JsonResponse({"values": factories})


async def list_pipelines(request):
    if request.method == 'GET':
        timespan = request.GET.get('timespan')

        if timespan:
            [start_dt, end_dt] = [datetime.strptime(
                dt, "%Y-%m-%dT%H:%M:%S.%fZ") for dt in timespan.split('|')]
        else:
            dt = datetime.utcnow()
            [start_dt, end_dt] = [dt-timedelta(days=24), dt]

        print(start_dt, end_dt)
        pipelines = get_pipeline_list()
        pipelines = list(pipelines)

        [pipeline_metrics, alert_rules] = await asyncio.gather(
            get_adf_pipeline_metrics(start_dt=start_dt,
                                     end_dt=end_dt,
                                     pipelines=["*"]),
            get_alert_rules(),
        )

        pipeline_metrics_map = {}
        for metric in pipeline_metrics.metrics:
            for time_series_element in metric.timeseries:
                count = 0
                pipeline_name = time_series_element.metadata_values['name']
                if not pipeline_metrics_map.get(pipeline_name):
                    pipeline_metrics_map[pipeline_name] = {}

                for metric_value in time_series_element.data:
                    count += metric_value.total
                pipeline_metrics_map[pipeline_name][metric.name] = count

        pipeline_runs = get_pipeline_runs(filter_parameters={
            "lastUpdatedAfter": start_dt,
            "lastUpdatedBefore": end_dt,
            "orderBy": [
                {
                    "orderBy": "RunStart",
                    "order": "DESC"
                }
            ], })

        pipeline_runs_map = {}
        for pipeline_run in pipeline_runs.value:
            pipeline_name = pipeline_run.pipeline_name
            if not pipeline_runs_map.get(pipeline_name):
                pipeline_runs_map[pipeline_name] = []
            pipeline_runs_map[pipeline_name].append({
                "run_start": pipeline_run.run_start,
                "duration_in_ms": pipeline_run.duration_in_ms,
                "status": pipeline_run.status,
                "message": pipeline_run.message
            })

        grafana_config = _get_grafana_config()

        values = []
        for pipeline in pipelines:
            pipeline_name = pipeline.name
            #
            alert_state_count = 0
            alert_groups = alert_rules.get(pipeline_name, [])
            for ag in alert_groups:
                for rule in ag['rules']:
                    alert_id = rule['grafana_alert']['id']
                    state_history = requests.get(
                        grafana_config['url'] + "/api/annotations?alertId=" + str(alert_id))
                    state_history_json = state_history.json()
                    for alert_state in state_history_json:
                        # print(alert_state['newState'])
                        alert_state_count += (
                            1 if alert_state['newState'].startswith('Alerting') else 0)
            #
            value = {"pipeline_name": pipeline_name,
                     "alert_rules_count": len(alert_rules.get(pipeline_name, [])),
                     "alerts_count": alert_state_count,
                     "run_history": pipeline_runs_map.get(pipeline_name, []),
                     "failed_count": pipeline_metrics_map.get(pipeline_name, {}).get("PipelineFailedRuns", 0),
                     "succeeded_count": pipeline_metrics_map.get(pipeline_name, {}).get("PipelineSucceededRuns", 0)
                     }
            value["alerts_count"] += value["failed_count"]
            values.append(value)

        return JsonResponse({"values": values})


def pipeline_runs(request):
    """body: {
        filter_parameters: {
            "lastUpdatedAfter": "2022-07-25T15:35:29.034Z",
            "lastUpdatedBefore": "2022-07-25T15:35:29.034Z",
            "orderBy": [
                {
                    "orderBy": "RunStart",
                    "order": "DESC"
                }
            ],
             "filters": [
                {
                "operand": "PipelineName",
                "operator": "Equals",
                "values": [],
                }
            ]
        }
    }"""
    if request.method == 'POST':
        filter_parameters = json.loads(request.body).get('filter_parameters')
        pipeline_runs = get_pipeline_runs(filter_parameters=filter_parameters)
        return JsonResponse(pipeline_runs.as_dict())
