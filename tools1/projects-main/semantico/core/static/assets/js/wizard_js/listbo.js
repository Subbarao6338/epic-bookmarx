/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/

//'use strict';

/**
 * ARIA Listbox Examples
 * @function onload
 * @desc Initialize the listbox examples once the page has loaded
 */
/*
window.addEventListener('load', function () {
  var ex1 = document.getElementById('ex1');
  var ex1ImportantListbox = new aria.Listbox(document.getElementById('ms_bo_list'));
  var ex1UnimportantListbox = new aria.Listbox(document.getElementById('ms_field_list'));



});
*/

$(".fill_fields").on("click",function(event){
debugger;
$('.fill_fields').not(this).prop('checked', false);
var id = $(this).attr('id');
var detailid=id.replace("ss_option","");
$("#ms_field_list").empty();
var field_list ='';
//field_list = '<div class="row" style="background-color:grey;"><div class="col-3">Field Name</div><div class="col-2">Data Type</div><div class="col-2">Alias Name</div><div class="col-2">Access Level</div><div class="col-2">Mask/Encrypt</div><div class="col-1">Acc. Cont.</div></div>';

$.get('/get_businessobj_fields', {'object_id': detailid}, function(data) {

        var field_data =JSON.parse(data);
        for(var i=0; i<field_data.length;i++){
           field_name = field_data[i]["FieldName"];
           data_type=field_data[i]["DataType"];
            if(data_type=="S"){
            data_type="String";
            }
            else if(data_type=="N"){
            data_type="Numeric";
            }
           alias_name=field_data[i]["AliasName"];
           mask_value=field_data[i]["Mask"];
           if(mask_value==0){
             mask_encrypt_status="None";
           }else if(mask_value==1){
             mask_encrypt_status="Mask";
           }else if(mask_value==2){
             mask_encrypt_status="Encrypt";
           }

           access_level=field_data[i]["AccessLevel"];

           var access_controlled_sts="";
           access_controlled=field_data[i]["AccessControlled"];
           if(access_controlled==0){
             access_controlled_sts="False";
           }else if(access_controlled==1){
             access_controlled_sts="True";
           }
           /*field_list += '<div class="row"><div class="col-3">'+field_name+'</div><div class="col-2">'+data_type+'</div><div class="col-2">'+alias_name+'</div><div class="col-2">'+access_level+'</div><div class="col-2">'+mask_encrypt_status+'</div><div class="col-1">'+access_controlled_sts+'</div></div>';*/
           field_list +='<tr><td>'+field_name+'</td><td>'+data_type+'</td><td>'+alias_name+'</td><td>'+access_level+'</td><td>'+mask_encrypt_status+'</td><td>'+access_controlled_sts+'</td></tr>'
        }

        $("#ms_field_list").append(field_list);
    });

$("#ms_join_list").empty();
var join_list ='';
//join_list = '<div class="row" style="background-color:grey;"><div class="col-2">Table Name</div><div class="col-2">Join Type</div><div class="col-2">Join With</div><div class="col-2">Join on Field1</div><div class="col-2">Join on Field2</div><div class="col-2">Join Condition</div></div>';

$.get('/get_businessobj_joindetails', {'object_id': detailid}, function(data) {

        var join_data =JSON.parse(data);
        for(var i=0; i<join_data.length;i++){
           table1_name = join_data[i]["Table1Name"];
           table2_type=join_data[i]["Table2Name"];
           join_type=join_data[i]["JoinType"];
           table1_field=join_data[i]["Table1Field"];
           table2_field=join_data[i]["Table2Field"];
           join_condition=join_data[i]["Condition"];
           //join_list += '<div class="row"><div class="col-2">'+table1_name+'</div><div class="col-2">'+join_type+'</div><div class="col-2">'+table2_type+'</div><div class="col-2">'+table1_field+'</div><div class="col-2">'+table2_field+'</div><div class="col-2">'+join_condition+'</div></div>';
           join_list='<tr><td>'+table1_name+'</td><td>'+join_type+'</td><td>'+table2_type+'</td><td>'+table1_field+'</td><td>'+table2_field+'</td><td>'+join_condition+'</td></tr>'
        }

        $("#ms_join_list").append(join_list);
    });


$("#ms_where_list").empty();
var where_list ='';
//where_list = '<div class="row" style="background-color:grey;"><div class="col-3">Table Name</div><div class="col-3">Field Name</div><div class="col-3">Condition</div><div class="col-3">CompareVal</div></div>';

$.get('/get_businessobj_wheredetails', {'object_id': detailid}, function(data) {

        var where_data =JSON.parse(data);
        for(var i=0; i<where_data.length;i++){
           table_name = where_data[i]["TableName"];
           field_name=where_data[i]["FieldName"];
           condition=where_data[i]["Condition"];
           compareval=where_data[i]["CompareValue"];
           //where_list += '<div class="row"><div class="col-3">'+table_name+'</div><div class="col-3">'+field_name+'</div><div class="col-3">'+condition+'</div><div class="col-3">'+ compareval +'</div></div>';
           where_list += '<tr><td>'+table_name+'</td><td>'+field_name+'</td><td>'+condition+'</td><td>'+compareval+'</td></tr>';
        }

        $("#ms_where_list").append(where_list);
    });


// $("#ms_users_list").empty();
//var user_list ='';
//user_list = '<div class="row" style="background-color:grey;"><div class="col-4">User Name</div><div class="col-4">Email Id</div><div class="col-4">Access Level</div></div>';
//
//$.get('/get_users_on_domain_object', {'object_id': detailid}, function(data) {
//
//        var where_data =JSON.parse(data);
//        for(var i=0; i<where_data.length;i++){
//           user_name = where_data[i]["UserName"];
//           email_id=where_data[i]["EmailId"];
//           access_level=where_data[i]["AccessLevel"];
//           user_list += '<div class="row"><div class="col-4">'+user_name+'</div><div class="col-4">'+email_id+'</div><div class="col-4">'+access_level+'</div></div>';
//        }
//
//        $("#ms_users_list").append(user_list);
//    });



 });