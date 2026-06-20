import {
    Tenant_ID,
    Subscription_ID,
    Resource_Group,
    Factory_Name,
} from './azure_api_config'

// Datasource API URL Start
export const create_datasource_url = 'datasource/createdatasource'
export const fetch_datasource_url = 'datasource/datasource_summary'
export const update_datasource_url = 'datasource/update_datasource'
export const delete_datasource_url = 'datasource/delete_datasource'
    // Datasource API URL End

// Settings API URL Start
export const create_settings_url = 'settings/createsettings'
export const fetch_settings_url = 'settings/getsettings'
export const update_settings_url = 'settings/updatesettings'
export const delete_settings_url = 'settings/deletesettings'
export const check_settings_title_url = 'settings/checksettingstitle'
    // Settings API URL End

// Metadata API URL Start
export const save_metadata_url = 'metadata/save_metadata'
export const get_metadata_url = 'metadata/get_metadata'
export const view_metadata_file_url = 'metadata/view_metadatafile'
export const delete_metadata_url = 'metadata/delete_metadata'
    // Metadata API URL End

// Tenant ID Start
export const tenant_id = 'tenant_id_1'
    // Tenant ID End

// DataPipeline URL Start
export const gettoken_url = 'datapipeline/gettoken'
export const listpipeline_url = 'datapipeline/listdatapipeline'
export const gettoken_exturl =
    'https://login.microsoftonline.com/' + Tenant_ID + '/oauth2/token'
export const listpipeline_exturl =
    'https://management.azure.com/subscriptions/' +
    Subscription_ID +
    '/resourceGroups/' +
    Resource_Group +
    '/providers/Microsoft.DataFactory/factories/' +
    Factory_Name +
    '/pipelines?api-version=2018-06-01'
export const query_debugpipelines_url = 'datapipeline/query_debugpipelines'
export const query_debugpipelines_exturl =
    'https://management.azure.com/subscriptions/' +
    Subscription_ID +
    '/resourceGroups/' +
    Resource_Group +
    '/providers/Microsoft.DataFactory/factories/' +
    Factory_Name +
    '/querydebugPipelineRuns?api-version=2018-06-01'
export const query_pipelines_url = 'datapipeline/query_pipelines'
export const query_pipelines_exturl =
    'https://management.azure.com/subscriptions/' +
    Subscription_ID +
    '/resourceGroups/' +
    Resource_Group +
    '/providers/Microsoft.DataFactory/factories/' +
    Factory_Name +
    '/queryPipelineRuns?api-version=2018-06-01'

// DataPipeline URL END

// Organization URL Start
export const create_organization_url = 'organization/createorganization'
export const update_organization_url = 'organization/update_organization'
export const delete_organization_url = 'organization/delete_organization'
export const fetch_organization_url = 'organization/getorganizationdetails'
export const is_organization_exist = 'organization/isorganizationexists'
    // Organization URL END

// Service Request URL Start
export const create_service_url = 'servicerequest/createservicerequest'
export const fetch_service_url = 'servicerequest/getservicedetails'
export const update_service_request_url = 'servicerequest/update_servicerequest'
export const delete_service_request_url = 'servicerequest/delete_servicerequest'
export const create_comment_url = 'servicerequest/createcomment'
export const update_comment_url = 'servicerequest/update_comment'
export const delete_comment_url = 'servicerequest/delete_comment'
export const fetch_comment_url = 'servicerequest/getcommentdetails'
export const details_service_request_url =
    'servicerequest/details_servicerequest'
export const download_sr_file_url = 'servicerequest/download_sr_file_view'
    // Service Request URL END

// Projects URL Start
export const create_projects_url = 'projects/createprojects'
export const update_project_url = 'projects/update_projects'
export const create_user = 'projects/createuser'
export const get_user_details = 'projects/getuserdetails'
export const delete_user_profile = 'projects/delete_users'
export const fetch_project_url = 'projects/getprojectdetails'
export const delete_project_url = 'projects/delete_projects'
export const is_project_exist = 'projects/isprojectexists'
export const is_user_exist = 'projects/isuserexists'
export const projects_config = 'projects/projects_config'
export const projects_nameslist = 'projects/projects_nameslist'
export const update_projects_config = 'projects/update_projects_config'
export const getprojects_userbased_url = 'projects/getprojects_userbased'
export const getresources_projectbased_url =
    'projects/getresources_projectbased'
    // Projects URL END

