

$(document).ready(function() {
    get_device_count_from_metadata();
    get_simulator_details();
    get_setting_details();
    $('#setting_form').submit(submitForm)
    get_schema();
});

function submitForm(e) {

    e.preventDefault()
    const formData = new FormData(e.target)
    for(var pair of formData.entries()) {
   console.log(pair[0]+ ', '+ pair[1]);}
   //close popup
   $("#myForm").css({display:'none'})
   fetch('/submit_setting_values',{method:'POST',body:formData})

   .then(response => response.json())
  .then(data => console.log(data));
    alert("Submitted Successfully!!")

}

function get_device_count_from_metadata() {
    $.get('/get_device_count_from_metadata',function(response) {
        //return response
    })
}

function get_simulator_details() {
   $.get('/get_simulator_details', function(response) {
        console.log(response);

        var jsonParsedArray = JSON.parse(response);
        dropdown_cloudtype(jsonParsedArray['cloud_type'])
        dropdown_cloudservicetype(jsonParsedArray['cloud_type'], jsonParsedArray['cloud_service_type'])
        dropdown_hubname(jsonParsedArray['cloud_service_type'], jsonParsedArray['hub_name'])
        //dropdown_hubname(jsonParsedArray['simulator_type'],jsonParsedArray['hub_name'])

        document.getElementById(jsonParsedArray['simulation_type']).checked = true;
        if (jsonParsedArray['simulation_type'] == 'Deep_Learning') {
            document.getElementById("device_count").disabled = true;
        } else {
             document.getElementById("device_count").disabled = false;
        }

        var arr_data_options = jsonParsedArray['data_options'].split(',');
        for (var i=0, n=arr_data_options.length;i<n;i++)
        {
            document.getElementById(arr_data_options[i]).checked = true;
        }

        document.getElementById('device_count').value = jsonParsedArray['device_count']
        document.getElementById('time_delay').value = jsonParsedArray['time_delay']

        if (jsonParsedArray['simulator_status'] == 'Active') {
            $('#btn_sim_start').attr('disabled','disabled');
            document.getElementById('btn_sim_start').style.backgroundColor = 'Silver';
            $('#btn_sim_stop').removeAttr('disabled');
            document.getElementById('btn_sim_stop').style.backgroundColor = '#17A2B8';
        } else {
            $('#btn_sim_stop').attr('disabled','disabled');
            document.getElementById('btn_sim_stop').style.backgroundColor = 'Silver';
            $('#btn_sim_start').removeAttr('disabled');
            document.getElementById('btn_sim_start').style.backgroundColor = '#17A2B8';
        }

   })
}


//$('input[type=radio][name="simulator_type"]').change(function() {
//        dropdown_hubname($(this).val(),"")
//});

$("#cloud_service_type").change(function () {
       dropdown_hubname($(this).val(),"")
});

$('input[type=radio][name="simulation_type"]').change(function() {
    if ($(this).val() == 'Deep_Learning') {
         document.getElementById("device_count").disabled = true;
    } else {
         document.getElementById("device_count").disabled = false;
    }
});

function dropdown_hubname(cloud_service_type,sel_hub_name) {
        $('#hub_names option').remove();
        $('#hub_names').prepend($('<option></option>').html('Loading...'));
        form_data = new FormData();
        form_data = {};

        form_data.cloud_service_type = cloud_service_type;
        if (typeof cloud_service_type !== "undefined" ) {
        $.ajax({
            type: 'POST',
            url: '/get_hub_name_details',
            dataType: 'json',
            data: {'req_data':JSON.stringify(form_data)},
            success: function (data, textStatus) {
                $('#hub_names option').remove();
                for (var i = 0; i < data.length; i++) {
                    var opt = new Option(data[i]);
                    $("#hub_names").append(opt);
                    if(sel_hub_name != '') {
                        $('#hub_names').val(sel_hub_name);
                    }
                }
            },
            error: function(xhr, status, e) {
            }
        });
        }
}

function dropdown_cloudtype(sel_cloud_type) {
        $('#cloud_type option').remove();
        $('#cloud_type').prepend($('<option></option>').html('Loading...'));

        $.ajax({
            type: 'POST',
            url: '/get_cloudtype_details',
            dataType: 'json',
            data: {'req_data':''},
            success: function (data, textStatus) {
                $('#cloud_type option').remove();
                $('#cloud_type').prepend($('<option></option>').html('Select Cloud Type'));
                for (var i = 0; i < data.length; i++) {
                    var opt = new Option(data[i]);
                    $("#cloud_type").append(opt);
                    if(sel_cloud_type != '') {
                        $('#cloud_type').val(sel_cloud_type);
                    }
                    else {
                        $('#cloud_type').val(data[0]);
                    }
                }
            },
            error: function(xhr, status, e) {
            }
        });
}

$("#cloud_type").change(function () {
    dropdown_cloudservicetype($('#cloud_type').val(),"")
});

