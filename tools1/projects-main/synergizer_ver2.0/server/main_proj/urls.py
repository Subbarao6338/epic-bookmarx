"""
=============================================================================
COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
emains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""
"""main_proj URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""




from django import urls
from django.contrib import admin
from django.http import HttpResponse, JsonResponse
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from rest_framework.schemas import get_schema_view
def api_metadata_view(request):
    return JsonResponse({'api_varsion': '0.01', 'description': "not available"})


def unhandled_route_view(request):
    return JsonResponse({"status": "success", "message": "-------------------"})


urlpatterns = [
    # apis
    path('api/', api_metadata_view),
    path('api/v1/', include('api_services.dbnd_server.urls')),
    path('api/admin/', admin.site.urls),
    path('api/config/', include('api_services.config_api.urls')),
    path('api/influxdb/', include('api_services.influxdb_api.urls')),
    path('api/prometheus/', include('api_services.prometheus_api.urls')),
    path('api/grafana/', include('api_services.grafana_api.urls')),
    path('api/airflow/', include('api_services.airflow.urls')),
    path('api/adf/', include('api_services.azure_df.urls')),
    # api documentation
    path('swagger-ui/', TemplateView.as_view(
        template_name='swagger-ui.html',
        extra_context={'schema_url': 'openapi-schema'}
    ), name='swagger-ui'),
    path('openapi', get_schema_view(
        title="Synergizer API",
        description="Some description ..",
        version="1.0.0"
    ), name='openapi-schema'),
    # may be reactjs
    re_path(".*", unhandled_route_view)
]
