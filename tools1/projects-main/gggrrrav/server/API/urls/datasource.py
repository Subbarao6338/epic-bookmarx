from django.urls import path, re_path
from API.views import datasource as views

urlpatterns = [

    path('createdatasource', views.createdatasource, name='createdatasource'),
    path('datasource_summary', views.get_datasource, name='datasource_summary'),
    path('update_datasource', views.update_datasource, name='update_datasource'),
    path('delete_datasource', views.delete_datasource, name='delete_datasource'),
]
