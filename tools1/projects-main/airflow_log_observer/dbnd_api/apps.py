"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""

from django.apps import AppConfig


class DbndApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'dbnd_api'
