"""COPYRIGHT NOTICE
=============================================================================
© Copyright HCL Technologies Ltd. 2021, 2022
Proprietary and confidential. All information contained herein is, and
remains the property of HCL Technologies Limited. Copying or reproducing the
contents of this file, via any medium is strictly prohibited unless prior
written permission is obtained from HCL Technologies Limited.
"""

from django.contrib import admin
from django.urls import path, include  # add this

urlpatterns = [
    # path('admin/', admin.site.urls),          # Django admin route
    # path('admin' , admin.site.urls),          # Django admin route
    # path("", include("authentication.urls")), # Auth routes - login / register
    path("", include("app.urls")),             # UI Kits Html files
    path("api/", include("api.urls"))
]
