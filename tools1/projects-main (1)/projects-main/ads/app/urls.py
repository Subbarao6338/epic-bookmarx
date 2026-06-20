# -*- encoding: utf-8 -*-
"""Copyright"""
"""
* =============================================================================
* COPYRIGHT NOTICE
* =============================================================================
*  © Copyright HCL Technologies Ltd. 2021, 2022
* Proprietary and confidential. All information contained herein is, and
* remains the property of HCL Technologies Limited. Copying or reproducing the
* contents of this file, via any medium is strictly prohibited unless prior
* written permission is obtained from HCL Technologies Limited.
"""

from django.urls import path, re_path
from app import views
from django.conf.urls import url
from django.views.generic.base import TemplateView

urlpatterns = [
    # Pages
    # path('', views.home, name='home'),
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    url(r"^home", TemplateView.as_view(template_name='home.html'), name='home'),
    url(r"^info", TemplateView.as_view(template_name='info.html'), name='info'),
    url(r"^charts", TemplateView.as_view(template_name='charts.html'), name='charts'),
    url(r"^settings", TemplateView.as_view(template_name='settings.html'), name='settings'),
    url(r"^upload_files", TemplateView.as_view(template_name='upload_files.html'), name='upload_files'),
    url(r"^anomaly_table", TemplateView.as_view(template_name='anomaly_table.html'), name='anomaly_table'),
    url(r"^uploaded_files_table", TemplateView.as_view(template_name='uploaded_files_table.html'),
        name='uploaded_files_table'),
    url(r"^anomaly_detection_form", TemplateView.as_view(template_name='anomaly_detection_form.html'),
        name='anomaly_detection_form'),

    url(r'^save_filedetails', views.save_filedetails, name='save_filedetails'),
    url(r'^get_files', views.get_files_view, name='get_files'),
    url(r'^remove_file', views.get_after_removing_file, name='get_after_remove_file'),
    url(r'^anomaly_form', views.anomaly_form, name='anomaly_form'),
    url(r'^graviton_table', views.graviton_table, name='graviton_table'),
    url(r'^get_anomaly_services', views.settings_anomaly_service, name='get_anomaly_services'),
    url(r'^update_anomaly_services', views.update_anomaly_services, name='update_anomaly_services'),
    url(r'^get_setting_values', views.get_setting_values, name='get_setting_values'),
    url(r'^chart_classification', views.chart_classification, name='chart_classification'),
    url(r'^dataset_counts', views.dataset_counts, name='dataset_counts'),
    url(r'^view_anomaly', views.view_anomaly, name='view_anomaly'),
    url(r'^get_multi_data', views.get_multi_data, name='get_multi_data'),
    url(r'^get_chart_data', views.get_chart_data, name='get_chart_data'),
    url(r'^get_column_list', views.get_column_list, name='get_column_list'),
    url(r'^save_anomaly_parameters', views.save_anomaly_parameters, name='save_anomaly_parameters'),

    ##### Connect to Database
    url(r'^connect_db', views.connect_db, name='connect_db'),
    url(r'^connect_mssql', views.connect_mssql, name='connect_mssql'),
    url(r'^save_kafka_details', views.save_kafka_details, name='save_kafka_details'),
    url(r'^save_db_details', views.save_db_details, name='save_db_details'),
    url(r'^get_kafka', views.get_kafka, name='get_kafka'),

    # Matches any html file
    # url(r'^get_row', views.get_row_view, name='get_row'),
    # re_path(r'^.*\.*', views.pages, name='pages'),
]
