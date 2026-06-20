from django.urls import path, re_path
from API.views import datapipeline as views

urlpatterns = [
    path('gettoken', views.generate_token, name='generate_token'),
    path('listdatapipeline', views.listdatapipeline, name='listdatapipeline'),
    path('query_debugpipelines', views.query_debugpipelines, name='query_debugpipelines'),
    path('query_pipelines', views.query_pipelines, name='query_pipelines'),

]