from django.urls import path
from ge_api import views

urlpatterns = [
    # datasource
    path('list_datasources/', views.list_datasources_view),
    path('list_data_assets/<str:datasource_name>/', views.list_data_assets_view),
    path('create_datasource/', views.create_datasource_view),
    path('delete_datasource/<str:datasource_name>', views.delete_datasource_view),

    # expectation suite
    path('list_expectation_suites/', views.list_expectation_suites_view),
    path('create_expectation_suite/', views.create_expectation_suite_view),
    path('delete_expectation_suite/<str:suite_name>/',
         views.delete_expectation_suite_view),

    # checkpoint/validation
    path('list_checkpoints/', views.list_checkpoints_view),
    path('create_checkpoint/', views.create_checkpoint_view),
    path('run_checkpoint/<str:checkpoint_name>/', views.run_checkpoint_view),
    path('delete_checkpoint/<str:checkpoint_name>/',
         views.delete_checkpoint_view),

    # validations
    path('validation/', views.validation_view),
    path('validation/<str:suite_name>/<str:run_name>/', views.validation_view),
    path('validations/', views.validations_view),

    # API
#     path('run_checkpoint/<str:checkpoint_name>/', views.run_checkpoint_view),
    path('api_validation', views.api_validation_view),

    # realtime-scenario
    path('create_stream_checkpoint/', views.create_stream_checkpoint_view),
    path('delete_stream_checkpoint/<str:checkpoint_name>/',
         views.delete_stream_checkpoint_view),
    path('list_stream_checkpoints/', views.list_stream_checkpoints_view),
    path('start_stream_validation/', views.start_streamdata_validation_view),
    path('stop_stream_validation/', views.stop_streamdata_validation_view),
    path('get_stream_validations/<str:checkpoint_name>/',
         views.get_streamdata_validations_view),

    # reports
    path('details_report/', views.details_report_view),
    path('details_report/<int:id>/', views.details_report_view),

    # data profiling
    path('data_profiling/', views.data_profiling_view),
    path('get_columns_of_asset/', views.get_columns_of_asset),

    # wizard_flow
    path('insert_to_wizard/', views.insert_datasource_name_wizard_flow_view),
    path('update_asset_to_wizard/', views.update_asset_to_wizard_flow_view),
    path('update_column_and_asset/', views.update_wizard_with_asset_and_col_data_view),
    path('update_ces_to_wizard/', views.update_selected_ce_to_wizard_flow_view),
    path('update_expectation_suite/', views.update_expectation_suite_to_wizard_flow_view),
    path('update_status_to_wizard/', views.update_status_to_wizard_flow_view),
    path('get_wizard_detail/', views.get_wizard_detail_view),
    path('get_datasource_detail/<str:ds_name>/', views.get_datasource_details_view),

]