// Cost Page URL Start
export const gettokens_url = 'usagemonitoring/gettokens'
export const listDateWiseCostDetails = 'usagemonitoring/listDateWiseCostDetails'
export const getAreaChartData = 'usagemonitoring/getAreaChartData'
export const getDonutChart_Service = 'usagemonitoring/getDonutChart_Service'
export const getDonutChart_Location = 'usagemonitoring/getDonutChart_Location'
export const getDonutChart_ResourceGroup =
    'usagemonitoring/getDonutChart_ResourceGroup'
    // Cost Page URL Start

// usage monitoring URL Start
export const listusagemonitoring_url = 'usagemonitoring/listusagemonitoring'
export const gettokens_exturl =
    'https://login.microsoftonline.com/' + Tenant_ID + '/oauth2/token'
export const listusagemonitoring_exturl =
    'https://management.azure.com/subscriptions/' +
    Subscription_ID +
    '/providers/Microsoft.Consumption/usageDetails?api-version=2021-10-01&metric=actualcost'
export const listusagemonitoring_url_chart =
    'usagemonitoring/listusagemonitoring_chart'
    //usage monitoring URL END

// Notifications URL Start
export const fetch_notifications_url = 'notifications/fetch_notifications'
export const update_notifications_status_url = 'notifications/update_status'
export const add_notifications_url = 'notifications/add_notifications'
export const getRecentActivities_url = 'notifications/getRecentActivities'
    // Notifications URL END

// Reports & Dashboards URL Start
export const fetch_reportsdetails_url = 'reportsdetails/fetchreportsdetails'
    // Reports & Dashboards URL End

// sign_in users URL Start
//export const fetch_users_url = "signin/getusersdetails";
export const checkUserAuthorized_url = 'signin/checkUserAuthorized'
export const checkUserAuthorized_url1 = 'signin/checkUserAuthorized1'
    // sign_in users URL End
    //
export const fetch_RecentViewed_url = 'recentviewed/getRecentViewed'
export const save_recentviewed_url = 'recentviewed/save_recentviewed'
    //auto_complete search box

export const fetch_search_result_url = 'search/get_search_result'

export const fetch_full_Search_result_url = 'search/get_full_search_result'

export const deploy_software_url = 'software/deploy_software'
export const deploy_data_url = 'data/deploy_data'

// Consolidated Single View
export const fetch_component_data = 'singleview/get_component_data'
export const fetch_hub_and_storage_data = 'singleview/get_hub_and_storage_data'
export const fetch_purview_data = 'singleview/get_purview_data'
export const fetch_pipeline_data = 'singleview/get_pipeline_data'
export const fetch_observability_data = 'singleview/get_observability_data'

///AutoDeploy
export const autodeploy_url = 'autodeploy/deploy'
export const autodestroy_url = 'autodeploy/destroy'
export const logs_url = 'autodeploy/deploylogs'
export const getkubernetes_cluster_url = 'autodeploy/getkubernetes_cluster'
export const create_kubernetescluster_url =
    'autodeploy/create_kubernetescluster'
export const delete_kubernetescluster_url =
    'autodeploy/delete_kubernetescluster'
export const getkubernetes_projectbased_url =
    'autodeploy/getkubernetes_projectbased'
export const getprovisionedresource_projectbased_url =
    'autodeploy/getprovisionedresource_projectbased'

/// User Management
export const get_users_url = 'users/getusers'
export const fetch_projectmgmt_url = 'projects/getprojectdetails'
export const create_projectmgmt_url = 'projects/createprojects'
export const update_projectmgmt_url = 'projects/update_projects'
export const delete_projectmgmt_url = 'projects/delete_projects'

export const create_project_resource_url = 'addresource/createprojectresource'
export const fetch_project_resource_url = 'addresource/getprojectresource'
export const delete_project_resource_url = 'addresource/deleteprojectresource'
export const delete_allproject_resource_url =
    'addresource/deleteallprojectresource'

export const Update_user_password = 'signin/updatepassword'