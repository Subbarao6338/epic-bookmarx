# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django.urls import path, re_path
from app import views
from django.conf.urls import url

urlpatterns = [

    # The home page
    path('', views.reports, name='home'),
	url(r'^home', views.reports, name='home'),
    url(r'^reports', views.reports, name='reports'),
    url(r'^stream_data', views.simulator, name='simulator'),
    url(r'^start_simulator', views.start_simulator, name='start_simulator'),
    url(r'^stop_simulator', views.stop_simulator, name='stop_simulator'),
    url(r'^get_simulator_details', views.get_simulator_details,
        name='get_simulator_details'),
    url(r'^get_hub_name_details', views.get_hub_name_details, name='get_hub_name_details'),
    url(r'^get_device_count_from_metadata', views.get_device_count_from_metadata, name='get_device_count_from_metadata'),
    url(r'^get_device_count', views.get_device_count, name='get_device_count'),
    url(r'^model_training', views.sdv_model_training, name='sdv_model_training'),
    url(r'^get_sdv_models', views.get_sdv_models_view, name='get_sdv_models'),
    url(r"download_sdv_file", views.download_sdv_file_view, name="sdv_file_download"),
    url(r"download_rel_sdv_file", views.download_rel_sdv_file_view, name="rel_sdv_file_download"),
    url(r'^setting', views.setting_page, name='setting'),
    url(r'^submit_setting_values', views.submit_setting_form, name="submit_setting_values"),
    url(r'^get_setting_details', views.get_setting_details, name='get_setting_details'),
    url(r'^image_submit', views.image_submit, name='image_submit'),
    # url(r'^image_generation', views.image_generation, name='image_generation'),
    url(r'^custom_message_template', views.custom_message_template, name='custom_message_template'),
    url(r'^display_json_content', views.display_json_content, name='display_json_content'),
    url(r'^push_to_db', views.push_to_db, name='push_to_db'),
    url(r'^download_zip', views.download_zip, name='download_zip'),
    url(r'^json_content_property', views.json_content_property, name='json_content_property'),
    url(r'^get_json_files', views.get_sdv_models_view, name='get_json_files'),
    url(r'^static_file', views.get_static_file, name='get_static_file'),
    url(r'^get_template_list', views.get_template_list_view, name='get_template_list'),
    url(r'^schema_data_simulator', views.data_simulator, name='data_simulator'),
    url(r'^get_template_models', views.get_template_models_view, name='get_template_models'),
    url(r'^remove_template_model', views.get_after_removing_template_model, name='get_after_remove_template_model'),
    url(r'^get_complete_json', views.get_complete_json_view, name='get_complete_json'),
    url(r'^rel_sdv_model_training', views.rel_sdv_model_training, name='rel_sdv_model_training'),
    url(r'^get_rel_sdv_models', views.get_rel_sdv_models_view, name='get_rel_sdv_models'),
    url(r"download_rel_sdv_file", views.download_rel_sdv_file_view, name="rel_sdv_file_download"),
    url(r'^get_metadata_json', views.get_metadata_json_view, name='get_metadata_json'),
    url(r'^get_uploaded_json', views.get_uploaded_json_view, name='get_uploaded_json'),
    # url(r'^generate', views.generate_page_view, name='generate'),
    url(r'^get_model_list', views.get_model_list_dropdown, name='dropdown_model_list'),
    url(r'^synth_data_generating', views.synth_data_generation, name='synth_data_generation'),
    url(r'^get_anonymized_data', views.get_anonymized_data, name='get_anonymized_data'),
    url(r'^start_sdv_training', views.start_sdv_training, name='start_sdv_training'),
    url(r'^start_rel_sdv_training', views.start_rel_sdv_training, name='start_rel_sdv_training'),
    #url(r'^image_anonymization_page', views.image_anonymization_page, name='image_anonymization_page'),
    url(r'^image_anonymization_submit', views.image_anonymization_submit, name='image_anonymization_submit'),
    url(r'^image_anonymization_generate', views.image_anonymization_generate, name='image_anonymization_suit'),
    url(r'^image_anonymization_preview', views.image_anonymization_preview, name='image_anonymization_subm'),
    url(r'^download_image', views.download_image, name='download_image'),
    url(r'^get_id_and_name', views.get_id_and_name, name='get_id_and_name'),
    url(r'^get_schema_detail', views.get_schema_detail, name='get_schema_detail'),
    url(r'^get_synthetic_data_list', views.get_synthetic_data_list, name='get_synthetic_data_list'),
    url(r'^generated_data_summary', views.generated_list, name='generated_data_summary'),
    url(r'^dataset_counts', views.dataset_counts, name='dataset_counts'),
    url(r'^get_recent_sdv_models', views.get_recent_sdv_models, name='get_recent_sdv_models'),
    url(r'^get_recent_rel_sdv_models', views.get_recent_rel_sdv_models, name='get_recent_rel_sdv_models'),
    url(r'^get_modal_by_type', views.get_modal_by_type, name='get_modal_by_type'),
    url(r'^get_total_rows_count', views.get_total_rows_count, name='get_total_rows_count'),
    url(r'^add_records_to_file', views.add_records_to_file, name='add_records_to_file'),
    url(r'^remove_record_from_file', views.remove_record_from_file, name='remove_record_from_file'),
    url(r'^remove_synthgen_record', views.remove_synthgen_record, name='remove_synthgen_record'),
    url(r'^remove_single_sdv_model', views.remove_single_sdv_model, name='remove_single_sdv_model'),
    url(r'^remove_relational_sdv_model', views.remove_relational_sdv_model, name='remove_relational_sdv_model'),
    url(r'^get_cloudtype_details', views.get_cloudtype_details, name='get_cloudtype_details'),
    url(r'^get_cloudservicetype_details', views.get_cloudservicetype_details, name='get_cloudservicetype_details'),
	url(r'^column_list', views.column_list, name='column_list'),
    url(r'^progress_bar', views.progress_bar, name='progress_bar')

    # Matches any html file
    # re_path(r'^.*\.*', views.pages, name='pages'),

]
