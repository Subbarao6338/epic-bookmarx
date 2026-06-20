$(document).ready(function() {
    var urlParams = getUrlParams(location.search);
    if(Object.keys(urlParams).length === 0 && urlParams.constructor === Object){
        $("#taskname").val("task"+getFormattedDate());
        task_name = $("#taskname").val();
    }else{
        $("#taskname").val(urlParams.task_name);
        task_name = $("#taskname").val();
        read_log_file(urlParams.task_name);
    }
});

function getUrlParams(urlOrQueryString) {
  if ((i = urlOrQueryString.indexOf('?')) >= 0) {
    const queryString = urlOrQueryString.substring(i+1);
    if (queryString) {
      return _mapUrlParams(queryString);
    }
  }
  return {};
}

function _mapUrlParams(queryString) {
  return queryString
    .split('&')
    .map(function(keyValueString) { return keyValueString.split('=') })
    .reduce(function(urlParams, [key, value]) {
      if (Number.isInteger(parseInt(value)) && parseInt(value) == value) {
        urlParams[key] = parseInt(value);
      } else {
        urlParams[key] = decodeURI(value);
      }
      return urlParams;
    }, {});
}

function getFormattedDate() {
    var date = new Date();
    var str = date.getFullYear() + "" + (date.getMonth() + 1) + "" + date.getDate() + "" +  date.getHours() + "" + date.getMinutes() + "" + date.getSeconds();
    return str;
}
var current_page = 1;
var records_per_page = 10;
var objJson = [];
var tag_values = [];
var line_values = [];
var final_value = [];
var uploaded_file_name = "";
var total_records = 0;
var task_name = "";
var predefined_string_start_value = "";
var predefined_string_end_value = "";
var predefined_tag_type_value = "";
var predefined_date_format_value = "";
var userDefinedTagName = "";
var isSameTagReopened = false;
function prevPage(){
    if (current_page > 1) {
        current_page--;
        changePage(current_page, task_name);
    }
}

function nextPage(){
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page, task_name);
    }
}

var logfile_data='';
var logfile_line='';
function changePage(page, task_name){
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    $("#tbl_logbody tr").remove();
    var logbody='';
    $.get('/get_log_data', {'task_name':task_name, 'page_number':page-1, 'records_per_page':records_per_page}, function(data) {
        objJson = [];
        objJson = objJson.concat(JSON.parse(data));
        for(var i=0; i<objJson.length;i++){
            var img_src = "/static/assets/img/plus_icon.png";
            if(objJson[i].is_marked == "1"){
                img_src = "/static/assets/img/highlight_done.png";
            }
            //logbody=logbody+'<tr><th scope="row" >'+objJson[i].log_line_no+'</th><td>'+objJson[i].log_data+'</td><td> <input type="image" src="'+img_src+'" alt="" border=0 height=20 width=20  data-toggle="modal" data-target="#logsSelectedModal" class="view_logline" id="img_'+objJson[i].log_line_no+'"  log-text="'+objJson[i].log_data+'" log-num="'+objJson[i].log_line_no+'"></input></td></tr> ';
            var full_log_data = objJson[i].log_data.replaceAll('<','&lt;').replaceAll('>','&gt;');
            var sorted_log_data = "";
            if(full_log_data.length > 200){
                sorted_log_data = full_log_data.substring(0, 200) +" ...";
            }else{
                sorted_log_data = full_log_data;
            }
			logbody=logbody+'<tr><th scope="row" >'+objJson[i].log_line_no+'</th><td>'+sorted_log_data+'</td><td> <input type="image" src="'+img_src+'" alt="" border=0 height=20 width=20  data-toggle="modal" data-target="#logsSelectedModal" class="view_logline" id="img_'+objJson[i].log_line_no+'"  log-text="'+objJson[i].log_data+'" log-num="'+objJson[i].log_line_no+'"></input></td></tr> ';
        }
        $("#tbl_logbody").append(logbody);
         $('#tblloading').hide();
        $(".view_logline").on("click",function(event){
            //logfile_data= $(this).attr("log-text");
            logfile_data= $(this).parents('td').siblings('td').html();
            logfile_line= $(this).attr("log-num");
            var task_name = $("#taskname").val();
            bind_mark_tag_popup(logfile_line, task_name);
            show_tag_values();
        });
    });
    page_span.innerHTML = page + "/" + numPages();

    if (page == 1) {
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
    }

    if (page == numPages()) {
        btn_next.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
    }
}

