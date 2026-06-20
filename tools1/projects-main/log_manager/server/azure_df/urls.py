from django.contrib import admin
from django.urls import path

from azure_df.views import list_factories, list_pipelines, pipeline_runs

urlpatterns = [
    path('pipelines/', list_pipelines),
    path('pipeline_runs/', pipeline_runs),
]
