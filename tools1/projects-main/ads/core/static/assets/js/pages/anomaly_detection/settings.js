$(document).ready(function() {
    get_anomaly_form();
    change_settings();
})

function HandleBack() {
  location.replace('/uploaded_files_table');
}

function update_anomaly_form() {
    var Anomaly_services = $('#Anomaly_services').val()
    var subscription_key = document.getElementById('subscription_key').value
    var endpoint = document.getElementById('anomaly_detector_endpoint').value
    var data = new FormData()
    data.append('Anomaly_services', Anomaly_services)
    data.append('subscription_key', subscription_key)
    data.append('anomaly_detector_endpoint', endpoint)
    $.ajax({
        type: 'POST',
        url: '/update_anomaly_services',
        contentType: false,
        processData: false,
        data: data,
    }).then(function(response) {
        alert(response)
        console.log(Anomaly_services)
        location.replace('/uploaded_files_table')
    })
}

function get_anomaly_form() {
    $.ajax({
        type: 'GET',
        url: '/get_setting_values',
    }).then(function(response) {
        console.log(response.data.service_type)
        if (response.data.service_type=="graviton_anomaly_detection"){
        $("#skey").hide();
        $("#endp").hide();
        }
        if(response.data.service_type=="azure_anomaly_detection"){
        $("#skey").show();
        $("#endp").show();
        }
        document.getElementById('Anomaly_services').value =
            response.data.service_type
        document.getElementById('subscription_key').value =
            response.data.subscription_key
        document.getElementById('anomaly_detector_endpoint').value =
            response.data.ad_endpoint
    })
}

function change_settings(){
        $("select").change(function(){
            $( "select option:selected").each(function(){
                if($(this).attr("value")=="graviton_anomaly_detection"){
                    $("#skey").hide();
                    $("#endp").hide();
                }
                if($(this).attr("value")=="azure_anomaly_detection"){
                    $("#skey").show();
                    $("#endp").show();
                }
            });
        }).change();
   }