function bind_mark_tag_popup(line, task){
    $.get('/get_log_record_by_id', {'task_name':task_name,'log_line_no':line}, function(data) {
        var json_data = JSON.parse(data);
        var json_str = (json_data[0].log_data).replaceAll('<','&lt;').replaceAll('>','&gt;');
		$(".logline").html(json_str.replaceAll('\n','<br>'));
        logfile_data = json_data[0].log_data;
        if(json_data[0].is_marked == "1"){
            $.get('/get_highlighted_data', {'task_name':task_name,'log_line_no':line}, function(data) {
                var selected_text_list = JSON.parse(data);
                for(i=0;i<selected_text_list.length;i++){
                    $("div.logline").html(function(_, html){
                            return html.replace(selected_text_list[i]["selected_text"],'<span class=highlight'+selected_text_list[i]["tag_id"]+'>'+selected_text_list[i]["selected_text"]+'</span>');
                    });
                }
            });
        }
        show_log_line_numbers(line);
    });
}

function numPages(){
    return Math.ceil(total_records / records_per_page);
}
$("#btn_import").on("click",function(event){
//Changes done by Gourav to mandatory Type
    if($('#trainingType').val()==0){
    alert("Please select Type.");
    }
    else{

    // return true;
    $("#logFileUpload").click();}
//End Changes
});

function show_log_line_numbers(line){
    task_name = $("#taskname").val();
    var tr_log_number = '';
    $("#tbl_log_lines tr").remove();
    $.get('/get_log_line_numbers', {'task_name':task_name}, function(data) {
        var log_number_list = JSON.parse(data);
        console.log(log_number_list);
        for(var i=0; i< log_number_list.length; i++){
            var tr_value = '';
            if(log_number_list[i].log_line_no == line){
                tr_value = '<tr><td class="selected_log_line">'+log_number_list[i].log_line_no+'</td></tr>';
            }else{
                tr_value = '<tr><td class="remaining_log_line">'+log_number_list[i].log_line_no+'</td></tr>';
            }
            tr_log_number = tr_log_number + tr_value;
        }
        $("#tbl_log_lines").append(tr_log_number);
        $(".remaining_log_line").on("click" ,function(){
            logfile_line = $(this).html();
            if(highlighted_data_list.length > 0){
                save_highlighted_data(highlighted_data_list);
            }
            bind_mark_tag_popup(logfile_line, task_name);
        });
    });
}

function update_upload_type(){
    var upload_type = $("#uploadType").val();
    if(upload_type == "Files"){
        $("#logFileUpload").removeAttr("webkitdirectory");
        $("#logFileUpload").removeAttr("mozdirectory");
        $("#logFileUpload").attr("multiple", true);
    }else if(upload_type == "Folder"){
        $("#logFileUpload").removeAttr("multiple");
        $("#logFileUpload").attr("webkitdirectory", true);
        $("#logFileUpload").attr("mozdirectory", true);
    }
}

function upload_log_files(){
$('#tblloading').show();
    separator = $("#separator").val();
    //alert(separator);
    var a = document.getElementById('logFileUpload');
    if(a.value == ""){
        alert("No File Selected");
    }else
    {
        var form_data = new FormData();
        for (var i = 0; i < $("#logFileUpload").get(0).files.length; ++i) {
            //form_data.append('log_files[]', $("#logFileUpload").get(0).files[i]);
			var file_ext_name = $("#logFileUpload").get(0).files[i].name.split('.').pop().toLowerCase();
            if($.inArray(file_ext_name, ['log','txt','csv']) == -1) {
            }
            else {
            form_data.append('log_files[]', $("#logFileUpload").get(0).files[i]);
            }
        }
        uploaded_file_name = $('#logFileUpload').val().split('\\').pop();
        var save_form_data = new FormData();
        save_form_data.task_name = $("#taskname").val();
        task_name = $("#taskname").val();
        save_form_data.task_desc = $("#taskdesc").val();
        save_form_data.tag_data = tag_values;
        save_form_data.highlighted_data = final_value;
        save_form_data.log_file_name = $('#logFileUpload').val().split('\\').pop();;
        save_form_data.log_delimiter = $("#separator").val();
        save_form_data.training_type = $("#trainingType").val();
        form_data.append('req_data', JSON.stringify(save_form_data))
        console.log(form_data);
        $.ajax({
               url: '/upload_log_files',
               type: 'POST',
               data: form_data,
               async: false,
               cache: false,
               contentType: false,
               enctype: 'multipart/form-data',
               processData: false,
               success: function (response) {
//                    alert(response);
                    read_log_file($("#taskname").val());
           }
       })
    }
}

function read_log_file(task_name){
    $("#page_footer_section").removeAttr("style");
    $("#log_display_table").removeAttr("style");
    $("#taskname").attr("readonly","true");
    $("#separator").attr("readonly", true);
    $("#btn_import").attr("disabled", true);
    $.get('/get_task_detail', {'task_name':task_name}, function(data) {
        var result_data = JSON.parse(data);
        $("#taskdesc").val(result_data[0].task_description);
        $("#separator").val(result_data[0].log_delimiter);
        $("#trainingType").val(result_data[0].training_type);
        fill_log_table(task_name);
    });
}

