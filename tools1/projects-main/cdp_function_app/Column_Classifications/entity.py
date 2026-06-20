from azure.core.exceptions import HttpResponseError
from azure.purview.catalog.rest import entity, discovery

from Column_Classifications.connect import catalog_client


def get_entities_by_search(keywords, limit=10, offset=0, filter_by=None):
    request = discovery.build_query_request(
        json={"keywords": keywords, "limit": limit, "offset": offset, "filter": filter_by})
    try:
        response = catalog_client.send_request(request)
        response.raise_for_status()
        json_response = response.json()
        return json_response
    except HttpResponseError as e:
        print(e)


def get_entity_by_qualified_name(type_name, qualified_name):
    request = entity.build_get_by_unique_attributes_request(type_name=type_name, attr_qualified_name=qualified_name)
    try:
        response = catalog_client.send_request(request)
        response.raise_for_status()
        json_response = response.json()
        return json_response
    except HttpResponseError as e:
        print(e)


def get_entity_by_guid(guid):
    request = entity.build_get_by_guid_request(guid=guid)
    try:
        response = catalog_client.send_request(request)
        response.raise_for_status()
        json_response = response.json()
        return json_response
    except HttpResponseError as e:
        print(e)
