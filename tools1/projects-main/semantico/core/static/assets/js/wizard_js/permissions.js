window.addEventListener('load', function () {
  var ex1ImportantListbox = new aria.Listbox(document.getElementById('ss_field_list'));
  var ex1ImportantListbox = new aria.Listbox(document.getElementById('ss_row_listR'));
});


function rowTab(){
  $('[href="#nav-row"]').tab('show');
}
function ColumnTab(){
  $('[href="#nav-col"]').tab('show');
}


$("#ddlDomainObj").on("change",function(event){

if($("#ddlCUserName")[0].selectedIndex<=0){
    alert("Please select User Name");
    $("#ddlDomainObj").prop('selectedIndex',0);
    return;
}


var id = $(this).val();
var domain_obj_id=id.replace("ss_opt","");
var userid=$("#ddlCUserName").val();
var field_list ='';
$("#ss_field_list").empty();

$.ajax({
            type: "GET",
            url: "/get_businessobj_fields",
            data: {'object_id': domain_obj_id},
            success: function (data) {
                   var field_data =JSON.parse(data);
                    var li_item = '';
                    for(var i=0; i<field_data.length;i++){
                       field_id=field_data[i]["FieldId"];
                       field_name = field_data[i]["FieldName"];
                       alias_name = field_data[i]["AliasName"];
                       accesslevel = field_data[i]["AccessLevel"];
                       li_item += '<div class="row"><div class="col-5"><li class="selfield" id="ms_opt'+field_id+'" role="option" aria-selected="false" acc_level="'+accesslevel+'">'+alias_name+'</li></div><div class="col-4">'+accesslevel+'</div></div>';

                    }
                    $("#ss_field_list").append(li_item);
            }
        }).done(function (done) {
             get_col_permision_details(userid, domain_obj_id);
             get_user_object_access_level(userid, domain_obj_id);
        });
});

function get_col_permision_details(userid, detailid){
    $.get('/get_col_permision_details', {'userid': userid, 'detailid': detailid}, function(data) {
     debugger;
            var data=JSON.parse(data);
            var fields=[];

            //if(data.length > 0){
                for(var i=0;i<data.length;i++){
                    fields.push(data[i].FieldId);
                }

                $('#ss_field_list li').each(function(){
                    fieldid = $(this).attr('id').replace("ms_opt","");
                    acc_level= $(this).attr('acc_level');

                    debugger;
                    var index = fields.indexOf(parseInt(fieldid));

                    if(index != -1 || acc_level=="Public"){
                        $(this).attr("aria-selected","true");
                    }
                    else{
                        $(this).attr("aria-selected","false");
                    }

                    if(acc_level=="Public"){
                    $(this).addClass("disablecheck");
                    }
                    else{
                    $(this).removeClass("disablecheck");
                    }

                })
            //}
    });

}

function get_user_object_access_level(userid, detailid){
    $.get('/get_object_permision_details', {'userid': userid, 'detailid': detailid}, function(data) {
     debugger;
            var data=JSON.parse(data);
            if(data.length > 0){
                $("#txtAccessLevel").val(data[0].AccessLevel);
            }
            else{
                $("#txtAccessLevel").val("Public");
            }
    });
}


$("#btn_col_perm").on("click",function(event){
    var field_list=[];
    debugger;
    $('#ss_field_list li').each(function(){
      var chkfield={};
      chkfield.fieldid=$(this).attr('id').replace("ms_opt","");
      chkfield.fieldname ='['+ $(this).text().trim()+']';
      chkfield.status = $(this).attr("aria-selected");

      field_list.push(chkfield);
    })

    var userid=$("#ddlCUserName").val();
    var domain_obj_name= $("#ddlDomainObj option:selected").text();

    form_data = new FormData();
    form_data.data = {};

    form_data.data.UserId = userid;
    form_data.data.FieldList=[];
    form_data.data.FieldList=field_list;

    $.ajax({
            type: 'POST',
            url: '/execute_col_sec',
            dataType: 'json',
            data: {'req_data':JSON.stringify(form_data)},
            success: function (data, textStatus) {
                alert(data[0]["Result"]);
                window.location.href = "/access_permissions";
            },
            error: function(xhr, status, e) {
                alert(status, e);
            }
    });
});