function fill_log_table(task_name){
    $.get('/get_total_records_count', {'task_name':task_name}, function(data) {
        total_records = data;
        changePage(1, task_name);
    });
}


$("#btn_regex").on("click",function(event){
    window.location.href = "/tasks";
});

$("#btn_execlog").on("click",function(event){
     $.get('/getexecutionlog', function(data) {
        response = data;
        console.log(response);
        alert(response)

    }).done(function() {
			setTimeout(function(){
			$("#overlay").fadeOut(300);
      },500);
  });
});

$("#btn_results").on("click",function(event){
     $.get('/getresults_api', function(data) {
        response = data;
        console.log(response);
        alert(response)

    }).done(function() {
			setTimeout(function(){
			$("#overlay").fadeOut(300);
			//$('#nav-tab a[href="#nav-col1"]').tab('show');
      },500);
  });
});
//<button class="btn tag_btn add_tag"><i class="fa fa-plus-circle" aria-hidden="false"></i></button>
//<button class="btn tag_btn remove_tag"><i class="fa fa-minus-circle" aria-hidden="true"></i></button>
$("#addTagField").on("click",function(event){
    tag_values = [];
    $('.tag_listing').append(`<li style='list-style-type: none; margin: 0; padding: 0;margin-left:-50px;'>
            <div class="row">
                <div class="col-md-8">
                    <button class="btn btn_tags" style="width:100%"><input type="text" name="tagInputField[]"></button>
                </div>
            </div>
        </li>`);
    $('#update_tags').show();
    $('#btnApplyAll').show();
});

$('#update_tags').on("click", function() {
    let tagInputField = $("input[name='tagInputField[]']").map(function() {
        return $(this).val();
    }).get();
    $(this).hide();
    let count = tag_values.length;
    $(tagInputField).each(function(key, val) {
    //Changed  by Gourav to check tag empty or not
        if(val==""){
        alert('Please enter tag name.');
        document.getElementById('btnApplyAll').style.display = 'none';
        }
        else{
        tag_values.push(val);
        document.getElementById('btnApplyAll').style.display = 'block';
        }
    //Change end
    });
    var tag_form_data = new FormData();
    tag_form_data.task_name = $("#taskname").val();
    tag_form_data.tag_values = tag_values;
    tag_form_data.is_predefined = '0';
    $.ajax({
        type: 'POST',
        url: '/save_tag_data_of_task',
        dataType: 'json',
        data: {'req_data':JSON.stringify(tag_form_data)},
        success: function (data, textStatus) {
            tag_values = [];
            show_tag_values();
        },
        error: function(xhr, status, e) {
            alert(status, e);
        }
    });
});

function show_tag_values(){
    var task_name = $("#taskname").val();
    $('#logs_selected_details .tag_listing').html('');
    let tag_val = '';
    $.get('/get_tag_data', {'task_name':task_name}, function(data) {
        tag_values = JSON.parse(data);
        console.log(tag_values);
        $.each(tag_values, function(key, val) {
            tag_val += `<li style='list-style-type: none; margin: 0; padding: 5;margin-left:-50px;'>
              <div class="row">
              <div class="col-md-7">
              <button style="width:100%" class="btn btn_tags ${'listtag'+(key+1)+'_'+val.tag_name} ${'highlight'+(key+1)}" value="${key+1}">${val.tag_name}</button>
              </div>
              <div class="col-md-5 form-control">
              <button class="btn tag_btn add_tag" id="${key+1}" title="Highlight" onclick="highlightSelection(this.id)" custom-attr="${key+1}"  ><i class="fa fa-plus-circle" aria-hidden="false"></i></button>
              <button class="btn tag_btn remove_tag active" title="Unhighlight" onclick="unhighlightSelection(${key+1})" custom-attr="${key+1}"><i class="fa fa-minus-circle" aria-hidden="true"></i></button>
              <button class="btn tag_btn userdefined_tag active" title="User Defined Formats" id="user_tag" onclick="userDefinedFormatOpen(${key+1})"><i class="fa fa-user" style="color:green;" aria-hidden="true"></i></button>
              <button class="btn tag_btn delete_tag active" title="Delete Tag" onclick="DeleteTag(${key+1})" custom-attr="${key+1}"><i class="fa fa-trash" style="color:red;" aria-hidden="true"></i></button>
              </div>
              </div>
              </li>`;
        });
        //Changes Done by Gourav Apply all not showing while edit.
        if(tag_values.length>0){
        $('#btnApplyAll').show();}
        //End Changes
        $('#logs_selected_details .tag_listing').append(tag_val);
        $("input[name='tagInputField[]']").parents("li").remove();
    });
}

