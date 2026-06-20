
$(document).ready(function() {
//    handleFormSubmit();
});

//$('#select_model').prepend($('<option></option>').html('Loading...'));
var type_data = "";
$('input[type=radio][name="radio_button"]').change(function() {
//        console.log($(this).val());
        document.querySelector('#download_button').disabled = true;
        document.querySelector('#download_button_rel').disabled = true;
        dropdown_model_list($(this).val());
        type_data = $(this).val();
});
function dropdown_model_list(data_type) {

        form_data = new FormData();
        form_data = {};

        form_data.data_type = data_type;

        $.ajax({
            type: 'POST',
            url: '/get_model_list',
            dataType: 'json',
            data: {'req_data':JSON.stringify(form_data)},
            success: function (data, textStatus) {
                $('#select_model option').remove();
                for (var i = 0; i < data.length; i++) {
                    var opt = new Option(data[i]);
                    $("#select_model").append(opt);

                }
                 //document.getElementById("hub_names").options[0].remove();
            },
            error: function(xhr, status, e) {
            }
        });

}

$("#form_generate").submit(function handleFormSubmit(e) {
  e.preventDefault();

//function generate_data(e){
//    e.preventDefault()
//    console.log(e.)
    var rows = document.getElementById('number_of_rows').value;
    var model = document.getElementById('select_model').value;
    console.log(type_data, rows, model);

    let obj_data = {
    Number_of_Rows: rows,
    Model_Selected: model,
    Data_Type: type_data
    };

    const formData = new FormData();
    $.each(obj_data, function(key, value) {
    formData.append(key, value);
    });

    if(type_data==''){
    alert("Please select Data Type");
    }
    else{
    document.querySelector('#generate_button').innerHTML = "<i class='fa fa-spinner fa-spin'></i> Generating"
    console.log(formData);
        fetch("/synth_data_generating", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if(data == "Success"){
            window.location.href = "/data_generated_list";
          }
          if(data == "Duplicate"){
                alert(rows+ " Data Already Exist for selected model.");
                document.querySelector('#generate_button').innerHTML = "Generate";
                if (type_data=='single_table'){
                    document.querySelector('#download_button_rel').style.display = "none";
                    document.querySelector('#download_button').style.display = "";
                    document.querySelector('#download_button').disabled = false;
                }
                else {
                    document.querySelector('#download_button_rel').disabled = false
                    document.querySelector('#download_button_rel').style.display = "";
                    document.querySelector('#download_button').style.display = "none";
                }
            }
        })
        .catch((err) => {
          console.error(err);
          $('#button_failure_popup').trigger('click');
          document.querySelector('#generate_button').innerHTML = "Generate";
        });
    }
});
