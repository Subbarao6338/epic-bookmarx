$(document).ready(async function() {
    const anomaly_service_type= await get_selected_anomaly_service()
    if (anomaly_service_type == 'azure_anomaly_detection'){
        $("#graviton_table").hide()
        anomaly_table()
    }else{
        $("#azure_table").hide()
        graviton_table()
    }
})

function HandleBack() {
    window.history.go(-1)
}

function anomaly_table(data) {
    fetch('/anomaly_form', { method: 'GET' })
        .then((response) => response.json())
        .then((data) => {
            var response = data.files
            var html = ''
            $.each(response, function(index, value) {
                    //      document.getElementById("exampleModalLabel").innerHTML = "Anomalies for " + anomaly_param;
                    html += '<tr>'
                    html += '<td>' + (index + 1) + '</td>'
                    html += '<td>' + value.Anomaly_ID + '</td>'
                    html += '<td>' + value.Timeseries_Parameter + '</td>'
                    html += '<td>' + value.Anomaly_Parameters + '</td>'
                    html += '<td>' + value.Anomaly_Type + '</td>'
                    html += '<td>' + value.Anomaly_Interval + '</td>'
//                    if(value.Timeseries_Parameter==""){
//                    html += `<td>
//                    <a class="btn btn-outline-primary btn-sm" href="/charts_multi/${value.ID}">
//                    <b>View</b>
//                    </a>
//                    </td>`
//                    }
//                    else{
                    html += `<td>
                    <a class="btn btn-outline-primary btn-sm" href="/charts/${value.ID}">
                    <b>View</b>
                    </a>
                    </td>`
//                    }

                    html += '</tr>'
                })
            $('#anomaly_list').html(html)
            $('#azure_table').DataTable({searching: false, info: false, "pageLength": 10,"bLengthChange": false,})
        })
        .catch((err) => {
            console.error(err)
            document.getElementById('anomaly_list').innerHTML = 'No data available'
        })
}

function graviton_table(data) {
    fetch('/graviton_table', { method: 'GET' })
        .then((response) => response.json())
        .then((data) => {
            var response = data.files
            var html = ''
            $.each(response, function(index, value) {
                    html += '<tr>'
                    html += '<td>' + (index + 1) + '</td>'
                    html += '<td>' + value.Anomaly_ID + '</td>'
                    html += '<td>' + value.Timeseries_Parameter + '</td>'
                    html += '<td>' + value.Anomaly_Parameters + '</td>'
                    html += '<td>' + value.Model_Name + '</td>'

//                    if(value.Timeseries_Parameter==""){
//                    html += `<td>
//                    <a class="btn btn-outline-primary btn-sm" href="/charts_multi/${value.ID}">
//                    <b>View</b>
//                    </a>
//                    </td>`
//                    }
//                    else{
                    html += `<td>
                    <a class="btn btn-outline-primary btn-sm" href="/charts/${value.ID}">
                    <b>View</b>
                    </a>
                    </td>`
//                    }


                    html += '</tr>'
                })
            $('#graviton_list').html(html)
            $('#graviton_table').DataTable({searching: false, info: false, "pageLength": 10,"bLengthChange": false,})
        })
        .catch((err) => {
            console.error(err)
            document.getElementById('graviton_list').innerHTML = 'No data available'
        })
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