function DeleteTag(val){
    var tag_name_val = tag_values[val-1]["tag_name"];
    Swal.fire({
          title: "Are you sure?",
          text: "You will not be able to recover this Tag and related highlighted data!",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!"
      }).then((result) => {
          if(result.isConfirmed){
            $.get('/delete_tag_data', {'task_name':task_name, 'tag_id':val, 'tag_name':tag_name_val}, function(data) {
                show_tag_values();
                RemoveHighlightData(val);
                changePage(current_page, task_name);
                if(tag_values.length == 1){
                    $("#btnApplyAll").hide();
                }
            });
          }
        });
}

function unhighlightSelection(val){
    $.get('/remove_highlight_data', {'task_name':task_name, 'line_no':logfile_line, 'tag_id':val}, function(data) {
        RemoveHighlightData(val);
    });
}

function RemoveHighlightData(selected_tag_id){
    $("span.highlight"+selected_tag_id).each(function() {
        var span_text = $(this).html();
        for(var i = 0; i < final_value.length; i++) {
            if(final_value[i].logfile_line == logfile_line && final_value[i].selectedText==span_text) {
                final_value.splice(i, 1);
            }
        }
        for(i=0;i<highlighted_data_list.length;i++){
            if(highlighted_data_list[i].logfile_line == logfile_line && highlighted_data_list[i].selectedText==span_text) {
                highlighted_data_list.splice(i, 1);
            }
        }
    });
    $("span.highlight"+selected_tag_id).contents().unwrap();
}

function mouseUp() {
    var sel = window.getSelection();
    if (sel && sel.toString() != '') {
        $('.add_tag').addClass('active');
    } else {
        $('.add_tag').removeClass('active');
    }
}
var highlighted_data_list = [];
function highlightSelection(tag_listid) {
    var selection;
    var span = document.createElement('span');
    span.className = "highlight"+tag_listid;
    if (window.getSelection){
        selection = window.getSelection();
        var range = selection.getRangeAt(0);
        var log_line = logfile_line;
        range.surroundContents(span);
        highlighted_data = new FormData();
        highlighted_data.data = {};
        highlighted_data.data.logfile_line = log_line;
        highlighted_data.data.logfile_data = logfile_data;
        highlighted_data.data.tag_name = tag_values[tag_listid-1]["tag_name"];
        highlighted_data.data.selectedText = span.innerHTML;
        var copy_log_data = logfile_data.replaceAll("\n", "").replaceAll("\r", "");
        highlighted_data.data.text_start = logfile_data.indexOf(span.innerHTML);
        highlighted_data.data.text_end = highlighted_data.data.text_start + (span.innerHTML).length;
        highlighted_data.data.tag_id = tag_listid;
        highlighted_data.data.task_name = $("#taskname").val();
        highlighted_data_list.push(highlighted_data.data);
    }
    $(".add_tag").removeClass("active");
}

$("#cancel_highlight").on("click",function(){
    highlighted_data_list = [];
});

$("#cancel_highlight_for_word_based").on("click",function(){
    $('#MarkModal').modal('show');
});

$("#cancel_highligh1t").on("click",function(){
    $('#WordBasedMarkModal').modal('hide');
});

$('#save_file_data').on("click", function() {
    if(highlighted_data_list.length>0){
        save_highlighted_data(highlighted_data_list);
    }
    $("#cancel_highlight").trigger('click');
});

function save_highlighted_data(list_data){
    $("#img_"+highlighted_data.data.logfile_line).attr("src","/static/assets/img/highlight_done.png");
    var highlighted_form_data = new FormData();
    highlighted_form_data.list_data = list_data;
    highlighted_data_list = [];
    $.ajax({
        type: 'POST',
        url: '/save_highlighted_of_task',
        dataType: 'json',
        data: {'req_data':JSON.stringify(highlighted_form_data)},
        success: function (data, textStatus) {
            tag_values = [];
            highlighted_data_list = [];
            show_tag_values();
        },
        error: function(xhr, status, e) {
            alert(status, e);
        }
    });
}


$('#save_data').on("click", function(){
    console.log(final_value);
});


//Adding method for radio button check hide/show div

function markingTypeCheck() {
    if(document.getElementById('PBCheck').checked) {
        document.getElementById('divPB').style.display = 'block';//show
        document.getElementById('divTB').style.display = 'none';//hide
    }
    else if(document.getElementById('WPBCheck').checked){
        $('#WordBasedMarkModal').modal('show');
        $('#MarkModal').modal('hide');
        document.getElementById('divMWPB').style.display = 'none';//hide
        document.getElementById('divSWPB').style.display = 'none';//hide
        document.getElementById('divPB').style.display = 'none';//hide
        document.getElementById('divTB').style.display = 'none';//hide
    }
    else{
        document.getElementById('divTB').style.display = 'block';//show
        document.getElementById('divPB').style.display = 'none';//hide
    }
}


