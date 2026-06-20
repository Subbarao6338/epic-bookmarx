var currentTab = 0; // Current tab is set to be the first tab (0)
var navigatedTab = []; // It holds the value of tab index which is already navigated
var table_field_data = []; // It holds the objects
var join_details = []; // It contains the join_details
var where_details = []; // It contains the where clause details
var reload = false;
var left_table_fields = [];
var right_table_val = "";
var sel_dbname="";

showTab(currentTab); // Display the current tab

function showTab(n) {
    debugger;
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  //var x= $(".tab:not(.skip)");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
debugger;
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  //var x= $(".tab:not(.skip)");
  if (currentTab > x.length-2 && n == 1) {
    if(!validateObjectFiledForm()) return false
    get_business_object_data_by_name();
    return false;
  }
  // Exit the function if any field in the current tab is invalid:
  if(!reload){
    if ((n == 1 && !validateForm())) return false;
  }
  // Hide the current tab:
  // if(sel_dbname=="DynamoDB" && currentTab==5){
   //x[currentTab].style.display = "none";
   //currentTab = currentTab-2;

   //}
   //else{
   x[currentTab].style.display = "none";
   //}

  if(currentTab==0 && navigatedTab.indexOf(currentTab)==-1 && n == 1){
  debugger;
    reload = false;
    navigatedTab.push(currentTab);
    hostName = $("#txtHost").val();
    port = $("#txtPort").val();
    username = $("#txtUserName").val();
    storage_name = $("#txtstorageName").val();
    access_key = $("#txtAccessKey").val();
    $.get('/get_database_list', {'host':hostName, 'port':port, 'user_name':username, 'storage_name':storage_name,
        'access_key':access_key}, function(data) {
            var databaseList = data;
            $('#ddlDatabase option').remove();
            $('#ddlDatabase').append('<option value="" selected>--Select--</option>');
            var option = '';
            for (var i=0;i<databaseList.length;i++){
                option += '<option value="'+ String(databaseList[i]).trim() + '">' + String(databaseList[i]).trim() + '</option>';
            }
            $('#ddlDatabase').append(option);
    });
  }

  $('#ddlDatabase').on("change",function(event){
  debugger;
    cnt_tab = 0;
    navigatedTab = [];
    navigatedTab.push(cnt_tab);
  })

  if(currentTab==1 && navigatedTab.indexOf(currentTab)==-1 && n == 1){
  debugger;
    navigatedTab.push(currentTab);
    $('#ms_table_list').empty();
    $('#ms_selected_table_list').empty();
    db_name = $('#ddlDatabase').val()
    $.get('/get_table_list', {'host':hostName, 'port':port, 'user_name':username, 'db_name':db_name}, function(data) {
    debugger;
        var table_list = data;
        var li_item = '';
        for (var i=0;i<table_list.length;i++){
            li_item += '<li id="ms_opt"'+i+' role="option" aria-selected="false">'+table_list[i]+'</li>';
        }
        $('#ms_table_list').append(li_item);
    });
  }

  if(currentTab==2 && navigatedTab.indexOf(currentTab)==-1 && n == 1){
  debugger;
    navigatedTab.push(currentTab);
    var sel_tables = []
    $("#ms_selected_table_list li").each(function(item){
    debugger;
        sel_tables.push($(this).text());
    });
    $("#ss_tbl_list").empty();
    $("#ms_fields_list").empty();
    $.get('/get_tables_fields_list', {'host':hostName, 'port':port, 'user_name':username, 'db_name':db_name, 'sel_tables':JSON.stringify(sel_tables),
        "storage_name":storage_name, "access_key":access_key}, function(data) {
        table_field_data = data["data"];
        var table_list_ui = '';
        for(var i=0; i<table_field_data.length;i++){
            table_name = table_field_data[i]["TableName"];
            table_alias_name = table_field_data[i]["AliasName"];
            table_list_ui += '<div class="row"><div class="col-6"><li class="populate_fields" id="ss_opt'+i+'" role="option">'+table_name+'</li></div><div class="col-6"><input type="text" class="form-control fill_alias_name" id="txtTable'+i+'" placeholder="Enter Alias Name" custom-attr="'+table_name+'"></div></div>';
        }
        $("#ss_tbl_list").append(table_list_ui);
        $(".fill_alias_name").on("change", function(event){
            tb_alias_name = $(this).val();
            tb_name = $(this).attr("custom-attr");
            table_field_data.find(x=>x.TableName == tb_name)["AliasName"] = tb_alias_name;
        });
      /*  $(".table_access_label").on("change",function(event){
            tb_access = $(this).val();
            tb_name = $(this).attr("custom-attr");
            table_field_data.find(x=>x.TableName == tb_name)["AccessLevel"] = tb_access;
        });*/
        $(".populate_fields").on("click",function(event){
            $("#ms_fields_list").empty();
            table_name = $(this).text();
            table_based_fields_data = table_field_data.find(x=>x.TableName == table_name)["Fields"];
            field_list_ui = '';
            is_binding_done = false;
            for(var i=0;i<table_based_fields_data.length;i++){
                field_name = table_based_fields_data[i]["FieldName"];
                field_type = table_based_fields_data[i]["DataType"];
                is_selected = table_based_fields_data[i]["IsSelected"];
                f_alias_name = table_based_fields_data[i]["AliasName"];
                f_mask =  table_based_fields_data[i]["Mask"];

                isenabled=''

                field_type_lo = field_type.toLowerCase();
                if(field_type_lo == 'n' || field_type_lo.includes("bool") || field_type_lo.includes("int") || field_type_lo == "decimal" || field_type_lo == "float" || field_type_lo == "double" || field_type_lo.includes("date") || field_type_lo =="numeric"){
                isenabled="disabled"
                }
                else{
                isenabled=""
                }

                ismsel='';
                if(f_mask=="0"){
                ismsel="selected";
                }
                ismsel1='';
                if(f_mask=="1"){
                ismsel1="selected";
                }
                ismsel2='';
                if(f_mask=="2"){
                ismsel2="selected";
                }


                f_accesslevel=table_based_fields_data[i]["AccessLevel"];

                issel='';
                if(f_accesslevel=="Public"){
                issel="selected";
                }
                issel1='';
                if(f_accesslevel=="Private"){
                issel1="selected";
                }
                issel2='';
                if(f_accesslevel=="Protected"){
                issel2="selected";
                }

                f_accesscontrolled =  table_based_fields_data[i]["AccessControlled"];
                checked = '';
                if(f_accesscontrolled != ""){
                    checked = 'checked';
                }

//              field_list_ui+='<div class="row"><div class="col-3"><li class="select_deselect_fields" id="ss_unimp_list'+i+'" role="option" aria-selected='+is_selected+'>'+field_name+'</li></div><div class="col-3"><li id="ss_unimp_list_type'+i+'" role="option">'+field_type+'</li></div><div class="col-3"><input type="text" class="form-control fill_falias_name" id="txtfield'+i+'" placeholder="Enter Alias Name" value = "'+f_alias_name+'" custom-attr="'+field_name+'"></div><div class="col-3"><input type="text" maxlength="10" class="form-control fill_fmask_name" id="txtfieldmask'+i+'" placeholder="Enter Mask" value="'+f_mask+'" custom-attr="'+field_name+'"></div></div>';
//                field_list_ui+='<div class="row"><div class="col-3"><li class="select_deselect_fields" id="ss_unimp_list'+i+'" role="option" aria-selected='+is_selected+'>'+field_name+'</li></div><div class="col-3"><li id="ss_unimp_list_type'+i+'" role="option">'+field_type+'</li></div><div class="col-3"><input type="text" class="form-control fill_falias_name" id="txtfield'+i+'" placeholder="Enter Alias Name" value = "'+f_alias_name+'" custom-attr="'+field_name+'"></div><div class="wrapper_btn col-1"  style="margin-top:0px;"><input type="checkbox" class="form-check-input" id="txtfieldmask'+i+'" custom-attr="'+field_name+'" '+checked+'></div><div class="col-2"><select class="form-control select2 table_access_label" id="ddlTableAccess'+i+'" custom-attr="'+field_name+'"><option value="">--Select--</option><option value="Public" '+issel+'>Public</option><option value="Private" '+issel1+'>Private</option><option value="Protected" '+issel2+'>Protected</option></select></div></div>';
                field_list_ui+='<div class="row"><div style="width:28%"><li class="select_deselect_fields" id="ss_unimp_list'+i+'" role="option" aria-selected='+is_selected+'>'+field_name+'</li></div><div style="width:15%"><li id="ss_unimp_list_type'+i+'" role="option">'+field_type+'</li></div><div style="width:20%"><input type="text" class="form-control fill_falias_name" id="txtfield'+i+'" placeholder="Enter Alias Name" value = "'+f_alias_name+'" custom-attr="'+field_name+'"></div><div style="width:15%"><select class="form-control select2 table_access_label" id="ddlTableAccess'+i+'" custom-attr="'+field_name+'"><option value="Public" '+issel+'>Public</option><option value="Private" '+issel1+'>Private</option><option value="Protected" '+issel2+'>Protected</option></select></div><div class="wrapper_btn"  style="margin-top:0px;width:7%"><input type="checkbox" class="chk_acc_controlled" id="chk_accesscontrolled'+i+'" custom-attr="'+field_name+'" '+checked+'></div><div style="width:15%"><select class="form-control select2 table_mask_encrypt" id="ddl_MaskEncrypt'+i+'" custom-attr="'+field_name+'" '+isenabled+'><option value="0" '+ismsel+'>None</option><option value="1" '+ismsel1+'>Mask</option><option value="2" '+ismsel2+'>Encrypt</option></select></div></div>';
            }
            $("#ms_fields_list").append(field_list_ui);
            $(".fill_falias_name").on("change",function(event){

                var field_alias = $(this).val();
                var f_name = $(this).attr("custom-attr");
                //if(field_alias == ""){
                //field_alias = f_name;
                //}
                table_based_fields_data.find(x=>x.FieldName == f_name)["AliasName"] = field_alias;
            });
//            $(".fill_fmask_name").on("change",function(event){
//                var field_mask = $(this).val();
//                var f_name = $(this).attr("custom-attr");
//                table_based_fields_data.find(x=>x.FieldName == f_name)["Mask"] = field_mask;
//            });
            $(".chk_acc_controlled").on("click", function(event){

                 if($(this). prop("checked") == true){
                    var f_name = $(this).attr("custom-attr");
                    //table_based_fields_data.find(x=>x.FieldName == f_name)["Mask"] = "True";
                    table_based_fields_data.find(x=>x.FieldName == f_name)["AccessControlled"] = "True";
                 } else if($(this). prop("checked") == false){
                    var f_name = $(this).attr("custom-attr");
                    //table_based_fields_data.find(x=>x.FieldName == f_name)["Mask"] = "";
                    table_based_fields_data.find(x=>x.FieldName == f_name)["AccessControlled"] = "";
                 }
            });
            $(".select_deselect_fields").on("click",function(event){
                var field = $(this).text();
                table_based_fields_data.find(x=>x.FieldName == field)["AccessLevel"] = "Public";
                table_based_fields_data.find(x=>x.FieldName == field)["Mask"] = "0";
                var chk_selection = $(this).attr("aria-selected");
                if(chk_selection == "false"){
                    table_based_fields_data.find(x=>x.FieldName == field)["IsSelected"] = true;
                }else{
                    table_based_fields_data.find(x=>x.FieldName == field)["IsSelected"] = false;
                }
            });

            $(".table_access_label").on("change",function(event){
                tb_access = $(this).val();
                tb_name = $(this).attr("custom-attr");
                var f_name = $(this).attr("custom-attr");
                table_based_fields_data.find(x=>x.FieldName == f_name)["AccessLevel"] = tb_access;
            });

              $(".table_mask_encrypt").on("change",function(event){
                tb_maskencrypt_value = $(this).val();
                tb_name = $(this).attr("custom-attr");
                var f_name = $(this).attr("custom-attr");
                table_based_fields_data.find(x=>x.FieldName == f_name)["Mask"] = tb_maskencrypt_value;
            });

        });
    });


  }

  if(currentTab==3 && navigatedTab.indexOf(currentTab)==-1 && n == 1){
  debugger;
    navigatedTab.push(currentTab);
    join_details = [];
    $("#tbl_join_body tr").remove();
    $(".tbl_join").css("display", "none");
    $('#ddlTable1 option').remove();
    $('#ddlTable2 option').remove();
    $('#ddlTable1').append('<option value="" selected>--Select--</option>');
    $('#ddlTable2').append('<option value="" selected>--Select--</option>');
    var option_list = '';
    for(var i=0;i<table_field_data.length;i++){
        tab_name = table_field_data[i]["TableName"];
        tab_alias = table_field_data[i]["AliasName"];
        option_list += '<option value="'+ tab_name + '">' + tab_name+'['+tab_alias+']' + '</option>';
    }
    $('#ddlTable1').append(option_list);
    $('#ddlTable2').append(option_list);

    $("#ddlTable1").on("change", function(event){
        var tb1_val = $("#ddlTable1").val();
        if(tb1_val != ""){
             var fld_lst = table_field_data.find(x=>x.TableName==tb1_val)["Fields"];
             $("#ddlField1 option").remove();
             $("#ddlField1").append('<option value="" selected="selected">--select--</option>');
             var option_list = '';
             for(var i = 0; i<fld_lst.length;i++){
                if(fld_lst[i]["IsSelected"] == true){
                    var fld_name = fld_lst[i]["FieldName"];
                    var fld_alias = fld_lst[i]["AliasName"];
                    option_list += '<option value="'+ fld_name + '">' + fld_name+'['+fld_alias+']' + '</option>';
                }
             }
             $("#ddlField1").append(option_list);
        }
        if(table_field_data.length == 2){
            var right_table = table_field_data.find(x=>x.TableName!=tb1_val)["TableName"];
            $("#ddlTable2").val(right_table);
            $("#ddlTable2").trigger("change");
        }
    });

    $("#ddlTable2").on("change", function(event){
        var tb2_val = $("#ddlTable2").val();
        if(tb2_val != ""){
             var fld_lst = table_field_data.find(x=>x.TableName==tb2_val)["Fields"];
             $("#ddlField2 option").remove();
             $("#ddlField2").append('<option value="" selected="selected">--select--</option>');
             var option_list = '';
             for(var i = 0; i<fld_lst.length;i++){
                if(fld_lst[i]["IsSelected"] == true){
                    var fld_name = fld_lst[i]["FieldName"];
                    var fld_alias = fld_lst[i]["AliasName"];
                    option_list += '<option value="'+ fld_name + '">' + fld_name+'['+fld_alias+']' + '</option>';
                }
             }
             $("#ddlField2").append(option_list);
        }
    });

    $("#ddlField1").on("change",function(){
        var selected_field = $(this).val();
        $('#ddlField2 option').each(function(){
            if (this.value == selected_field){
                $('#ddlField2').val(selected_field);
            }
        });
    });

  }

  if(currentTab==4 && navigatedTab.indexOf(currentTab)==-1 && n == 1){
  Reload_Where(4);
  console.log(table_field_data)
  debugger;
    navigatedTab.push(currentTab);
    where_details = [];
    $("#tbl_where_body tr").remove();
    $(".tbl_where").css("display", "none");
    $('#ddlWhereTable option').remove();
    $('#ddlWhereTable').append('<option value="" selected>--Select--</option>');
    var option_list = '';
    for(var i=0;i<table_field_data.length;i++){
        tab_name = table_field_data[i]["TableName"];
        tab_alias = table_field_data[i]["AliasName"];
        option_list += '<option value="'+ tab_name + '">' + tab_name+'['+tab_alias+']' + '</option>';
    }
    $('#ddlWhereTable').append(option_list);

    $("#ddlWhereTable").on("change", function(event){
        var tb1_val = $("#ddlWhereTable").val();
        if(tb1_val != ""){
         var fld_lst = table_field_data.find(x=>x.TableName==tb1_val)["Fields"];
         $("#ddlWhereColumn option").remove();
         $("#ddlWhereColumn").append('<option value="" selected="selected">--select--</option>');
         var option_list = '';
         for(var i = 0; i<fld_lst.length;i++){
            if(fld_lst[i]["IsSelected"] == true){
                var fld_name = fld_lst[i]["FieldName"];
                var fld_alias = fld_lst[i]["AliasName"];
                option_list += '<option value="'+ fld_name + '">' + fld_name+'['+fld_alias+']' + '</option>';
            }
         }
         $("#ddlWhereColumn").append(option_list);
        }
    });
  }

  if(currentTab==5 && navigatedTab.indexOf(currentTab)==-1 && n == 1){
    debugger;
    navigatedTab.push(currentTab);
    var sdb_name=$('#ddlDatabase').val();
    $("#txtSDatabaseName").val(sdb_name);

    var tr_lst = "";
    for(var i=0;i<table_field_data.length;i++){
     var stab_name = table_field_data[i]["TableName"];
     var stab_alias = table_field_data[i]["AliasName"];
        tr_lst+='<tr>';
        tr_lst+='   <th scope="row">'+(i+1)+'</th>';
        tr_lst+='   <td>'+stab_name+'</td>';
        tr_lst+='   <td>'+stab_alias+'</td>';
        tr_lst+='</tr>';
    }
    $("#stbl_details").append(tr_lst);

    var tr_lst = "";
    var cnt=0
    for(var i=0;i<table_field_data.length;i++){
    debugger;
            tbl_val=table_field_data[i]["TableName"];
            var sfld_lst = table_field_data[i]["Fields"];
            debugger;
            for(var  j= 0; j< sfld_lst.length;j++){
                        if(sfld_lst[j]["IsSelected"] == true){
                        var fld_name = sfld_lst[j]["FieldName"];
                        var fld_alias = sfld_lst[j]["AliasName"];
                        var fld_datatype = sfld_lst[j]["DataType"];
                        var fld_mask_val=sfld_lst[j]["Mask"];
                        var fld_mask_text="";
                        if(fld_mask_val=="0"){fld_mask_text="None" ;} else if(fld_mask_val=="1"){fld_mask_text="Mask" ;} else if(fld_mask_val=="2"){fld_mask_text="Encrypt" ;}
                        var fld_accesslevel= sfld_lst[j]["AccessLevel"];
                        var fld_accesscontrolled= sfld_lst[j]["AccessControlled"];
                        tr_lst+='<tr>';
                        tr_lst+='   <th scope="row">'+(cnt+1)+'</th>';
                        tr_lst+='   <td>'+tbl_val+'</td>';
                        tr_lst+='   <td>'+fld_name+'</td>';
                        tr_lst+='   <td>'+fld_datatype+'</td>';
                        tr_lst+='   <td>'+fld_alias+'</td>';
                        tr_lst+='   <td>'+fld_accesslevel+'</td>';
                        tr_lst+='   <td>'+fld_accesscontrolled+'</td>';
                        tr_lst+='   <td>'+fld_mask_text+'</td>';
                        tr_lst+='</tr>';

                        cnt=cnt+1;
                        }

                     }

        }
         $("#sfld_details").append(tr_lst);

        var tr_lst = "";
        for(var i=0;i<join_details.length;i++){
            var Table1Name =  join_details[i]["Table1Name"];
            var Table2Name = join_details[i]["Table2Name"];
            var JoinType =  join_details[i]["JoinType"];
            var Table1Field =  join_details[i]["Table1Field"];
            var Table2Field =  join_details[i]["Table2Field"];
            var Condition =  join_details[i]["Condition"];

        tr_lst+='<tr>';
        tr_lst+='   <th scope="row">'+(i+1)+'</th>';
        tr_lst+='   <td>'+Table1Name+'</td>';
        tr_lst+='   <td>'+JoinType+'</td>';
        tr_lst+='   <td>'+Table2Name+'</td>';
        tr_lst+='   <td>'+Table1Field+'</td>';
        tr_lst+='   <td>'+Table2Field+'</td>';
        tr_lst+='   <td>'+Condition+'</td>';
        tr_lst+='</tr>';
        }
         $("#sjoin_dtl").append(tr_lst);

        var tr_lst = "";
        for(var i=0;i<where_details.length;i++){
        var TableName = where_details[i]["TableName"];
        var FieldName = where_details[i]["FieldName"];
        var Condition = where_details[i]["Condition"];
        var CompareValue = where_details[i]["CompareValue"];

        tr_lst+='<tr>';
        tr_lst+='   <th scope="row">'+(i+1)+'</th>';
        tr_lst+='   <td>'+TableName+'</td>';
        tr_lst+='   <td>'+FieldName+'</td>';
        tr_lst+='   <td>'+Condition+'</td>';
        tr_lst+='   <td>'+CompareValue+'</td>';
        tr_lst+='</tr>';
        }
        $("#swhere_dtl").append(tr_lst);
  }

  // Increase or decrease the current tab by 1:

  //if(sel_dbname=="DynamoDB" && currentTab==3){
  //currentTab = currentTab + 2;
  //}else{
  currentTab = currentTab + n;
  //}

  // if you have reached the end of the form...
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function Reload(tabNo){
    navigatedTab = jQuery.grep(navigatedTab, function(value) {
        return value != tabNo;
    });
    reload = true;
    currentTab = tabNo;
    nextPrev(1);
}

function Reload_Where(tabNo){
    navigatedTab = jQuery.grep(navigatedTab, function(value) {
        return value != tabNo;
    });
    reload = true;
    currentTab = tabNo;
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y,z, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByClassName("validate");
  z= x[currentTab].getElementsByClassName("validate_ddl");
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
  for (i = 0; i < z.length; i++) {
    // If a field is empty...
    if ($(z[i]).val() == "") {
      // add an "invalid" class to the field:
      $(z[i]).className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
debugger;
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}

function add_join_details(){
    right_table_val = $("#ddlTable2").val();
    join_obj = {};
    join_obj.JoinId = 0;
    join_obj.DetailId = 0;
    join_obj.Table1Name = $("#ddlTable1").val();
    join_obj.Table2Name = $("#ddlTable2").val();
    join_obj.JoinType = $("#ddlJoin").val();
    join_obj.Table1Field = $("#ddlField1").val();
    join_obj.Table2Field = $("#ddlField2").val();
    join_obj.Condition = $("#ddlJoinCondition").val();
    join_details.push(join_obj);
    var tr_lst = "";
    tr_lst+='<tr>';
    tr_lst+='   <td>'+join_obj.Table1Name+'</td>';
    tr_lst+='   <td>'+join_obj.JoinType+'</td>';
    tr_lst+='   <td>'+join_obj.Table2Name+'</td>';
    tr_lst+='   <td>'+join_obj.Table1Field+'</td>';
    tr_lst+='   <td>'+join_obj.Table2Field+'</td>';
    tr_lst+='   <td>'+join_obj.Condition+'</td>';
    tr_lst+='</tr>';
    $("#tbl_join_body").append(tr_lst);
    $(".tbl_join").css("display", "block");
    clear_join_fields();
    $("#ddlTable1").val(right_table_val);
    $("#ddlTable1").trigger("change");
}

function add_where_details(){
    where_obj = {};
    where_obj.ClauseId = 0;
    where_obj.TableName = $("#ddlWhereTable").val();
    where_obj.FieldName = $("#ddlWhereColumn").val();
    where_obj.Condition = $("#ddlWhereCondition").val();
    where_obj.CompareValue = $("#txtWhereValue").val();
    where_details.push(where_obj);
    var tr_lst = "";
    tr_lst+='<tr>';
    tr_lst+='   <td>'+where_obj.TableName+'</td>';
    tr_lst+='   <td>'+where_obj.FieldName+'</td>';
    tr_lst+='   <td>'+where_obj.Condition+'</td>';
    tr_lst+='   <td>'+where_obj.CompareValue+'</td>';
    tr_lst+='</tr>';
    $("#tbl_where_body").append(tr_lst);
    $(".tbl_where").css("display", "block");
    clear_where_fields();
}

function clear_where_fields(){
    $("#ddlWhereTable").val("");
    $("#ddlWhereColumn option").remove();
    $("#ddlWhereCondition").val("");
    $("#txtWhereValue").val("");
}

function clear_join_fields(){
    $("#ddlTable1").val("");
    $("#ddlTable2").val("");
    $("#ddlJoin").val("Inner Join");
    $("#ddlField1 option").remove();
    $("#ddlField1").append('<option value="" selected="selected">--select--</option>');
    $("#ddlField2 option").remove();
    $("#ddlField2").append('<option value="" selected="selected">--select--</option>');
    $("#ddlJoinCondition").val("=");
}

function save_Business_Object_Data(){

   form_data = new FormData();
    form_data.data = {};
    form_data.data.ObjectId = 0;
    form_data.data.ObjectName = $("#txtBusinessObjectName").val();
    form_data.data.DatabaseName = $("#ddlDatabase").val();
    form_data.data.AccessLevel = $("#ddlUserAccessLevel").val();
    form_data.data.HostName = $("#txtHost").val();
    form_data.data.Port = $("#txtPort").val();
    form_data.data.UserName = $("#txtUserName").val();
    form_data.data.ProviderName = $("#ddlDB").val();
    form_data.data.StorageName = $("#txtstorageName").val();
    form_data.data.StorageAccessKey = $("#txtAccessKey").val();
    form_data.data.Tables = [];
    for(var i=0;i<table_field_data.length;i++){
        tab_obj = {};
        tab_obj.TableId = 0;
        tab_obj.ObjectId = 0;
        tab_obj.TableName = table_field_data[i]["TableName"];
        if(table_field_data[i]["AliasName"] == ""){
        table_field_data[i]["AliasName"]= table_field_data[i]["TableName"]
        }
        tab_obj.AliasName = table_field_data[i]["AliasName"];
        tab_obj.Mask = "";
        tab_obj.Fields = [];
        fld_list = table_field_data[i]["Fields"];
        for(var j=0;j<fld_list.length;j++){
            if(fld_list[j]["IsSelected"] == true){
                fld_obj = {};
                fld_obj.FieldId = 0;
                fld_obj.TableId = 0;
                fld_obj.FieldName = fld_list[j]["FieldName"];
                fld_obj.DataType = fld_list[j]["DataType"];
                if(fld_list[j]["AliasName"]==""){
                fld_list[j]["AliasName"]= fld_list[j]["FieldName"]
                }

                fld_obj.AliasName = fld_list[j]["AliasName"];
                fld_obj.Mask = parseInt(fld_list[j]["Mask"]);
                fld_obj.AccessLevel = fld_list[j]["AccessLevel"];

                if(fld_list[j]["AccessControlled"] == "True"){
                    fld_obj.AccessControlled = 1;
                }
                else{
                    fld_obj.AccessControlled = 0;
                }
                tab_obj.Fields.push(fld_obj);
            }
        }
        form_data.data.Tables.push(tab_obj);
    }
    form_data.data.Joins = join_details;
    form_data.data.WhereClause = where_details;
    $.ajax({
        type: 'POST',
        url: '/save_business_object_detail',
        dataType: 'json',
        data: {'req_data':JSON.stringify(form_data)},
        success: function (data, textStatus) {
            alert(data[0]["Message"]);
            window.location.href = "/dol";
        },
        error: function(xhr, status, e) {
            alert(status, e);
        }
    });
}

function validateObjectFiledForm() {
  // This function deals with validation of the form fields
  var x, y,z, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByClassName("form-control");
  z= x[currentTab].getElementsByClassName("form-control select2");
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
  for (i = 0; i < z.length; i++) {
    // If a field is empty...
    if ($(z[i]).val() == "" && y[i].value != "") {
      // add an "invalid" class to the field:
      $(z[i]).className += " invalid";
      // and set the current valid status to false
      valid = false;
      alert("Please select access level");
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

//Get Domain object name if already available, else add domain object details
function get_business_object_data_by_name(){
    var dataBusinessObjectName = $("#txtBusinessObjectName").val();
   $.get('/get_business_object_data_by_name', {"dataBusinessObjectName":dataBusinessObjectName}, function(data){
            if(data[0]["Status"]==='Success')
            {
                alert(data[0]["Message"])
                return false;
            }
            else if(data[0]["Status"]==='Failed')
            {
                save_Business_Object_Data();
            }
    });
}

$('#ddlDB').on("change",function(event){
 debugger;

   sel_dbname=$(this).val();
  // $(".join_tab").removeClass("skip");
   if(sel_dbname=="SQL SERVER"){
   $("#rdbms_section").show();
    $("#txtHost").val("");
    $("#txtPort").val("");
    $("#txtUserName").val("");

    $("#lbl_servername").show();
    $("#txtHost").show();
    $("#lbl_dbpath").hide();
    $("#lbl_username").show();
    $("#txtPort").show();
    $("#lbl_portname").hide();
    $("#lbl_Password").show();
    $("#txtUserName").show();
    $("#lbl_format").hide();
    $("#txtHost").addClass("validate");
    $("#txtPort").addClass("validate");
    $("#txtUserName").addClass("validate");
    $("#adls_section").hide();
   }else if(sel_dbname=="SQLITE"){
   $("#rdbms_section").show();
   $("#txtHost").val("");
    $("#txtPort").val("");
    $("#txtUserName").val("");

    $("#lbl_servername").hide();
    $("#txtHost").show();
    $("#txtHost").val("./airflow/data/AION_SDL.db");
    $("#lbl_dbpath").show();
    $("#lbl_username").hide();
    $("#txtPort").hide();
    $("#lbl_portname").hide();
    $("#lbl_Password").show();
    $("#txtUserName").show();
     $("#lbl_format").show();
     $("#txtHost").addClass("validate");
    $("#txtPort").removeClass("validate");
    $("#txtUserName").removeClass("validate");
    $("#adls_section").hide();
   }
   else if(sel_dbname=="DynamoDB"){
    $("#rdbms_section").show();
    $("#txtHost").val("");
    $("#txtPort").val("");
    $("#txtUserName").val("");
//  $(".join_tab").remove();
   // $(".join_tab").addClass("skip");
    $("#lbl_servername").show();
    $("#txtHost").show();
    $("#txtHost").val("http://localhost:8080/");
    $("#lbl_dbpath").hide();
    $("#lbl_username").hide();
    $("#txtPort").hide();
    $("#lbl_portname").hide();
    $("#lbl_Password").hide();
    $("#txtUserName").hide();
    $("#lbl_format").hide();
    $("#txtHost").addClass("validate");
    $("#txtPort").removeClass("validate");
    $("#txtUserName").removeClass("validate");
    $("#adls_section").hide();
   }else if(sel_dbname=="ADLSGen2"){
   $("#txtHost").removeClass("validate");
    $("#txtPort").removeClass("validate");
    $("#txtUserName").removeClass("validate");
    $("#adls_section").show();
    $("#rdbms_section").hide();
   }

   $.get('/get_DB', {'dbname':sel_dbname}, function(data) {
   });

 })