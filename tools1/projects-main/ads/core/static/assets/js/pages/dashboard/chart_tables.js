$(document).ready(function() {
    latest_file_table()
})

function modal_body(id) {
    var data = {
        ID: id,
    }
    console.log('id', id)
    $.ajax({
            type: 'GET',
            url: '/view_anomaly',
            data: data,
        })
        .then(function(response) {
            json_content = response['json']
            console.log(json_content)
            $('#view_body').html(
                '<pre>' + JSON.stringify(json_content, undefined, 2) + '</pre>',
            )
        })
        .catch(() => {
            document.getElementById('modal_view').innerHTML = 'No data available'
        });
}

function latest_file_table(data) {
    fetch('/latest_file')
        .then((response) => response.json())
        .then((data) => {
            var response = data.file_latest
            var html = ''
            $.each(response,function(value) {
                if (response[value].Datasource_Type === 'Database') {
                    var db_detail = JSON.parse(response[value].File_Name)
                    if (db_detail.db_type === 'sqlite') {
                        var obj = {
                            Database: db_detail.db_type,
                            Dataset: db_detail.dataset,
                        }
                    } else {
                        var obj = {
                            Database: db_detail.db_type,
                            Dataset: db_detail.dataset,
                        }
                    }
                    file_name = JSON.stringify(obj)
                } else {
                    file_name = response[value].File_Name.split('/')[1]
                }

                html += '<tr>'
//                html += '<td>' + (index + 1) + '</td>'
                html += '<td>' + response[value].Title_Name + '</td>'
                html += '<td>' + file_name + '</td>'
                    // html += "<td>" + display_json + "</td>";
                    /*  html+=`<td>
                                <a class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#view"
                                onclick="modal_body('${response[value].ID}')">view</a>
                                </td>`;*/
                html += '</tr>'
            })
            $('#files_latest').html(html)
        })
        .catch((err) => {
            console.error(err)
            document.getElementById('files_latest').innerHTML = 'No data available'
        });
}
