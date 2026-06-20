"""App URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, re_path, path
from django.views.generic import TemplateView


urlpatterns = [
    path('settings/', include('API.urls.settings')),
    path('metadata/', include('API.urls.metadata')),
    path('datasource/', include('API.urls.datasource')),
    path('datapipeline/', include('API.urls.datapipeline')),
    path('organization/', include('API.urls.organization')),
    path('usagemonitoring/', include('API.urls.usagemonitoring')),
    path('cost/', include('API.urls.costDetails')),
    path('notifications/', include('API.urls.notifications')),
    path('projects/', include('API.urls.projects')),
    path('servicerequest/', include('API.urls.servicerequest')),
    path('signin/', include('API.urls.signin')),
    path('reportsdetails/', include('API.urls.reportsdetails')),    
    path('search/', include('API.urls.search')),
    path('recentviewed/', include('API.urls.recentlyviewed')),
    path('software/', include('API.urls.software')),
    path('data/', include('API.urls.data')),
    path('singleview/', include('API.urls.singleView')),
    path('autodeploy/',include('API.urls.autodeploy')),
    path('users/',include('API.urls.usersMgmt')),
    path('addresource/',include('API.urls.addresource')),
    re_path('.*',TemplateView.as_view(template_name = 'index.html')),
]