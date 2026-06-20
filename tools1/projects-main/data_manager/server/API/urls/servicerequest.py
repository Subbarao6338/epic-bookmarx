from unicodedata import name
from django.urls import path, re_path
from API.views import servicerequest as views

urlpatterns = [
    path('createservicerequest',
         views.createservicerequest,
         name='createservicerequest'),
    path('getservicedetails',
         views.getservicedetails,
         name='getservicedetails'),
    path('update_servicerequest',
         views.update_servicerequest,
         name='update_servicerequest'),
    path('delete_servicerequest',
         views.delete_servicerequest,
         name='delete_servicerequest'),
    path('details_servicerequest',
         views.details_servicerequest,
         name='details_servicerequest'),
    path('getcommentdetails',
         views.getcommentdetails,
         name='getcommentdetails'),
    path('createcomment', views.createcomment, name='createcomment'),
    path('delete_comment', views.delete_comment, name='delete_comment'),
    path('update_comment', views.update_comment, name='update_'),
    path("download_sr_file_view",
         views.download_sr_file_view,
         name="sr_file_download"),
]