function markingTypeCheckWordBased(){
    if (document.getElementById('SWPBCheck').checked) {
        $("#tBodySWPB").empty();
        for(j = 0; j < tag_values.length;j++){
            var newRowSWPContent = "<tr><td><input type=\"checkbox\" id=\"chk_swpb" + j + "\" class=\"sel_chkSWPB\" ></td><td style=\"width:50%;\"><input type=\"textarea\" value=\"\" id=\"wordstart\" ></td><td>" + tag_values[j]["tag_name"] +"</td></tr>";
            $("#tBodySWPB").append(newRowSWPContent);
        }
        $(".sel_chkSWPB").on("click",function(event){
        debugger;
        chk_id=$(this).attr("id");
        chk_id="#"+chk_id;
        var sts=$(this).prop("checked")
        if(sts == true){
            $(chk_id).prop("checked", true);
        }else{
             $(chk_id).prop("checked", false);
        }
        });

        document.getElementById('divSWPB').style.display = 'block';//show
        document.getElementById('divMWPB').style.display = 'none';//hide
        document.getElementById('divRSWPB').style.display = 'none';//hide
    }else if(document.getElementById('MWPBCheck').checked) {
        $("#tBodyMWPB").empty();
        for(j = 0; j < tag_values.length;j++){
            var newRowMWPContent = "<tr><td><input type=\"checkbox\" id=\"chk_mwpb" + j + "\" class=\"sel_MWPB\" ></td><td><input type=\"text\" value=\"\" id=\"wordstart\" ></td><td><input type=\"text\" value=\"\" id=\"wordend\"></td><td>" + tag_values[j]["tag_name"] +"</td></tr>";
            $("#tBodyMWPB").append(newRowMWPContent);
        }
        $(".sel_MWPB").on("click",function(event){
        debugger;
        chk_id=$(this).attr("id");
        chk_id="#"+chk_id;
        var sts=$(this).prop("checked")
        if(sts == true){
            $(chk_id).prop("checked", true);
        }else{
             $(chk_id).prop("checked", false);
        }
        });
        document.getElementById('divMWPB').style.display = 'block';//show
        document.getElementById('divSWPB').style.display = 'none';//hide
        document.getElementById('divRSWPB').style.display = 'none';//hide
    }else{
        $("#tBodyRSWPB").empty();
        for(j = 0; j < tag_values.length;j++){
            var newRowRSWPContent = "<tr><td><input type=\"checkbox\" id=\"chk_rswpb" + j + "\" class=\"sel_RSWPB\"></td><td style=\"width:50%;\"><input type=\"textarea\" value=\"\" id=\"wordstart\" ></td><td>" + tag_values[j]["tag_name"] +"</td></tr>";
            $("#tBodyRSWPB").append(newRowRSWPContent);
        }
        $(".sel_RSWPB").on("click",function(event){
        debugger;
        chk_id=$(this).attr("id");
        chk_id="#"+chk_id;
        var sts=$(this).prop("checked")
        if(sts == true){
            $(chk_id).prop("checked", true);
        }else{
             $(chk_id).prop("checked", false);
        }
        });
        document.getElementById('divRSWPB').style.display = 'block';//show
        document.getElementById('divMWPB').style.display = 'none';//hide
        document.getElementById('divSWPB').style.display = 'none';//hide
    }
}

