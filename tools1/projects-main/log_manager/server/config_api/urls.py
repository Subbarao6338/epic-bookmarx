from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('metric_source/', metric_source_config),
    path('metric_source/<int:id>/', metric_source_config),
    path('metric_exporter/',metric_exporter),
    path('home_page/',home_page),
    path('', config_view),
    path('<str:config_name>/', config_view),
]
