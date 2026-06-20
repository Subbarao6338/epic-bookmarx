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
from statistics import mode
from django.db import models

# Create your models here.


class PromConfig(models.Model):
    id = models.AutoField(primary_key=True)
    config_yml = models.TextField(default="""global:
scrape_interval: 15s
scrape_timeout: 10s
evaluation_interval: 1m

remote_write:
- url: "http://influxdb:8086/api/v1/prom/write?u=admin&p=admin&db=prometheus"
remote_read:
- url: "http://influxdb:8086/api/v1/prom/read?u=admin&p=admin&db=prometheus"

scrape_configs:
- job_name: "prometheus"
  static_configs:
    - targets: ["prometheus:9090"]""")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class MetricSource(models.Model):
    id = models.AutoField(primary_key=True)
    source_name = models.CharField(max_length=40)
    image = models.CharField(max_length=100)
    description = models.TextField(null=True)
    default_config = models.JSONField()
    configured_value = models.JSONField(null=True)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ConfigString(models.Model):
    id = models.AutoField(primary_key=True)
    config_name = models.CharField(max_length=100)
    format = models.CharField(max_length=40, null=True)
    value = models.TextField(default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