//Adding apply all event here
$('#btnApplyAll').on("click", function() {
    $("#dtPB tBody").empty();
    if(highlighted_data_list.length == 0 && final_value.length>0){
        var sel_row_no = logfile_line;
        highlighted_data_list = $.grep(final_value, function(e) { return e.logfile_line == sel_row_no; })
    }
    var i = 0;
    $(highlighted_data_list).each(function(key, val) {
            var newRowContent = "<tr><td><input type=\"checkbox\" id=\"chk_pb" + i + "\" class=\"sel_chkPB\" ></td><td><input type=\"text\" value=\"" + highlighted_data_list[i].text_start + "\" ></td><td><input type=\"text\" value=\"" + highlighted_data_list[i].text_end + "\" ></td><td>" + highlighted_data_list[i].tag_name + "</td></tr>";
            $("#dtPB tBody").append(newRowContent);
            i++;
    });

     $(".sel_chkPB").on("click",function(event){
        debugger;
        chk_id=$(this).attr("id");
        chk_id="#"+chk_id;
        var sts=$(this).prop("checked")
        if(sts == true){
            $(chk_id).prop("checked", true);
        }else{
             $(chk_id).prop("checked", false);
        }

     });

    $("#tBodyTB").empty();
        for(j = 0; j < tag_values.length;j++){
            var newRowTBContent = "<tr><td><input type=\"checkbox\"  id=\"chk_tb" + j + "\" class=\"sel_chkTB\" ></td><td><input type=\"text\" value=\"\" id=\"wordstart" + j + "\" style='width: 100%;'></td><td><input type=\"text\" value=\"\" id=\"wordend" + j + "\" style='width: 100%;'></td><td>" + tag_values[j]["tag_name"] +"</td></tr>";
            $("#tBodyTB").append(newRowTBContent);
        }

    $(".sel_chkTB").on("click",function(event){
        debugger;
        chk_id=$(this).attr("id");
        chk_id="#"+chk_id;
        var sts=$(this).prop("checked")
        if(sts == true){
            $(chk_id).prop("checked", true);
        }else{
             $(chk_id).prop("checked", false);
        }

     });



    $('#MarkModal').modal('show');
});

$("#apply").on("click", function(){
    final_value = [];
    if(document.getElementById('PBCheck').checked){
        var t = document.getElementById("tBody");
        var trs = t.getElementsByTagName("tr");
        var IndexPositionMarkingInfo = [];
        for (var i=0; i<trs.length; i++)
        {
        debugger;
            tds = trs[i].getElementsByTagName("td");
            var chk_sts= $(tds[0]).children('input').prop("checked");
            if(chk_sts){
                var start_Index = $(tds[1]).children('input').val();
                var end_Index = $(tds[2]).children('input').val();
                var tagLabel = $(tds[3]).html();
                var tagID = i + 1;
                var tagInfo = new Object();
                tagInfo.start_Index = start_Index;
                tagInfo.end_Index = end_Index;
                tagInfo.tagLabel = tagLabel;
                tagInfo.tagID = tagID;
                IndexPositionMarkingInfo.push(tagInfo);
            }
        }
        $.get('/index_based_position_marking', {'task_name':task_name, 'indexPositionMarkingInfo':JSON.stringify(IndexPositionMarkingInfo)}, function(data) {
            total_records = data;
            for (var i = 0;  i<total_records.length; i++){
			    log_line_number = total_records[i]
				$("#img_"+log_line_number).attr("src","/static/assets/img/highlight_done.png");
			}
        });
	}
	else if(document.getElementById('TBCheck').checked){
		var t = document.getElementById("tBodyTB");
		var trs = t.getElementsByTagName("tr");
        var tagPositionMarkingInfo = [];
		for (var i=0; i<trs.length; i++)
		{
			tds = trs[i].getElementsByTagName("td");
			var chk_tb_sts= $(tds[0]).children('input').prop("checked");
			if(chk_tb_sts){
                var startWordIndex = $(tds[1]).children('input').val();
                var endWordIndex = $(tds[2]).children('input').val();
                var tagLabel = $(tds[3]).html();
                var tagID = i + 1;
                var tagInfo = new Object();
                tagInfo.startWord = startWordIndex;
                tagInfo.endWord = endWordIndex;
                tagInfo.tagLabel = tagLabel;
                tagInfo.tagID = tagID;
                tagPositionMarkingInfo.push(tagInfo);
			}
		}
		$.get('/tag_based_position_marking', {'task_name':task_name, 'tagPositionMarkingInfo':JSON.stringify(tagPositionMarkingInfo)}, function(data) {
			total_records = data;
			for (var i = 0;  i<total_records.length; i++){
			    log_line_number = total_records[i]
				$("#img_"+log_line_number).attr("src","/static/assets/img/highlight_done.png");
			}
		});
	}

    closeAllPopup();
});

