$(document).ready(function() {
debugger;
var loc=window.location.pathname;
     a=loc.split("/")
     if(a[2]!=undefined && a[2]!=null && a[2]!=""){

     $.get('/get_user_detail_by_id',{'userid':a[2]}, function(data) {
        debugger;
        var response = data;
        obj=JSON.parse(response);
        $("#txtUserName").val(obj[0].UserName);
        $("#txtEmailId").val(obj[0].EmailId);
        $("#txtUserPassword").val(obj[0].Password);
        $("#txtUserKey").val(obj[0].UserKey);
       // $("#ddlUserAccessType").val(obj[0].AccessLevel);
    });
}
});

$("#btn_SubmitUserDetails").on("click", function(event){
if(!validateForm()) return false
if(!validateAccessLevel()) return false
save_User_Management_Object_Data();
});

function save_User_Management_Object_Data(){
    form_data = new FormData();
    form_data.data = {};

    var loc=window.location.pathname;
    a=loc.split("/")

    if(a[2]!=undefined && a[2]!=null && a[2]!=""){
        form_data.data.object_id=a[2];
    }
    else{
        form_data.data.object_id=0;
    }

    form_data.data.user_name = $("#txtUserName").val();
    form_data.data.user_email_Id = $("#txtEmailId").val();
    form_data.data.user_password = $("#txtUserPassword").val();
    form_data.data.IsActive = 1;
    //form_data.data.UserAccessType = $("#ddlUserAccessType").val();
    form_data.data.UserAccessType = "Public";
    form_data.data.userkey = $("#txtUserKey").val();
    $.ajax({
        type: 'POST',
        url: '/save_user_management_object_detail',
        dataType: 'json',
        data: {'req_data':JSON.stringify(form_data)},
        success: function (data, textStatus) {
            alert(data[0]["Message"]);
            window.location.href = '/users';
        },
        error: function(xhr, status, e) {
            alert(status, e);
        }
    });
}

$(".btn_objcount").on("click", function(event){
    var id=$(this).attr('id').replace("btn_objcount_","");
     $.get('/get_domain_object_list_userwise',{'userid':id}, function(data) {
        debugger;
        var response = data;
        obj=JSON.parse(response);
        var cnt=0;
        var tr_lst="";
        $("#modalbody").empty();
        for(var  j= 0; j< obj.length;j++){
        var domain_name = obj[j]["BusinessObjectName"];
        var access_level = obj[j]["AccessLevel"];
        tr_lst+='<tr>';
        tr_lst+='   <td>'+domain_name+'</td>';
        tr_lst+='   <td>'+access_level+'</td>';
        tr_lst+='</tr>';
        }
        $("#modalbody").append(tr_lst);
    });
});


$(".chk_active").on("change", function(event){
debugger;
var chkid=$(this).attr('id').replace("chk_","");
var chkstatus=$(this).val();
if(chkstatus==1)
    {status=0;}
else if(chkstatus==0)
    {status=1;}

sts_obj={}
sts_obj.userid = chkid;
sts_obj.userstatus = status;

$.ajax({
        type: 'POST',
        url: '/update_user_status',
        dataType: 'json',
        data: {'sts_obj':JSON.stringify(sts_obj)},
        success: function (data, textStatus) {
            alert(data[0]["Message"]);
            window.location.href = '/users';
        },
        error: function(xhr, status, e) {
            alert(status, e);
        }
    });

});

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("row");
  y = document.getElementsByClassName("form-control validate");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  return valid; // return the valid status
}

function validateAccessLevel() {
var x, valid = true;
x=$("#ddlUserAccessType").val();
    if(x=="")
    {
        alert("Please select access level");
        valid=false;
    }
    else
    {
        valid=true;
    }
return valid;
}