$("#ddlDomainObjR").on("change",function(event){

    if($("#ddlRUserName")[0].selectedIndex<=0){
    alert("Please select User Name");
    $("#ddlDomainObjR").prop('selectedIndex',0);
    return;
    }

    var id = $(this).val();
    var domain_obj_id=id.replace("ss_opt","");
    var option_list ='';
    $('#ss_row_listR').empty();
    $('#ddlFieldR').empty();

    $.get('/get_businessobj_fields', {'object_id': domain_obj_id}, function(data) {
            var field_data =JSON.parse(data);
            var li_item = '';
            option_list='<option>-Select-</option>';
            for(var i=0; i<field_data.length;i++){
               field_id=field_data[i]["FieldId"];
               field_name = field_data[i]["FieldName"];
               alias_name = field_data[i]["AliasName"];
               table_name=field_data[i]["TableName"];
               access_controlled = field_data[i]["AccessControlled"];
               providername=field_data[i]["ProviderName"];
               if(access_controlled == 1){
                option_list += '<option value="opt'+ field_id + '" table-name="'+table_name+'" field-name="'+field_name+'" provider-name="'+providername+'"  domain_object_id="'+ domain_obj_id +'">' + alias_name + '</option>';
               }
            }
           $('#ddlFieldR').append(option_list);
        });
    });


$("#ddlFieldR").on("change",function(event){
    debugger;
    var userid = $("#ddlRUserName").val().replace("ss_opt","");
    var domain_obj_name= $("#ddlDomainObjR option:selected").text();
    var alias_name=$("#ddlFieldR option:selected").text();
    var field_id=$(this).val().replace("opt","");
    var tb_name = $("#ddlFieldR option:selected").attr("table-name");
    var field_name = $("#ddlFieldR option:selected").attr("field-name");
    var providername= $("#ddlFieldR option:selected").attr("provider-name");
    var domain_object_id = $("#ddlFieldR option:selected").attr("domain_object_id");
    $('#ss_row_listR').empty();
    $.ajax({
            type: "GET",
            url: "/get_field_values",
            data: {'tb_name':tb_name,'field_name':field_name,'provider_name':providername,'domain_object_id':domain_object_id},
            success: function (data) {
                 var li_item = '';
                 for(var i=0; i<data.length;i++){
                 item = data[i];
                 li_item += '<li class="selfieldval" role="option" aria-selected="false">'+item+'</li>';
                 }
                 $("#ss_row_listR").append(li_item);
            }
            }).done(function (done) {
                 get_row_permision_details(userid, field_id);
            });
});


function get_row_permision_details(userid,field_id){
    $.get('/get_row_permision_details', {'userid':userid,'field_id':field_id}, function(data) {
    debugger;
        var data=JSON.parse(data);
        var fields=[];
        if(data.length > 0){
            for(var i=0;i<data.length;i++){
                fields.push(data[i].FieldValue.toString());
            }
            $('#ss_row_listR li').each(function(){
                fieldvalue = $(this).text().trim();
                debugger;
                var index = fields.indexOf(fieldvalue);
                if(index != -1){
                    $(this).attr("aria-selected","true");
                }
                else{
                    $(this).attr("aria-selected","false");
                }
            });
        }
    });
}

$("#btn_row_perm").on("click",function(event){
    debugger;
    var filter_value=[];
    var userid = $("#ddlRUserName").val().replace("ss_opt","");
    var domain_obj_name = $("#ddlDomainObjR option:selected").text();
    var field_name = $("#ddlFieldR option:selected").text();
    var field_id = $("#ddlFieldR").val().replace("opt","");

    $('#ss_row_listR li').each(function(){
      var chkfield={};
      chkfield.fieldvalue =$(this).text().trim();
      chkfield.status = $(this).attr("aria-selected");
      filter_value.push(chkfield);
    });

    form_data = new FormData();
    form_data.data = {};

    form_data.data.UserId = userid;
    form_data.data.FieldId = field_id;
    form_data.data.FieldValues=[];
    form_data.data.FieldValues=filter_value;

    $.ajax({
            type: 'POST',
            url: '/execute_row_sec',
            dataType: 'json',
            data: {'req_data':JSON.stringify(form_data)},
            success: function (data) {
                 alert(data[0]["Result"]);
                 location.reload(true);
            },
            error: function(xhr, status, e) {
                alert(status, e);
            }
        });
});

$("#ddlRUserName").on("change",function(event){
    $("#ddlDomainObjR").prop('selectedIndex',0);
    $("#ddlFieldR").prop('selectedIndex',0);
    $('#ss_row_listR').empty();
});

$("#ddlCUserName").on("change",function(event){
    $("#ddlDomainObj").prop('selectedIndex',0);
    $("#txtAccessLevel").val("");
    $('#ss_field_list').empty();
});



