import json
import os
from stat import S_ISDIR, S_ISREG

import paramiko
import requests
import datetime
import uuid
import boto3

from botocore.exceptions import ClientError
from websocket._core import create_connection

# instance_id = 'i-01c30dab40749dae2'
running_state_code = 16
stopped_state_code = 80
notebook_path = '/InvoiceNet_final.ipynb'


# aws_access_key_id = 'AKIA6BQ7EC7FVW7AJ742'
# aws_secret_access_key = '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'


def start_instance(aws_access_key_id, aws_secret_access_key, instance_id):
    ip = ''
    ec2 = boto3.client('ec2', region_name='ap-south-1', aws_access_key_id=aws_access_key_id,
                       aws_secret_access_key=aws_secret_access_key)
    try:
        response = ec2.start_instances(InstanceIds=[instance_id], DryRun=True)
        print(response)
    except ClientError as e:
        if 'DryRunOperation' not in str(e):
            raise
    try:
        response = ec2.start_instances(InstanceIds=[instance_id], DryRun=False)
        print(response)
        instance_status_code = 0
        while instance_status_code != running_state_code:
            response = ec2.describe_instances(InstanceIds=[instance_id])
            instance_status_code = response['Reservations'][0]['Instances'][0]['State']['Code']
            if instance_status_code == running_state_code:
                ip = response['Reservations'][0]['Instances'][0]['PublicIpAddress']
                break
    except ClientError as e:
        print(e)
    return ip


def copy_files_to_server(ip, pem_file):
    try:
        host = ip
        username = "ubuntu"
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(host, username=username, key_filename=pem_file)
        sftp = client.open_sftp()
        Train_Data_InRemoteArtifacts = sftp.listdir(path='code/invoice_net_final/Train_Data')
        for traindata_files in Train_Data_InRemoteArtifacts:
            print(traindata_files)
            sftp.remove('code/invoice_net_final/Train_Data/' + traindata_files)
        removeremotefolder_files(sftp, 'code/invoice_net_final/Prepare_Data')
        removeremotefolder_files(sftp, 'code/invoice_net_final/trained_model')
        removeremotefolder_files(sftp, 'code/invoice_net_final/models/invoicenet')
        list_pdf_json_files = os.listdir('deep_learning/pdf_json/')
        for file_pdf_json in list_pdf_json_files:
            sftp.put('deep_learning/pdf_json/' + file_pdf_json, 'code/invoice_net_final/Train_Data/' + file_pdf_json)
            print(file_pdf_json + " copied successfully")

        list_python_files = os.listdir('deep_learning/input_python/')
        for file_python in list_python_files:
            sftp.put('deep_learning/input_python/' + file_python, 'code/invoice_net_final/invoicenet/' + file_python)

        sftp.close()
        client.close()
    except Exception as e:
        print(e)


def start_executing_notebook(ip):
    try:
        publicIp_Port = ip + ":8888"
        conURL = "ws://" + publicIp_Port
        base = 'http://' + publicIp_Port + ''
        print(base)

        headers = {'Authorization': 'Token 24264bc374fbe3dffb09b9ae7557066ed7e9f5ab28fae80a'}
        url = base + '/api/kernels'
        print(url)
        flag = True
        while flag:
            try:
                response = requests.post(url, headers=headers)
                flag = False
            except Exception as e:
                print(e)
                flag = True
        print(response)
        kernel = json.loads(response.text)

        # Load the notebook and get the code of each cell
        url = base + '/api/contents' + notebook_path
        response = requests.get(url, headers=headers)
        file = json.loads(response.text)
        print(file)
        code = [c['source'] for c in file['content']['cells'] if len(c['source']) > 0]
        ws = create_connection(conURL + "/api/kernels/" + kernel["id"] + "/channels",
                               header=headers)

        def send_execute_request(code):
            msg_type = 'execute_request';
            content = {'code': code, 'silent': False}
            hdr = {'msg_id': uuid.uuid1().hex,
                   'username': 'test',
                   'session': uuid.uuid1().hex,
                   'data': datetime.datetime.now().isoformat(),
                   'msg_type': msg_type,
                   'version': '5.0'}
            msg = {'header': hdr, 'parent_header': hdr,
                   'metadata': {},
                   'content': content}
            print(msg)
            return msg

        for c in code:
            ws.send(json.dumps(send_execute_request(c)))

        # We ignore all the other messages, we just get the code execution output
        # (this needs to be improved for production to take into account errors, large cell output, images, etc.)
        for i in range(0, len(code)):
            msg_type = '';
            while msg_type != "stream":
                rsp = json.loads(ws.recv())
                msg_type = rsp["msg_type"]
            print(rsp["content"]["text"])

        ws.close()
    except ClientError as e:
        print(e)


def stop_server_instance(aws_access_key_id, aws_secret_access_key, instance_id):
    ec2 = boto3.client('ec2', region_name='ap-south-1', aws_access_key_id=aws_access_key_id,
                       aws_secret_access_key=aws_secret_access_key)
    try:
        ec2.stop_instances(InstanceIds=[instance_id, ], DryRun=True)
    except ClientError as e:
        if 'DryRunOperation' not in str(e):
            raise

    # Dry run succeeded, call stop_instances without dryrun
    try:
        response = ec2.stop_instances(InstanceIds=[instance_id], DryRun=False)
        print(response)
        response = ec2.describe_instances(InstanceIds=[instance_id])
        instance_status_code = 0
        while instance_status_code != stopped_state_code:
            response = ec2.describe_instances(InstanceIds=[instance_id])
            instance_status_code = response['Reservations'][0]['Instances'][0]['State']['Code']
            if instance_status_code == stopped_state_code:
                print("Instance Stopped")
                break
        return "Process Completed"
    except ClientError as e:
        print(e)
        return "Process failed"


def check_file_on_server(file_path, ip, pem_file):
    is_wait = True
    try:
        host = ip
        username = "ubuntu"
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(host, username=username, key_filename=pem_file)

        sftp = client.open_sftp()
        sftp.stat(file_path)
        print("Model File created On Server")
        is_wait = False
    except IOError:
        is_wait = True
        print("Model training is in progress..")
    return is_wait


def removeremotefolder_files(sftp, path):
    try:
        files = sftp.listdir(path=path)
        for f in files:
            filepath = path + "/" + f
            print(filepath)
            if isdir(sftp, filepath):
                removeremotefolder_files(sftp, filepath)
            else:
                sftp.remove(filepath)
        sftp.rmdir(path)
    except IOError as e:
        print(e)


def isdir(sftp, path):
    try:
        return S_ISDIR(sftp.stat(path).st_mode)
    except IOError:
        return False


def get_remote_folder(ip, remotedir, localdir, pem_file, preserve_mtime=False):
    host = ip
    username = "ubuntu"
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=username, key_filename=pem_file)
    sftp = client.open_sftp()

    for entry in sftp.listdir(remotedir):
        remotepath = remotedir + "/" + entry
        localpath = os.path.join(localdir, entry)
        mode = sftp.stat(remotepath).st_mode
        if S_ISDIR(mode):
            try:
                os.mkdir(localpath, mode=777)
            except OSError:
                pass
            get_remote_folder(ip, remotepath, localpath, pem_file, preserve_mtime)
        elif S_ISREG(mode):
            sftp.get(remotepath, localpath)
        print("{} downloaded successfully".format(entry))
