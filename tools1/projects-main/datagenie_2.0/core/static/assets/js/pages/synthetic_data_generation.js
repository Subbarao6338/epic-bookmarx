$(document).ready(function () {
  load_synthetic_data_generation_list();
});

function load_synthetic_data_generation_list() {
  fetch("/get_synthetic_data_list")
    .then((response) => response.json())
    .then((data) => {
        var response = data.data_list;
        console.log(response);
        load_table(response);
    })
    .catch((err) => {
      console.error(err);
    });
}

function load_table(data){
    var html = '';
    $.each(data, function (index, value) {
        var EndTime = value.EndTime;
        if(value.EndTime == null){
            EndTime = "-"
        }
        var status = value.Status;
        var model_type = value.ModelType;
        html+="<tr>";
        html+="<td style='border:1px solid black' >"+(index+1)+"</td>";
        html+="<td style='display:none;border:1px solid black' >"+value.Id+"</td>";
        html+="<td style='border:1px solid black' >"+value.ModelName+"</td>";
        html+="<td style='border:1px solid black' >"+value.ModelType+"</td>";
        html+="<td style='border:1px solid black' >"+value.ModelFile+"</td>";
        html+="<td style='border:1px solid black' >"+value.RecordCount+"</td>";
        html+="<td style='border:1px solid black' >"+status+"</td>";
        html+="<td style='border:1px solid black' >"+value.StartTime+"</td>";
        html+="<td style='border:1px solid black' >"+EndTime+"</td>";
        html+="<td style='border:1px solid black' >"
        if(status == "Completed"){
            if(value.ModelType == "Single" && value.train_file !=''){
              var file_extension = value.train_file.split(".")[1];
              var download_file_name_str = value.ModelName+'_'+value.RecordCount+'.'+file_extension;
              var download_file_name = '/download_sdv_file?filetype=generated_files&filename='+download_file_name_str;
            }else{
                var download_file_name = '/download_rel_sdv_file?filetype=generated_files&filename='+value.ModelName+'_'+value.RecordCount+'.zip';
            }
            html+=`<button class="btn btn-success me-2" title= "Download generated synthetic data"><a style="color:white" href='${download_file_name}' download><i class="fa fa-download" aria-hidden="true"></i></a></button>`
            html+=`<button class="btn btn-primary me-2 re_generate" attr_dataset = "${value.ModelType}" attr_record_count = "${value.RecordCount}" attr_sel_model = "${value.ModelFile}" attr_gen_id = "${value.Id}" title = "Re-generate synthetic data"><i class="fa fa-recycle" aria-hidden="true"></i></button>`
            html+=`<button class="btn btn-danger me-2 delete_record" attr_delete_id = "${value.Id}" title = "Delete record"><i class="fa fa-trash" aria-hidden="true"></i></button>`
        }else{
            html+=`<button class="btn btn-danger me-2 delete_record" attr_delete_id = "${value.Id}" title = "Delete record"><i class="fa fa-trash" aria-hidden="true"></i></button>`
        }
        html+="</td>";
        html+="</tr>";
    });
    //finally insert into div
    $("#generated_data_table").html(html);
    $(".delete_record").on("click", function(){
        var generate_id = $(this).attr("attr_delete_id");
        delete_generated_data_record(generate_id);
    });
    $(".re_generate").on("click", function(){
        var obj_data = {
            generate_id:$(this).attr("attr_gen_id"),
            Number_of_Rows: $(this).attr("attr_record_count"),
            Model_Selected: $(this).attr("attr_sel_model"),
            Data_Type: $(this).attr("attr_dataset")
        };
        var formData = new FormData();
        $.each(obj_data, function(key, value) {
            formData.append(key, value);
        });
        fetch("/synth_data_generating", {
            method: "POST",
            body: formData,
          })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if(data == "Success"){
            alert("Synthetic data generation started successfully.");
            $('#close_button').trigger('click');
            load_synthetic_data_generation_list();
          }
          if(data == "Duplicate"){
            alert(rows+ " records already exist for selected model.\nDownload already generated data from summary page.");
          }
        })
        .catch((err) => {
          alert(err);
        });
    });
}

function delete_generated_data_record(record_id){
    var formData = new FormData();
    formData.append("generated_id", record_id);
    $.ajax({
        type: "POST",
        url: "/remove_synthgen_record",
        contentType: false,
        processData: false,
        data: formData
    }).then(function (response){
          alert(response.message);
          load_synthetic_data_generation_list();
    })
    .catch((err) => {
      console.error(err);
    });
}

var data_set_type = "Single";
$('input[type=radio][name="type_radio_button"]').change(function() {
    $('#select_model option').remove();
    data_set_type = $(this).val();
    var data={
        "dataset_type":data_set_type
    };
    $.ajax({
        type: "GET",
        url: "/get_modal_by_type",
        data: data
    }).then(function (response) {
        var data = response.modal_list;
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            var opt = new Option(data[i].modal_name);
            $("#select_model").append(opt);
        }
    })
});

$("#generate_button").on("click", function(){
    var rows = $("#number_of_rows").val();
    var obj_data = {
        generate_id:0,
        Number_of_Rows: $("#number_of_rows").val(),
        Model_Selected: $("#select_model").val(),
        Data_Type: data_set_type
    };
    if(obj_data.Model_Selected == "" || obj_data.Model_Selected == null || obj_data.Model_Selected == "No Model Selected"){
     alert("Please select model")
     }else if(obj_data.Number_of_Rows == "" || obj_data.Number_of_Rows == null){
     alert("Please enter no. of rows")
     }else if(obj_data.Number_of_Rows == 0){
     alert("Please enter no. of rows more than 0")
     }
    else{
    var formData = new FormData();
    $.each(obj_data, function(key, value) {
        formData.append(key, value);
    });
    fetch("/synth_data_generating", {
        method: "POST",
        body: formData,
      })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if(data == "Success"){
        alert("Synthetic data generation started successfully.");
        $('#close_button').trigger('click');
        load_synthetic_data_generation_list();
      }
      if(data == "Duplicate"){
        alert(rows+ " records already exist for selected model.\nDownload already generated data from summary page.");
      }
    })
    .catch((err) => {
      alert(err);
    });
    }
});