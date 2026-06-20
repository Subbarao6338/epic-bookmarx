var template_id = 0;
$("#display_json_keys").on("click", function(){
    if(!validate_template_fileds()){
        alert("Please enter template name and select json file.")
        return false;
    }
    var file_detail = $("#template_file")[0].files;
    var data = new FormData();
    data.append("template_file",file_detail[0]);
    data.append("template_name",$("#txt_template_name").val())
    $.ajax({
        type: "POST",
        url: "/display_json_content",
        contentType: false,
        processData: false,
        data: data
    }).then(function (response) {
        template_id = parseInt(response.template_id);
        $.each(response.json_key_list, function (index, value) {
            var html = "<tr>";
            html += '<td id="prop_name_'+index+'">' + value + "</td>";
            html += '<td id="prop_type_'+index+'">';
            html += '<select class="form-select" onchange="display_value_option(this)" id="type_'+index+'">';
            html += '<option value="" selected>--Select--</option>';
            html += '<option value="string">String</option>';
            html += '<option value="number">Numeric</option>';
            html += '<option value="datetime">Datetime</option>';
            html += '<option value="ip">IP Address</option>';
            html += '<option value="tel">Phone Number</option>';
            html += '<option value="email">E-Mail</option>';
            html += '</select>'
            html += '</td>';

            html += '<td class="column-verticallineMiddle form-inline" style="vertical-align:middle;">';

            html += '<div id="type_numeric_'+index+'" style = "display:none;">';
            html += '<input type="number" style="width:50%" class="form-control" id="txt_from_'+index+'" placeholder="Enter from">'
            html += '<input type="number" style="width:50%" class="form-control" id="txt_to_'+index+'" placeholder="Enter to">'
            html += '</div>';

            html += '<div id="type_string_'+index+'" style = "display:none;">';
            html += '<input type="text" style="width:100%" class="form-control" id="txt_value_'+index+'" placeholder="Enter value">'
            html += '</div>';

            html += '<div id="type_ip_'+index+'" style = "display:none;">';
            html += '<input type="text" style="width:100%" class="form-control" id="txt_value_'+index+'" autocomplete="off" placeholder="xxx.xxx.xxx.xx">'
            html += '</div>';

            html += '<div id="type_tel_'+index+'" style = "display:none;">';
            html += '<input type="text" id="phone" name="phone"  multiple required style="width:100%" class="form-control" id="txt_value_'+index+'" placeholder="+123-45-678">'
            html += '</div>';

            html += '<div id="type_email_'+index+'" style = "display:none;">';
            html += '<input type="email" id="email" name="email"  required style="width:100%" class="form-control"  id="txt_value_'+index+'" placeholder="Enter your Email address">'
            html += '</div>';


            html += '</td>';
            html += "</tr>";
            $("#json_content_body").append(html);
        });
    });
});
function display_value_option(sel){
    var index = $(sel).attr("id").replace("type_","");
    var str_div_id = "#type_string_"+index;
    var ip_div_id = "#type_ip_"+index;
    var tel_div_id = "#type_tel_"+index;
    var email_div_id = "#type_email_"+index;
    var num_div_id = "#type_numeric_"+index;
    if($(sel).val()=="string"){
        $(str_div_id).css("display","block");
        $(num_div_id).css("display","none");
        $(ip_div_id).css("display","none");
        $(tel_div_id).css("display","none");
        $(email_div_id).css("display","none");
    }
    else if($(sel).val()=="ip"){
        $(str_div_id).css("display","none");
        $(num_div_id).css("display","none");
        $(ip_div_id).css("display","block");
        $(tel_div_id).css("display","none");
        $(email_div_id).css("display","none");
     }
     else if($(sel).val()=="tel"){
        $(str_div_id).css("display","none");
        $(num_div_id).css("display","none");
        $(ip_div_id).css("display","none");
        $(tel_div_id).css("display","block");
        $(email_div_id).css("display","none");
     }
     else if($(sel).val()=="email"){
        $(str_div_id).css("display","none");
        $(num_div_id).css("display","none");
        $(ip_div_id).css("display","none");
        $(tel_div_id).css("display","none");
        $(email_div_id).css("display","block");
     }
    else if($(sel).val()=="number"){
        $(str_div_id).css("display","none");
        $(num_div_id).css("display","block");
        $(ip_div_id).css("display","none");
        $(tel_div_id).css("display","none");
        $(email_div_id).css("display","none");
    }
    else{
        $(str_div_id).css("display","none");
        $(num_div_id).css("display","none");
        $(ip_div_id).css("display","none");
        $(tel_div_id).css("display","none");
        $(email_div_id).css("display","none");
    }
}
$("#save_property_button").on("click", function(){
     if(!validate_template_fileds()){
            alert("Please enter template name and select json file.")
            return false;
     }
    result = true;
     var data= new FormData()
     var t_data=$("#json_property_table tbody tr").map(function() {
          var $cells = $(this).children();
          debugger;
          var sel_type = $cells.eq(1).find('select option:selected').text();
          if(sel_type == "--Select--"){
            alert("Please select property type and fill value of all the property based on type.");
            result = false;
          }else{
            if(sel_type == "String"){
                var val_str = $cells.eq(2).find("input")[2].value;
                if(val_str == ""){
                    alert("Please fill value of all the property based on type.");
                    result = false;
                }
            }if(sel_type == "IP Address"){
                var val_ip = $cells.eq(2).find("input")[3].value;
                var ipFormat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                if(val_ip == ""){
                    alert("Please fill value of all the property based on type.");
                    result = false;
                }
                else if (!ipFormat.test(val_ip)) {
            alert( "  IP Address is not valid, Please provide a valid IP Address ");
            return false;
        }
            }if(sel_type == "Phone Number"){
                var val_tel = $cells.eq(2).find("input")[4].value;
                var mobileFormat = /^\d{10}$/g;
                if(val_tel == ""){
                    alert("Please fill value of all the property based on type.");
                    result = false;
                }
                else if (!mobileFormat.test(val_tel)) {
            alert( " Phone Number is not valid, Please provide a valid Phone Number ");
            return false;
        }
            }if(sel_type == "E-Mail"){
                var val_email = $cells.eq(2).find("input")[5].value;
                var mailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9])+$/;

        if (val_email == "") {
            alert( "  Please enter your Email Id  ");
            return false;
        }
        else if (!mailFormat.test(val_email)) {
            alert( "  Email Address is not valid, Please provide a valid Email ");
            return false;
        }
            }if(sel_type=="Numeric"){
                var val_from = $cells.eq(2).find("input")[0].value;
                if(val_from == ""){
                alert("Please fill value of all the property based on type.");
                result = false;
                }
                var val_to = $cells.eq(2).find("input")[1].value;
                if(val_to == ""){
                alert("Please fill value of all the property based on type.");
                result = false;
                }
            }
          }
          return {
             propsName: $cells.eq(0).text(),
             type: $cells.eq(1).find('select option:selected').text(),
             value_from:parseInt($cells.eq(2).find("input")[0].value),
             value_to:parseInt($cells.eq(2).find("input")[1].value),
             string_value:$cells.eq(2).find("input")[2].value,
             ip_value:$cells.eq(2).find("input")[3].value,
             tel_value:$cells.eq(2).find("input")[4].value,
             email_value:$cells.eq(2).find("input")[5].value,

            template_id:template_id
          };
     });
     data.append('data',JSON.stringify(t_data.toArray()))
    if(result){
        $.ajax({
            type: "POST",
            url: "/json_content_property",
            contentType: false,
            processData: false,
            data: data
        }).then(function (response) {
           console.log(response);
            alert("Data saved successfully!!!");
            location.replace("/data_simulator")
            //window.location.href = "http://127.0.0.1:8000/data_simulator"
        });
    }
});

function HandleBack() {
  window.history.go(-1);
}

function validate_template_fileds(){
    var result = true;
    if($("#txt_template_name").val() == ""){
        result = false;
    }
    var file_len = $("#template_file")[0].files.length;
    if(file_len === 0){
        result = false;
    }
    return result;
}





function callFileUpload(){
    $("#template_file").click();
}

function UploadFile_Single(){
    debugger;

    var a = document.getElementById('template_file');
    if(a.value == "")
    {
        $("#fileLabel").innerHTML = "No File Selected";
    }
    else{
        var theSplit = a.value.split('\\');
        $("#fileLabel").html(theSplit[theSplit.length-1]);
    }
}


