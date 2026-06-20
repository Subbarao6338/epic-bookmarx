# -*- encoding: utf-8 -*-
"""
=============================================================================
COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""

from django.db import models
from django.contrib.auth.models import User

# Create your models here.
from django import forms


'''class SDVForm(forms.Form):
    sdv_model_name = forms.CharField(
        label="Enter sdv model name", max_length=50)
    sdv_train_file = forms.FileField()


class SDVModel(models.Model):
    id = models.AutoField(primary_key=True)
    time = models.DateTimeField(auto_now_add=True)
    file = models.CharField(max_length=100)
   # sdv_model = models.CharField(max_length=100, null=True)
    #end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=100)'''
