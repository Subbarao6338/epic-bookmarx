from django.urls import path, re_path
from API.views import metadata as views

urlpatterns = [
    path('save_metadata', views.save_metadata, name='save_metadata'),
    path('get_metadata', views.get_metadata, name='get_metadata'),
    path('view_metadatafile', views.view_metadatafile, name='view_metadatafile'),
    path('delete_metadata', views.delete_metadata, name='delete_metadata'),

]

