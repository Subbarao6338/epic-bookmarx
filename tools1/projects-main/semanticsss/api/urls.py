"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""

from django.conf.urls import url
from api import controller

urlpatterns = [
    url(r'^is_valid_user', controller.is_valid_user, name='is_valid_user'),
    # url(r'^list_domain_objects', controller.list_domain_objects, name='list_domain_objects'),
    url(r'^list_domain_objects', controller.list_domain_objects_by_user_key, name='list_domain_objects'),
    url(r'^list_user_domain_objects', controller.list_user_domain_objects, name='list_user_domain_objects'),
    url(r'^list_table_fields', controller.list_table_fields, name='list_table_fields'),
    url(r'^get_connection_string_of_object', controller.get_connection_string_of_object,
        name='get_connection_string_of_object'),
    url(r'^get_select_query_for_object', controller.get_select_query_for_object, name='get_select_query_for_object'),
    # url(r'^get_data_for_object', controller.get_data_for_object, name='get_data_for_object'),
    url(r'^get_data_for_object', controller.get_data_for_object_by_user_key, name='get_data_for_object'),
    url(r'^get_expressions_for_dynamodb', controller.get_expressions_for_dynamodb, name='get_expressions_for_dynamodb'),
    url(r'^get_data_for_dynamodb_obj', controller.get_data_for_dynamodb_obj, name='get_data_for_dynamodb_obj'),
    url(r'^get_data_for_sqlobject', controller.get_data_for_object_sqlserver, name='get_data_for_sqlobject'),
    url(r'^get_data_for_obj_dynamodb', controller.get_data_for_object_dynamodb, name='get_data_for_obj_dynamodb'),
    url(r'^get_function_name', controller.get_function_name, name='get_function_name'),
    url(r'^get_data_from_adls', controller.get_data_from_adls, name='get_data_from_adls'),
]