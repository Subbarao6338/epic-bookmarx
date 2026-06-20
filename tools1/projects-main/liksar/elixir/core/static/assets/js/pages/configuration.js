$(document).ready(function() {
    get_configuration_data();
});

function get_configuration_data(){
    $.get('/get_config_details', function(response) {
        if(response.length>0){
            config_data = response[0];
            $("#txt_re_count").val(config_data.re_step_count);
            $("#txt_ml_count").val(config_data.ml_step_count);
            $("#txt_access_key").val(config_data.access_key);
            $("#txt_secret_key").val(config_data.secret_key);
            $("#txt_instance_id").val(config_data.ami_image_id);
            $("#lbl_filename").text(config_data.pem_filename);
        }else{
            $("#txt_access_key").val("");
            $("#txt_secret_key").val("");
            $("#txt_instance_id").val("");
            $("#lbl_filename").text("");
        }
    });
}

$("#btn_save_config").on("click",function(){
    var save_config_data = new FormData();
    save_config_data.re_steps = $("#txt_re_count").val();
    save_config_data.ml_steps = $("#txt_ml_count").val();
    save_config_data.access_key = $("#txt_access_key").val();
    save_config_data.secret_key = $("#txt_secret_key").val();
    save_config_data.instance_id = " ";
    save_config_data.pem_filename = $("#lbl_filename").text();
    save_config_data.ami_image_id = $("#txt_instance_id").val();
    $.ajax({
        type: 'POST',
        url: '/save_configuration_detail',
        dataType: 'json',
        data: {'req_data':JSON.stringify(save_config_data)},
        success: function (response, textStatus) {
            alert(response);

        },
        error: function(xhr, status, e) {
            alert(status, e);
        }
    });
});


var uploaded_filename="";
function upload_pemfile(){
debugger;
    var a = document.getElementById('fileUpload');
    if(a.value == "")
    {
        alert("No File Selected");
    }
    else
    {
    var theSplit = a.value.split('\\');
    console.log(theSplit);
    lbl_filename.innerHTML = theSplit[theSplit.length-1];

        var form_data = new FormData();
        for (var i = 0; i < $("#fileUpload").get(0).files.length; ++i) {
            form_data.append('pem_files[]', $("#fileUpload").get(0).files[i]);
        }
        console.log(form_data);
        $.ajax({
               url: '/upload_pemfile',
               type: 'POST',
               data: form_data,
               async: false,
               cache: false,
               contentType: false,
               enctype: 'multipart/form-data',
               processData: false,
               success: function (data, textStatus) {
                    filename=data[0]["FileName"];
                    alert(filename +" Uploaded");
           }
       })
    }
}





$("#btn_upload_key").on("click",function(){
$("#fileUpload").click();
});
