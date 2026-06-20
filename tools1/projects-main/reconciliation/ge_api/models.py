from django.db import models
from datetime import datetime

# Create your models here.

# class User(models.Model):
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

class Project(models.Model):
    project_id=models.IntegerField(primary_key=True)
    project_name = models.CharField(max_length=50)
    isactive = models.BooleanField()