$("#apply_for_word_based").on("click", function(){
    if(document.getElementById('SWPBCheck').checked) {
        var t = document.getElementById("tBodySWPB");
		var trs = t.getElementsByTagName("tr");
        var singleWordPositionMarkingInfo = [];
		for (var i=0; i<trs.length; i++)
		{
			tds = trs[i].getElementsByTagName("td");
			var chk_sts= $(tds[0]).children('input').prop("checked");
            if(chk_sts){
			var startWordIndex = $(tds[1]).children('input').val();
			var tagLabel = $(tds[2]).html();
			var tagID = i + 1;
			var singleWordTagInfo = new Object();
			singleWordTagInfo.startWordIndex = startWordIndex - 1;
			singleWordTagInfo.tagLabel = tagLabel;
			singleWordTagInfo.tagID = tagID;
			singleWordPositionMarkingInfo.push(singleWordTagInfo);
			}
		}
		$.get('/single_word_based_position_marking', {'task_name':task_name, 'singleWordPositionMarkingInfo':JSON.stringify(singleWordPositionMarkingInfo)}, function(data) {
			total_records = data;
			for (var i = 0;  i<total_records.length; i++){
			    log_line_number = total_records[i]
				$("#img_"+log_line_number).attr("src","/static/assets/img/highlight_done.png");
			}
		});
	}else if(document.getElementById('MWPBCheck').checked) {
        var t = document.getElementById("tBodyMWPB");
		var trs = t.getElementsByTagName("tr");
        var wordPositionMarkingInfo = [];
		for (var i=0; i<trs.length; i++)
		{
			tds = trs[i].getElementsByTagName("td");
			var chk_sts= $(tds[0]).children('input').prop("checked");
            if(chk_sts){
			var startWordIndex = $(tds[1]).children('input').val();
			var endWordIndex = $(tds[2]).children('input').val();
			if(endWordIndex == startWordIndex){
			    alert("Start Word Index and End Word Index cannot be same");
			    return;
			}else if(endWordIndex == ''){
			    alert("Please input End Word Index. It cannot be null value");
			    return;
			}
			var tagLabel = $(tds[3]).html();
			var tagID = i + 1;
			var tagInfo = new Object();
			tagInfo.startWordIndex = startWordIndex - 1;
			tagInfo.endWordIndex = endWordIndex;
			tagInfo.tagLabel = tagLabel;
			tagInfo.tagID = tagID;
			wordPositionMarkingInfo.push(tagInfo);
			}
		}
		$.get('/word_based_position_marking', {'task_name':task_name, 'wordPositionMarkingInfo':JSON.stringify(wordPositionMarkingInfo)}, function(data) {
			total_records = data;
			for (var i = 0;  i<total_records.length; i++){
			    log_line_number = total_records[i]
				$("#img_"+log_line_number).attr("src","/static/assets/img/highlight_done.png");
			}
		});
	}else{
	    var t = document.getElementById("tBodyRSWPB");
		var trs = t.getElementsByTagName("tr");
        var reverseSingleWordPositionMarkingInfo = [];
		for (var i=0; i<trs.length; i++)
		{
			tds = trs[i].getElementsByTagName("td");
			var chk_sts= $(tds[0]).children('input').prop("checked");
            if(chk_sts){
			var reverseStartWordIndex = $(tds[1]).children('input').val();
			var tagLabel = $(tds[2]).html();
			var tagID = i + 1;
			var reverseSingleWordTagInfo = new Object();
			reverseSingleWordTagInfo.reverseStartWordIndex = reverseStartWordIndex - 1;
			reverseSingleWordTagInfo.tagLabel = tagLabel;
			reverseSingleWordTagInfo.tagID = tagID;
			reverseSingleWordPositionMarkingInfo.push(reverseSingleWordTagInfo);
			}
		}
		$.get('/reverse_single_word_based_position_marking', {'task_name':task_name, 'reverseSingleWordPositionMarkingInfo':JSON.stringify(reverseSingleWordPositionMarkingInfo)}, function(data) {
			total_records = data;
			for (var i = 0;  i<total_records.length; i++){
			    log_line_number = total_records[i]
				$("#img_"+log_line_number).attr("src","/static/assets/img/highlight_done.png");
			}
		});
	}
    closeAllPopup();
});


function closeAllPopup(){
    $("#cancel_highlight").trigger('click');
    $("#cancel_highligh1t").trigger('click');
}

var records_per_page_popup = 1;
var current_page_popup = 1;
function prevPagePopup(){
    if (current_page_popup > 1) {
        current_page_popup--;
        changePagePopup(current_page_popup);
    }
}

function nextPagePopup(){
    if (current_page_popup < numPages()) {
        current_page_popup++;
        changePagePopup(current_page_popup);
    }
}

function numPages_popup(){
    return Math.ceil(objJson.length / records_per_page_popup);
}

function changePagePopup(page){
    var btn_next = document.getElementById("btn_next_popup");
    var btn_prev = document.getElementById("btn_prev_popup");
    var page_span = document.getElementById("page_popup");
    // Validate page
    if (page < 1) page = 1;
    if (page > numPages_popup()) page = numPages_popup();
    var logbody='';
    for (var i = (page-1) * records_per_page_popup; i < (page * records_per_page_popup) && i < objJson.length; i++) {
        $(".lognumber").text(objJson[i].sno);
        $(".logline").text(objJson[i].logData);
    }

    page_span.innerHTML = page + "/" + numPages_popup();

    if (page == 1) {
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
    }

    if (page == numPages()) {
        btn_next.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
    }
}
$("#Userformats_select").change(function() {
                predefined_tag_type_value = $("#Userformats_select").find("option:selected").text();
                var selectedValue = $("#Userformats_select").val();
                if (selectedValue == "Date") {
                    $('#Dateformats_select').show();
                    $('#Stringformats_select').hide();
                    $('#Dateformats_select').val("");
                } else if (selectedValue == "String") {
                    $('#Stringformats_select').show();
                    $('#Dateformats_select').hide();
                    $('#StringStart').val("");
                    $('#StringEnd').val("");
                } else {
                    $('#Dateformats_select').hide();
                    $('#Stringformats_select').hide();
                }

            });

