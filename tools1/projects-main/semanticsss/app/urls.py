"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""

from django.conf.urls import url
from django.urls import path, re_path
from app import views

urlpatterns = [

    # The home page
    path('', views.login, name='login'),
    path('login', views.login, name='login'),
    path('dol', views.get_businessobj_list, name='get_businessobj_list'),
    path('cdo', views.create_business_object, name='create_business_object'),
    path('get_DB', views.get_DB, name='get_DB'),
    path('execute_custom_query', views.execute_custom_query, name='execute_custom_query'),
    path('home', views.dashboard, name='home'),
    path('access_permissions', views.access_permissions, name='access_permissions'),
    path('object_permissions', views.object_permissions, name='object_permissions'),
    path('user', views.users, name='user'),
    path('user/<int:id>/', views.editusers, name='user'),
    path('users', views.user_details, name='users'),
    path('maskencryption', views.userwise_maskencryption, name='userwise_maskencryption'),
    url(r'^get_database_list', views.get_database_list, name = 'get_database_list'),
    url(r'^get_table_list', views.get_table_list, name = 'get_table_list'),
    url(r'^get_tables_fields_list', views.get_tables_fields_list, name = 'get_tables_fields_list'),
    url(r'^get_field_list_on_table_name', views.get_field_list_on_table_name, name = 'get_field_list_on_table_name'),
    url(r'^save_business_object_detail', views.save_business_object_detail, name = 'save_business_object_detail'),
    url(r'^get_businessobj_fields', views.get_businessobj_fields, name='get_businessobj_fields'),
    url(r'^get_businessobj_joindetails', views.get_businessobj_joindetails, name='get_businessobj_joindetails'),
    url(r'^get_businessobj_wheredetails', views.get_businessobj_wheredetails, name='get_businessobj_wheredetails'),
    url(r'^execute_query', views.execute_query, name='execute_query'),
    url(r'^get_user_list', views.get_user_list, name='get_user_list'),
    url(r'^execute_col_sec', views.execute_col_sec, name='execute_col_sec'),
    url(r'^execute_object_permission', views.execute_object_permission, name='execute_object_permission'),
    url(r'^execute_row_sec', views.execute_row_sec, name='execute_row_sec'),
    url(r'^get_field_values', views.get_field_values, name='get_field_values'),
    url(r'^save_user_management_object_detail', views.save_user_management_object_detail,
        name='save_user_management_object_detail'),
    url(r'^update_user_status', views.update_user_status, name='update_user_status'),
    url(r'^get_user_detail_by_id', views.get_user_detail_by_id, name='get_user_detail_by_id'),
    url(r'^get_business_object_data_by_name', views.get_business_object_data_by_name, name='get_business_object_data_by_name'),
    url(r'^save_maskencryptionstatus', views.save_maskencryptionstatus, name='save_maskencryptionstatus'),
    url(r'^get_object_permision_details', views.get_object_permision_details, name='get_object_permision_details'),
    url(r'^get_row_permision_details', views.get_row_permision_details, name='get_row_permision_details'),
    url(r'^get_col_permision_details', views.get_col_permision_details, name='get_col_permision_details'),
    url(r'^get_mask_encryption_details', views.get_mask_encryption_details, name='get_mask_encryption_details'),
    url(r'^get_users_on_domain_object', views.get_users_on_domain_object, name='get_users_on_domain_object'),
    url(r'^get_domain_object_list_userwise', views.get_domain_object_list_userwise, name='get_domain_object_list_userwise'),
    url(r'^is_authenticated', views.is_authenticated, name='is_authenticated'),
    url(r'^change_login_password', views.change_login_password, name='change_login_password'),
    url(r'^check_function_availability', views.check_function_availability, name='check_function_availability'),
    url(r'^fetch_data_from_adx', views.fetch_data_from_adx, name='fetch_data_from_adx'),
    # Matches any html file
    # re_path(r'^.*\.*', views.pages, name='pages'),

]