function dropdown_cloudservicetype(cloud_type, sel_cloud_service_type) {
        //var cloud_type = $('#cloud_type').val();
        $('#cloud_service_type option').remove();
        $('#cloud_service_type').prepend($('<option></option>').html('Loading...'));
        form_data = new FormData();
        form_data = {};
        form_data.cloud_type = cloud_type;
        if (typeof cloud_type !== "undefined" ) {
        $.ajax({
            type: 'POST',
            url: '/get_cloudservicetype_details',
            dataType: 'json',
            data: {'req_data':JSON.stringify(form_data)},
            success: function (data, textStatus) {
                $('#cloud_service_type option').remove();
                $('#cloud_service_type').prepend($('<option></option>').html('Select Cloud Service'));
                for (var i = 0; i < data.length; i++) {
                    var opt = new Option(data[i]);
                    $("#cloud_service_type").append(opt);
                    if(sel_cloud_service_type != '') {
                        $('#cloud_service_type').val(sel_cloud_service_type);
                    }
                }
            },
            error: function(xhr, status, e) {
            }
        });
        }
}

function start_simulator() {
        //$this.button('loading');
        var simulation_type = $("input:radio[name='simulation_type']:checked").val();
        console.log(simulation_type)
        var cloud_type = $('#cloud_type').val();
        var cloud_service_type = $('#cloud_service_type').val();
        //var data_options = $("input:checkbox[name='data_options']:checked").val();
        var data_options = document.getElementsByName('data_options');
        var sel_data_options = "";
        for (var i=0, n=data_options.length;i<n;i++)
        {
            if (data_options[i].checked)
            {
                sel_data_options += ","+data_options[i].value;
            }
        }
        if (sel_data_options)
        sel_data_options = sel_data_options.substring(1);
        var hub_name = $('#hub_names').val();
        var device_count = document.getElementById('device_count').value;
        var time_delay = document.getElementById('time_delay').value;

        if(simulation_type =="" || simulation_type==null || simulation_type==undefined) {
            alert("Please select Simulation Type")
        } else if(cloud_type == "" || cloud_type==null || cloud_type==undefined) {
          alert("Please select Cloud Type")
        }else if(cloud_type == "Select Cloud Type" ) {
            alert("Please select Cloud Type")
        }  else if(cloud_type == "Loading...") {
            alert("Please select Cloud Type. Once Loading Done.")
        } else if(cloud_service_type == "" || cloud_service_type==null || cloud_service_type==undefined) {
          alert("Please select Cloud Service Type")
        }else if(cloud_service_type == "Select Cloud Service") {
          alert("Please select Cloud Service Type")
        }else if(cloud_service_type == "Loading...") {
            alert("Please select Cloud Service Type. Once Loading Done.")
        } else if(sel_data_options=="" || sel_data_options==null || sel_data_options==undefined) {
            alert("Please select Data Options")
        } else if(hub_name == "" || hub_name==null || hub_name==undefined) {
            alert("Please select Hub Name")
        } else if(hub_name == "Loading...") {
            alert("Please select Hub Name. Once Loading Done.")
        } else if(device_count == "") {
            alert("Please Enter Device Count.")
        }else if(device_count == 0) {
            alert("Please Enter Device Count more than '0'.")
        } else if(time_delay == "") {
            alert("Please Enter Time Delay.")
        } else if(time_delay == 0) {
            alert("Please Enter Time Delay more than '0'.")
        } else {
                $.get('/get_device_count',function(response) {
                if(parseInt(device_count) > parseInt(response)) {
                    alert("Maximum device count is "+response+". Please enter below than "+response+".")
                } else {
                    form_data = new FormData();
                    form_data = {};

                    form_data.simulation_type = simulation_type;
                    form_data.cloud_type = cloud_type;
                    form_data.cloud_service_type = cloud_service_type;
                    form_data.data_options = sel_data_options;
                    form_data.hub_name = hub_name;
                    form_data.device_count = device_count;
                    form_data.time_delay = time_delay;
                    form_data.simulator_status = "Active";

                    alert("Simulator Started Successfully")
                    $('#btn_sim_start').attr('disabled','disabled');
                    document.getElementById('btn_sim_start').style.backgroundColor = 'Silver';
                    $('#btn_sim_stop').removeAttr('disabled');
                    document.getElementById('btn_sim_stop').style.backgroundColor = '#17A2B8';

                    $.ajax({
                        type: 'POST',
                        url: '/start_simulator',
                        dataType: 'json',
                        data: {'req_data':JSON.stringify(form_data)},
                        success: function (data, textStatus) {
                        get_simulator_details()
                        },
                        error: function(xhr, status, e) {
                        }
                    });
                }
            });
        }
}

function stop_simulator() {
        form_data = new FormData();
        form_data = {};

        form_data.simulator_status = "Idle";
        $.ajax({
            type: 'POST',
            url: '/stop_simulator',
            dataType: 'json',
            data: {'req_data':JSON.stringify(form_data)},
            success: function (data, textStatus) {
            alert("Simulator Stopped Successfully")
            get_simulator_details()
            },
            error: function(xhr, status, e) {
            }
        });
}



