from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from dashboard_utils import postgresql_utils, azure_db_utils, hub_details, purview_details, pipeline_details, airflow

@csrf_exempt
def get_component_data(request):
    rules = postgresql_utils.get_dqc_rules_count()
    models = azure_db_utils.get_data_genie_models_count()
    sources = azure_db_utils.get_ads_source_count()
    return JsonResponse({'hawkeye_dqc':rules, 'data_genie':models, 'hawkeye_ads':sources})

@csrf_exempt
def get_hub_and_storage_data(request):
    token = hub_details.generate_token()
    if(token=="Error"):
        return JsonResponse({'event_hub':0, 'iot_hub':0, 'storage':0})
    else:
        count_event_hub = hub_details.get_event_hub_count(token)
        count_iot_hub = hub_details.get_iot_hub_count(token)
        storage_count = hub_details.get_storage_count(token)
        return JsonResponse({'event_hub':count_event_hub, 'iot_hub':count_iot_hub, 'storage':storage_count})

@csrf_exempt
def get_purview_data(request):
    token = purview_details.get_purview_token()
    if(token=="Error"):
        return JsonResponse({'sources':0, 'classification_rules':0, 'glossary_terms':0, 'certified_datasets':0})
    else:
        count_sources = purview_details.get_sources_count(token)
        count_classification_rules = purview_details.get_classification_rules_count(token)
        count_glossary = purview_details.get_glossary_term_count(token)
        count_dataset = purview_details.get_dataset_count()
        return JsonResponse({'sources':count_sources, 'classification_rules':count_classification_rules, 'glossary_terms':count_glossary, 'certified_datasets':count_dataset})

@csrf_exempt
def get_pipeline_data(request):
    # write exact function
    token = pipeline_details.get_access_token()
    if(token=="Error"):
        dag_count = airflow.get_dag_count()
        return JsonResponse({'adf_counts':0, 'airflow_dags':dag_count})
    else:
        adf_counts = pipeline_details.get_adf_count(token)
        dag_count = airflow.get_dag_count()
        return JsonResponse({'adf_counts':adf_counts, 'airflow_dags':dag_count})

@csrf_exempt
def get_observability_data(request):
    # write exact function
    return JsonResponse({'sources':4, 'channels':5, 'grafana_dashboards':3, 'alert_rules':3})