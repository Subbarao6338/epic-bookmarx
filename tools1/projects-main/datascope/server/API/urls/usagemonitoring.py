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
from django.urls import path, re_path

from API.views import usagemonitoring as views

urlpatterns = [
     ### Cost Page APIs Start
    path('gettokens', views.generate_token, name='generate_token'),
    path('listDateWiseCostDetails', views.listDateWiseCostDetails, name='listDateWiseCostDetails'),
    path('getAreaChartData', views.getAreaChartData, name='getAreaChartData'),
    path('getDonutChart_Service', views.getDonutChart_Service, name='getDonutChart_Service'),
    path('getDonutChart_Location', views.getDonutChart_Location, name='getDonutChart_Location'),
    path('getDonutChart_ResourceGroup', views.getDonutChart_ResourceGroup, name='getDonutChart_ResourceGroup'),
     ### Cost Page APIs End

    path('listusagemonitoring',
         views.listusagemonitoring,
         name='listusagemonitoring'),
    path('listusagemonitoring_chart',
         views.listusagemonitoring_chart,
         name='listusagemonitoring_chart'),

]