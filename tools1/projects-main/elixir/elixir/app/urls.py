# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django.urls import path, re_path
from app import views
from django.conf.urls import url

urlpatterns = [

    # The home page
    path('', views.index, name='home'),
    path('dashboard', views.index, name='dashboard'),
    path('tasks', views.task_list_page, name='tasks'),
    path('task', views.create_edit_task_page, name='task'),
    url(r'^read_logfiles', views.read_logfiles, name='read_logfiles'),
    url(r'^upload_log_files', views.upload_log_files, name='upload_log_files'),
    # url(r'^generateregex', views.generateregex, name='generastart_regex_generation_for_taskteregex'),
    url(r'^getexecutionlog', views.getexecutionlog, name='getexecutionlog'),
    url(r'^getresults_api', views.getresults_api, name='getresults_api'),
    url(r'^view_task_details', views.view_task_details, name='view_task_details'),
    url(r'^insert_selection', views.insert_selection, name='insert_selection'),
    url(r'^save_regex_generation_task', views.save_regex_generation_task, name='save_regex_generation_task'),
    url(r'^get_total_records_count', views.get_total_records_count, name='get_total_records_count'),
    url(r'^get_log_data', views.get_log_data, name='get_log_data'),
    url(r'^get_log_record_by_id', views.get_log_record_by_id, name='get_log_record_by_id'),
    url(r'^save_tag_data_of_task', views.save_tag_data_of_task, name='save_tag_data_of_task'),
    url(r'^get_tag_data', views.get_tag_data, name='get_tag_data'),
    url(r'^save_highlighted_of_task', views.save_highlighted_of_task, name='save_highlighted_of_task'),
    url(r'^get_highlighted_data', views.get_highlighted_data, name='get_highlighted_data'),
    url(r'^start_regex_generation_for_task', views.start_regex_generation_for_task,
        name='start_regex_generation_for_task'),
    url(r'^get_log_line_numbers', views.get_log_line_numbers, name='get_log_line_numbers'),
    url(r'^word_based_position_marking', views.word_based_position_marking, name='word_based_position_marking'),
    url(r'^single_word_based_position_marking', views.single_word_based_position_marking,
        name='single_word_based_position_marking'),
    url(r'^index_based_position_marking', views.index_based_position_marking, name='index_based_position_marking'),
    path('logvalidation', views.logvalidation, name='logvalidation'),
    url(r'^save_task_dtl', views.save_task_dtl, name='save_task_dtl'),
    url(r'^read_task_dtl', views.read_task_dtl, name='read_task_dtl'),
    url(r'^upload_logvalidation_files', views.upload_logvalidation_files, name='upload_logvalidation_files'),
    url(r'^read_logval_files', views.read_logval_files, name='read_logval_files'),
    url(r'^update_task_status', views.update_task_status, name='update_task_status'),
    url(r'^gettasklist', views.get_task_list, name='gettasklist'),
    url(r'^get_task_detail', views.get_task_detail, name='get_task_detail'),
    url(r'^tag_based_position_marking', views.tag_based_position_marking, name='tag_based_position_marking'),
    url(r'^get_ml_models', views.get_ml_models, name='get_ml_models'),
    url(r'^download_ml_model', views.download_ml_model, name='download_ml_model'),
    url(r'^get_validation_result', views.get_validation_result, name='get_validation_result'),
    url(r'^user_defined_formats_marking', views.user_defined_formats_marking, name='user_defined_formats_marking'),
    path('configuration', views.configuration, name='configuration'),
    url(r'^save_configuration_detail', views.save_configuration_detail, name='save_configuration_detail'),
    url(r'^get_config_details', views.get_config_details, name='get_config_details'),
    url(r'^delete_task', views.delete_task, name='delete_task'),
    url(r'^delete_validation_task', views.delete_validation_task, name='delete_validation_task'),
    url(r'^remove_highlight_data', views.remove_highlight_data, name='remove_highlight_data'),
    url(r'^delete_tag_data', views.delete_tag_data, name='delete_tag_data'),
    url(r'^reverse_single_word_based_position_marking', views.reverse_single_word_based_position_marking,
        name='reverse_single_word_based_position_marking'),
    url(r'^upload_pemfile', views.upload_pemfile, name='upload_pemfile'),
    url(r'^download_validation_result', views.download_validation_result, name='download_validation_result'),
    url(r'^check_java_path_variable', views.check_java_path_variable, name='check_java_path_variable'),
	url(r'^user_defined_format_selected_info', views.user_defined_format_selected_info, name='user_defined_format_selected_info'),
    url(r'^insert_user_defined_format_info', views.insert_user_defined_format_info, name='insert_user_defined_format_info'),
    url(r'^update_user_defined_format_info', views.update_user_defined_format_info, name='update_user_defined_format_info'),

    # Matches any html file
    # re_path(r'^.*\.*', views.pages, name='pages'),

]
