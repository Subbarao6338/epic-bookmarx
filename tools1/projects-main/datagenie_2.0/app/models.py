# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django.db import models
from django.contrib.auth.models import User

# Create your models here.
from django import forms


class SDVForm(forms.Form):
    sdv_model_name = forms.CharField(
        label="Enter sdv model name", max_length=50)
    sdv_train_file = forms.FileField()


class SDVModel(models.Model):
    id = models.AutoField(primary_key=True)
    start_time = models.DateTimeField(auto_now_add=True)
    train_file = models.CharField(max_length=100)
    sdv_model = models.CharField(max_length=100, null=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=100)
