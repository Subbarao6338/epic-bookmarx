var anomaly_id = 0;
$(document).ready(function () {
  var url = window.location.href;
  var id = url.substring(url.lastIndexOf("/") + 1);
  anomaly_id = id;
  get_column_list_based_on_Id(anomaly_id);
  change_settings();
//get_interval();
});

function get_column_list_based_on_Id(anomaly_id) {
  var data = {
    anomaly_id: anomaly_id,
  };
  $.ajax({
    type: "GET",
    url: "/get_column_list",
    data: data,
  }).then(function (response) {
    addDates_list(response.object_list);
    addParams_list(response.int_list);
  });
}

function get_interval(){
 var data = {
    anomaly_id: anomaly_id,
  };
  $.ajax({
    type: "GET",
    url: "/get_column_list",
    data: data,
  }).then(function (response) {
    var diff=response.diff;
    console.log(diff);
    if(diff=='hourly'){
     document.getElementById("hourly").checked = true;
    }
    else if(diff=='daily'){
    document.getElementById("daily").checked = true;
    }
    else if(diff=='monthly'){
    document.getElementById("monthly").checked = true;
    }
//    else{
//    alert("Interval Not Available")
//    }
});
}

function addParams_list(int_list) {
//  console.log(typeof int_list);
  var options = "";
  $.each(int_list, function (index, value) {
    options += `<option value=${value}>${value}</option>`;
  });
  $("#params").append(options);
  $("#multi_params").append(options);
  $('#multi_params').multiselect(options);
}

function addDates_list(object_list) {
//  console.log(typeof object_list);
  var options = "";
  $.each(object_list, function (index, value) {
    options += `<option value=${value}>${value}</option>`;
  });
  $("#dates").append(options);
//interval_change();
}

function HandleBack() {
  window.history.go(-1);
}

//function clear_form_content() {
//  $("#title_name").val("");
//  $("#upload_file").val("");
//}

function save_anomaly_form() {
document.querySelector('#submit').innerHTML = "<i class='fa fa-spinner fa-spin'></i> Saving.."
  var date_parameter = $("#dates").val();
  var parameters = $("#params").val();
  var model_parameter = $("#models").val();
  var anomaly_types = $('input[name="anomaly_type"]:checked').val();
  var intervals = $('input[name="interval"]:checked').val();
  var multivariate_type = $('input[name="single_multi"]:checked').val();

  var data = new FormData();
  if (
    date_parameter == "" ||
    parameters == ""
//    model_parameter=="" ||
//    anomaly_types == "" ||
//    intervals == ""
  ) {
    alert("Please enter valid details");
    document.querySelector('#submit').innerHTML = "Submit"
  } else {
    data.append("anomaly_id", anomaly_id);
    data.append("date_param", date_parameter);
    data.append("anomaly_params", parameters);
    data.append("model_name", model_parameter);
    data.append("anomaly_type", anomaly_types);
    data.append("anomaly_interval", intervals);
    data.append("input_type", multivariate_type);

    $.ajax({
      type: "POST",
      url: "/save_anomaly_parameters",
      contentType: false,
      processData: false,
      data: data,
    })
    .then(function (response) {
      alert(response);
      document.querySelector('#submit').innerHTML = "<span style='color:green'>Success</span>"
      location.replace("/anomaly_table");
      //clear_form_content();
//      anomaly_table();
    })
    .catch((err) => {
    console.log(err)
      document.querySelector('#submit').innerHTML = "<span style='color:red'>Failed</span>"
      alert("Failed to Save!!!");
    });
  }
}

function get_selected_anomaly_service(){
    return new Promise(resolve=>{
    fetch('/get_anomaly_services', { method: 'GET' })
    .then((response) => response.json())
    .then((data) => {
       console.log(data)
       resolve(data.anomaly_service_type)
    })
})
}

async function change_settings(){
  const anomaly_service_type= await get_selected_anomaly_service()
  console.log(anomaly_service_type)
    if (anomaly_service_type == 'azure_anomaly_detection'){
        $("#mdl").hide()
        $("#atype").show()
        $("#aint").show()
        $("#input_type").hide()
        $("#rules").show()
    }
    if (anomaly_service_type == 'graviton_anomaly_detection'){
        $("#mdl").show()
        $("#atype").hide()
        $("#aint").hide()
        $("#input_type").show()
        $("#rules").hide()
    }
   }


function show(str)
    {
        document.getElementById('single_anomaly').style.display = 'none';
        document.getElementById('multi_anomaly').style.display = '';
    }
    function show2(sign){
        document.getElementById('single_anomaly').style.display = '';
        document.getElementById('multi_anomaly').style.display = 'none';
    }


function save_multi_anomaly_form() {
document.querySelector('#multi_submit').innerHTML = "<i class='fa fa-spinner fa-spin'></i> Saving.."
  var date_parameter = "";
  var parameters = $("#multi_params").val();
  var model_parameter = $("#multi_models").val();
  var anomaly_types = "";
  var intervals = "";
  var multivariate_type = $('input[name="single_multi"]:checked').val();

  var data = new FormData();
  if (
    parameters == ""||
    model_parameter==""
  ) {
    alert("Please enter valid details");
    document.querySelector('#multi_submit').innerHTML = "Submit"
  } else {
    data.append("anomaly_id", anomaly_id);
    data.append("date_param", date_parameter);
    data.append("anomaly_params", parameters);
    data.append("model_name", model_parameter);
    data.append("anomaly_type", anomaly_types);
    data.append("anomaly_interval", intervals);
    data.append("input_type", multivariate_type);

    $.ajax({
      type: "POST",
      url: "/save_anomaly_parameters",
      contentType: false,
      processData: false,
      data: data,
    })
    .then(function (response) {
      alert(response);
      document.querySelector('#multi_submit').innerHTML = "<span style='color:green'>Success</span>"
      location.replace("/anomaly_table");
    })
    .catch((err) => {
    console.log(err)
      document.querySelector('#multi_submit').innerHTML = "<span style='color:red'>Failed</span>"
      alert("Failed to Save!!!");
    });
  }
}