from django.urls import path, re_path
from API.views import settings as views

urlpatterns = [

    path('createsettings', views.createsettings, name='createsettings'),
    path('getsettings', views.getsettings, name='getsettings'),
    path('updatesettings', views.updatesettings, name='updatesettings'),
    path('deletesettings', views.deletesettings, name='deletesettings'),

]