
from django.urls import path, re_path
from API.views import costDetails as views

urlpatterns = [
    path('gettokens', views.generate_token, name='generate_token'),
    path('listcostDetails', views.listcostDetails, name='listcostDetails'),
    path('query_debugcostDetails', views.query_debugcostDetails, name='query_debugcostDetails'),
    path('query_costDetails', views.query_costDetails, name='query_costDetails'),
]