function get_setting_details() {
   $.get('/get_setting_details', function(response) {
        console.log(response);

        var jsonParsedArray = JSON.parse(response);

        document.getElementsByName('azure_subscription_id')[0].value = (typeof jsonParsedArray['azure_subscription_id'] === "undefined") ? "" : jsonParsedArray['azure_subscription_id']
        document.getElementsByName('iot_hub_name')[0].value = (typeof jsonParsedArray['iot_hub_name'] !== "undefined") ? jsonParsedArray['iot_hub_name'] : ""
        document.getElementsByName('iot_connection_string')[0].value = (typeof jsonParsedArray['iot_connection_string'] !== "undefined") ? jsonParsedArray['iot_connection_string'] : ""
        document.getElementsByName('event_hub_name')[0].value = (typeof jsonParsedArray['event_hub_name'] !== "undefined") ? jsonParsedArray['event_hub_name'] : ""
        document.getElementsByName('event_hub_connection_string')[0].value = (typeof jsonParsedArray['event_hub_connection_string'] !== "undefined") ? jsonParsedArray['event_hub_connection_string'] : ""
        document.getElementsByName('sdv_model_name')[0].value = jsonParsedArray['sdv_model_name']
        document.getElementsByName('azure_storage_connection_string')[0].value = (typeof jsonParsedArray['azure_storage_connection_string'] !== "undefined") ? jsonParsedArray['azure_storage_connection_string'] : ""

        document.getElementsByName('aws_access_key_id')[0].value = (typeof jsonParsedArray['aws_access_key'] !== "undefined") ? jsonParsedArray['aws_access_key'] : ""
        document.getElementsByName('aws_secret_key_id')[0].value = (typeof jsonParsedArray['aws_secret_key'] !== "undefined") ? jsonParsedArray['aws_secret_key'] : ""
        document.getElementsByName('aws_region')[0].value = (typeof jsonParsedArray['aws_region'] !== "undefined") ? jsonParsedArray['aws_region'] : ""
        document.getElementsByName('aws_stream_name')[0].value = (typeof jsonParsedArray['aws_stream_name'] !== "undefined") ? jsonParsedArray['aws_stream_name'] : ""

		 fetch("/get_sdv_models")
            .then((response) => response.json())
            .then((data) => {
              model_list = data.sdv_models;
              console.log(model_list)
              //create select list
              var select_el = $('#model_select')
              $(model_list).each(function() {
                select_el.append($("<option>").attr('value',this.sdv_model).text(this.sdv_model));
                 $('#model_select').val(jsonParsedArray['sdv_model_name']);
              });
              }).catch(err=>{
              console.error(err)});

        fetch("/get_template_list")
            .then((response) => response.json())
            .then((data) => {
              console.log(data)
              var select_el = $('#json_file_select');
              select_el.append($("<option>").attr('value','default').text('Default'));
              $(data.template_list).each(function(index,item) {
                select_el.append($("<option>").attr('value',item).text(item));
                if(jsonParsedArray['msg_template'] != '') {
                     $('#json_file_select').val(jsonParsedArray['msg_template']);
                }

              });
              }).catch(err=>{
              console.error(err)});

        //document.getElementsByName('sdv_model_name')[0].value = jsonParsedArray['sdv_model_name']
        //document.getElementsByName('msg_template')[0].value = jsonParsedArray['msg_template']
//        console.log(document.getElementsByName('azure_storage_connection_string')[0].value)
//        console.log(document.getElementsByName('sdv_model_name')[0].value)

   })
}

function get_schema(){
$.get('/get_setting_details', function(response) {
console.log(response);

var jsonParsedArray = JSON.parse(response);
console.log(jsonParsedArray['msg_template']);
document.getElementById('selected_schema').value=jsonParsedArray['msg_template'];
})
}
var global_id = "";
function get_template_id_by_name(){

}


function schema_view_on_modal(){

    fetch("/get_id_and_name")
    .then((response) => response.json())
    .then((data) => {
      req_data = data.template_list_with_id;
      var schema_name = document.getElementById('selected_schema').value
          var templateId = req_data[schema_name];
          console.log(templateId);

        var data={
            "templateId":templateId
        };
        $.ajax({
            type: "GET",
            url: "/get_schema_detail",
            data: data
        }).then(function (response) {
            data = JSON.parse(response.template_models)
            bind_schema_table(data);
        })
    })
  }

 function bind_schema_table(data){
    console.log(data);
    $("#model-view-schema").html("");
    table_head = ["S.No", "Attribute Name", "Attribute Type"];
      var html = "<table class='table'>";
      html += "<thead><tr class='bg-light'>";
      $.each(table_head, function (index, value) {
        html += "<th>" + value + "</th>";
      });
      html += "</thead></tr><tbody>";
      $.each(data, function (index, row) {
        html += "<tr>";
        html += `<td> ${index + 1} </td>`;
        html += `<td> ${row.property_name}</td>`;
        html += `<td> ${row.property_type}</td>`;
        html += "<tr>";
      });
      html += "</tbody></table>";
      $("#model-view-schema").html(html);
 }
