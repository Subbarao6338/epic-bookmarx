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
import re
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from Utility import servicerequest_utility as servicerequest_util
import os
import json


@csrf_exempt
def getservicedetails(request):
    response = servicerequest_util.get_servicedetails()
    print(response)
    return HttpResponse(json.dumps(response['data']),
                        content_type="application/json")


@csrf_exempt
def createservicerequest(request):
    file_status = request.POST['filestatus']
    print("file_status")
    print(file_status)
    if file_status == 'true':
        file = request.FILES['file']
    else:
        file = ""
    sr_id = servicerequest_util.generate_srid()
    json_req = {
        'title':
        request.POST['title'],
        'description':
        request.POST['description'],
        'acc_details':
        request.POST['acc_details'],
        'file_path':
        handle_uploaded_file('temp_files/service_req_files/', file, sr_id)
    }

    response = servicerequest_util.create_servicedetails(json_req)
    return HttpResponse(response)


@csrf_exempt
def update_servicerequest(request):
    response = servicerequest_util.update_servicerequest(request)
    return HttpResponse(response)


@csrf_exempt
def delete_servicerequest(request):
    response = servicerequest_util.delete_servicerequest(request)
    return HttpResponse(response)


@csrf_exempt
def handle_uploaded_file(path, file, sr_id):
    if file == "":
        return ""
    else:
        isExist = os.path.exists(path)
        if not isExist:
            os.mkdir(path)
        temp_file_path = file.name
        file_path = temp_file_path.split(
            ".")[0] + "_" + sr_id + "." + temp_file_path.split(".")[1]
        with open(path + file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)
            return path + file_path


@csrf_exempt
def details_servicerequest(request):
    response = servicerequest_util.details_servicerequest(request)
    return JsonResponse(response)


@csrf_exempt
def download_sr_file_view(request):
    print("FFFF->.>>>>>")
    if request.method == "GET":
        #filetype = request.GET.get("filetype")
        filename = request.GET.get("filename")
        print("FFFF->.>>>>>", filename)
        file_path = "temp_files/service_req_files/" + filename

        with open(file_path, "rb") as file:
            response = HttpResponse(file,
                                    content_type="application/force-download")
            response[
                "Content-Disposition"] = "attachment; filename=%s" % filename
        return response


@csrf_exempt
def getcommentdetails(request):
    sr_id = request.GET.get("sr_id")
    response = servicerequest_util.get_commentdetails(sr_id)
    print(response)
    return HttpResponse(json.dumps(response['data']),
                        content_type="application/json")


@csrf_exempt
def createcomment(request):
    data = {
        'sr_id': request.POST['sr_id'],
        'comment': request.POST['comment'],
        'status': request.POST['status'],
        'acc_details': request.POST['acc_details'],
    }

    response = servicerequest_util.create_comment(data)
    return HttpResponse(response)


@csrf_exempt
def update_comment(request):
    response = servicerequest_util.update_comment(request)
    return HttpResponse(response)


@csrf_exempt
def delete_comment(request):
    response = servicerequest_util.delete_comment(request)
    return HttpResponse(response)
