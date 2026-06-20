"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
from django.core import serializers
from django.http import HttpResponse, JsonResponse

from connection_utility.api_utility import api_service
import json

response_data = {}


class Api_Response:
    Status = "Failed"
    Message = "Something went wrong"
    Result = None


"""This method is to check the user for valid"""


def is_valid_user(request):
    user_name = request.GET.get('UserName')
    password = request.GET.get('Password')
    result = api_service.is_valid_user(user_name, password)
    if result:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'User is valid'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'User is invalid'
        response_data['Result'] = None
        return JsonResponse(response_data)


def list_domain_objects(request):
    user_name = request.GET.get('UserName')
    password = request.GET.get('Password')
    result = api_service.list_domain_objects_by_user(user_name, password)
    if len(result) > 0:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def list_domain_objects_by_user_key(request):
    user_key = request.GET.get('Key')
    result = api_service.list_domain_objects_by_user(user_key)
    if len(result) > 0:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def list_user_domain_objects(request):
    user_key = request.GET.get('Key')
    result = api_service.list_user_domain_objects(user_key)
    if len(result) > 0:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def list_table_fields(request):
    user_name = request.GET.get('UserName')
    password = request.GET.get('Password')
    table_name = request.GET.get("TableName")
    result = api_service.list_table_fields(user_name, password, table_name)
    if len(result) > 0:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def get_connection_string_of_object(request):
    user_name = request.GET.get('UserName')
    password = request.GET.get('Password')
    table_name = request.GET.get("TableName")
    result = api_service.get_connection_string_of_object(user_name, password, table_name)
    if result is not None:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def get_select_query_for_object(request):
    user_name = request.GET.get('UserName')
    password = request.GET.get('Password')
    table_name = request.GET.get("TableName")
    result = api_service.get_select_query_for_object(user_name, password, table_name)
    if result is not None:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def get_data_for_object(request):
    user_name = request.GET.get('UserName')
    password = request.GET.get('Password')
    table_name = request.GET.get("TableName")
    result = api_service.get_data_for_object(user_name, password, table_name)
    if result is not None:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def get_data_for_object_by_user_key(request):
    user_key = request.GET.get('Key')
    table_name = request.GET.get("TableName")
    result = api_service.get_data_for_object(user_key, table_name)
    if result is not None:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def get_expressions_for_dynamodb(request):
    user_name = request.GET.get('UserName')
    password = request.GET.get('Password')
    table_name = request.GET.get("TableName")
    result = api_service.get_expressions_for_dynamodb(user_name, password, table_name)
    if result is not None:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def get_data_for_dynamodb_obj(request):
    user_name = request.GET.get('UserName')
    password = request.GET.get('Password')
    table_name = request.GET.get("TableName")
    result = api_service.get_data_for_dynamodb_obj(user_name, password, table_name)
    if result is not None:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def get_data_for_object_sqlserver(request):
    user_key = request.GET.get('Key')
    table_name = request.GET.get("TableName")
    result = api_service.get_data_for_object_sqlserver(user_key, table_name)
    if result is not None:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def get_data_for_object_dynamodb(request):
    user_key = request.GET.get('Key')
    table_name = request.GET.get("TableName")
    result = api_service.get_data_for_object_dynamodb(user_key, table_name)
    if result is not None:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def get_function_name(request):
    user_key = request.GET.get('User_Key')
    object_name = request.GET.get("Object_Name")
    result = api_service.get_function_name(user_key, object_name)
    if result is not None:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = result
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)


def get_data_from_adls(request):
    user_key = request.GET.get('user_key')
    function_name = request.GET.get("function_name")
    filter_data = request.GET.get("filter")
    response = api_service.get_data_from_adls(user_key, function_name, filter_data)
    if response is not None:
        response_data['Status'] = 'Success'
        response_data['Message'] = 'Record fetched successfully'
        response_data['Result'] = response
        return JsonResponse(response_data)
    else:
        response_data['Status'] = 'Failed'
        response_data['Message'] = 'No record found'
        response_data['Result'] = None
        return JsonResponse(response_data)
