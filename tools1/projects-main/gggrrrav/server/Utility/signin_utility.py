from random import weibullvariate
from Utility import postgres_conn as postgres_connection
import datetime
import json
import hashlib

def checkUserAuthorized(request):
    AccountMail = request.GET['AccountMail']
    query='''SELECT Users.user_id, user_name,role_name,user_mail, user_profile FROM public."Users" as Users
    INNER JOIN public."Role" as Role ON Users.role_id=Role.role_id where
                Users.user_mail = %s '''
    ret = postgres_connection.execute_get_query(query,[AccountMail])
    return ret


def checkUserAuthorized1(request):
    AccountMail = request.GET['username']
    Password = request.GET['password']
    hashed_pass = str(hashlib.md5(Password.encode()).hexdigest())
    query=f"""SELECT Users.user_id, user_name,role_name,user_mail, user_profile,password FROM public."Users" as Users
    INNER JOIN public."Role" as Role ON Users.role_id=Role.role_id where
                Users.user_name ='{AccountMail}' AND Users.password='{hashed_pass}'"""
    ret = postgres_connection.execute_get_query(query,'')
    return ret

def updatepassword(request):
    req_body = request.body.decode('utf-8')
    json_req = json.loads(req_body)
    print(json_req)
    try:
        req_body = request.body.decode('utf-8')
        json_req = json.loads(req_body)
        oldpass = json_req['params']['old_password']
        newpass = json_req['params']['new_password']  
        mail = json_req['params']['user_mail']
        oldpassword=str(hashlib.md5(oldpass.encode()).hexdigest())
        newpassword=str(hashlib.md5(newpass.encode()).hexdigest())
        query1 = """select password from public."Users" where user_mail='""" + str(mail) +"""'""";
        ret1 = postgres_connection.execute_get_query(query1,'')
        if ret1['data'][0]['password'] == oldpassword:
            query2 = """UPDATE public."Users" SET password = '{0}' where user_mail = '{1}'""".format(
                newpassword, mail)
            ret2 = postgres_connection.execute_update_query(query2)
            if ret2 == "Success":
                return {"msg":"Password Updated Successfully" , "status":"Success"}
            else:
                return {"msg":"Failed to update password" , "status":"Failed"}
        else:
            return {"msg":"Current Password is incorrect", "status":"Failed"}
    
    except Exception as e:
        print(e)
        return {"msg": "Failed to update password", "status":"Failed"}
    
    