$("#Dateformats_select").change(function() {
                    predefined_date_format_value = $("#Dateformats_select").find("option:selected").text();
});
$("#Stringformats_select").change(function() {
                    predefined_string_start_value = $('#StringStart').val();
                    predefined_string_end_value = $('#StringEnd').val();
});

$("#apply_predefined_format_based").on("click", function(){

    predefined_tag_values_info = [];
    var tag_form_data = new FormData();
    tag_form_data.task_name = $("#taskname").val();
    tag_form_data.userDefinedTagName = userDefinedTagName;
    tag_form_data.predefined_tag_type_value = predefined_tag_type_value;
    tag_form_data.predefined_date_format_value = predefined_date_format_value;
    tag_form_data.predefined_string_start_value = predefined_string_start_value;
    tag_form_data.predefined_string_end_value = predefined_string_end_value;
    tag_form_data.is_predefined = '1';
    predefined_tag_values_info.push(tag_form_data);
    if(isSameTagReopened){
    update_user_defined_format_info(tag_form_data);
    isSameTagReopened = false;
    }else{
    insert_user_defined_format_info(tag_form_data);
    }

    $.get('/user_defined_formats_marking', {'predefined_tag_values_info':JSON.stringify(predefined_tag_values_info)}, function(data) {
		});
    $('#btnApplyAll').show();
    $('#PredefinedFormatBasedMarkModal').modal('hide');
    predefined_tag_type_value = "";
    predefined_date_format_value = "";
    predefined_string_start_value = "";
    predefined_string_end_value = "";
});

function insert_user_defined_format_info(tag_form_data){

    insert_user_defined_format = []
    insert_user_defined_format.push(tag_form_data)
    $.get('/insert_user_defined_format_info', {'insert_user_defined_format':JSON.stringify(insert_user_defined_format)}, function(data) {
		});
}
function update_user_defined_format_info(tag_form_data){
    update_user_defined_format = []
    update_user_defined_format.push(tag_form_data)
    $.get('/update_user_defined_format_info', {'update_user_defined_format':JSON.stringify(update_user_defined_format)}, function(data) {
		});
}
function userDefinedFormatOpen(val) {
    $('#PredefinedFormatBasedMarkModal').modal('show');
    userDefinedFormatInfo = []
    userDefinedTagName = tag_values[val-1]["tag_name"];
    var tag_form_data = new FormData();
    tag_form_data.task_name = $("#taskname").val();
    tag_form_data.userDefinedTagName = userDefinedTagName;
    userDefinedFormatInfo.push(tag_form_data)

    $.get('/user_defined_format_selected_info', {'userDefinedFormatInfo':JSON.stringify(userDefinedFormatInfo)}, function(data) {
		var json_data = JSON.parse(data);
		if(json_data != ''){
		if(userDefinedTagName == json_data[0].tag_name && $("#taskname").val() == json_data[0].task_name){
		    isSameTagReopened = true;
		    }
		}
        openSelectedUserDefinedInfo(json_data);
		});
    }

function openSelectedUserDefinedInfo(json_data){
    if(json_data != ''){
     var predefined_tag_type_value = (json_data[0].predefined_tag_type_value);
     var predefined_date_format_value = (json_data[0].predefined_date_format_value);
     var predefined_string_start_value = (json_data[0].predefined_string_start_value);
     var predefined_string_end_value = (json_data[0].predefined_string_end_value);

        const key = predefined_tag_type_value;
        $("#Userformats_select").val(predefined_tag_type_value);
         if(key==='Date') {
			  $("#Dateformats_select").val(predefined_date_format_value);
			  $('#Dateformats_select').show();
              $('#Stringformats_select').hide();
              return;
		 }else if(key==='String') {
              $("#StringStart").val(predefined_string_start_value);
			  $("#StringEnd").val(predefined_string_end_value);
			  $('#Stringformats_select').show();
              $('#Dateformats_select').hide();
              return;
        }else{
			  $('#Dateformats_select').hide();
              $('#Stringformats_select').hide();
              return;
		}
		}else{
			   $("#Userformats_select").val("");
               $('#Stringformats_select').hide();
               $('#Dateformats_select').hide();
	    }
}