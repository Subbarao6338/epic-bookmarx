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
from rest_framework import serializers
from .models import DatasetLog, PipelineDefinition, PipelineRun, TaskDefinition, TaskRunAttempt, TaskRunLog, TaskRunMetric
from .models import TaskRun


class PipelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = PipelineDefinition
        fields = "__all__"


class PipelineRunSerializer(serializers.ModelSerializer):
    class Meta:
        model = PipelineRun
        fields = "__all__"


class TaskDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskDefinition
        fields = "__all__"


class TaskRunSerializer(serializers.ModelSerializer):

    class Meta:
        model = TaskRun
        fields = "__all__"


class TaskRunAttemptSerializer(serializers.ModelSerializer):

    class Meta:
        model = TaskRunAttempt
        fields = "__all__"


class TaskRunMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskRunMetric
        fields = "__all__"


class TaskRunLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskRunLog
        fields = "__all__"


class DatasetLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatasetLog
        fields = "__all__"
