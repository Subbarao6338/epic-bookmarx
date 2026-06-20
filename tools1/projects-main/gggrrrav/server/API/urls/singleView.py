from django.urls import path, re_path
from API.views import singleView as views

urlpatterns = [
    path('get_component_data', views.get_component_data, name='get_component_data'),
    path('get_hub_and_storage_data', views.get_hub_and_storage_data, name='get_hub_and_storage_data'),
    path('get_purview_data', views.get_purview_data, name='get_purview_data'),
    path('get_pipeline_data', views.get_pipeline_data, name='get_pipeline_data'),
    path('get_observability_data', views.get_observability_data, name='get_observability_data'),
]