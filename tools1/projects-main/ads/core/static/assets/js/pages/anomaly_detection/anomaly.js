$(document).ready(function() {
    update_files_table()
})

function HandleBack() {
    window.history.go(-1)
}

function save_details() {
    var title_name = document.getElementById('title_name').value
    var datasource_type = document.querySelector('#datasource_type_select').value
    if (datasource_type === 'local_file') {
        if ($('#title_name').val() == '' || $('#upload_file').val() == '') {
            alert('Please enter valid details')
        } else {
            var file_detail = $('#upload_file')[0].files
            var file_name = file_detail[0].name
            var data = new FormData()
            data.append('upload_file', file_detail[0])
            data.append('title_name', title_name)
            data.append('file_name', file_name)
                console.log(file_detail[0]);
            $.ajax({
                type: 'POST',
                url: '/save_filedetails',
                contentType: false,
                processData: false,
                data: data,
            }).then(function(response) {
                alert(response)
                location.replace('/uploaded_files_table')
                update_files_table()
            })
            .catch((err) => {
                        console.error(err)
                        alert('Failed to save!!!')
                    });
        }
    } else if (datasource_type === 'database') {
        if ($('#database_type_select').val() != 'sqlite' && $('#database_type_select').val() != 'mssql' ) {
            if (
                $('#title_name').val() == '' ||
                $('#username').val() == '' ||
                $('#password').val() == '' ||
                $('#host').val() == '' ||
                $('#port').val() == '' ||
                $('#database_name').val() == ''
//                $('#select_dataset').val()=='none'
            ) {
                alert('Please enter valid details ')
            } else {
//document.querySelector('#connect_button').innerHTML = "<i class='fa fa-spinner fa-spin'></i> Connecting.."
                var db_type = $('#database_type_select').val()
                var username = $('#username').val()
                var password = $('#password').val()
                var host = $('#host').val()
                var port = $('#port').val()
                var database_name = $('#database_name').val()
                var data = new FormData()
                data.append('title_name', title_name)
                data.append('database_type', db_type)
                data.append('username', username)
                data.append('password', password)
                data.append('host', host)
                data.append('port', port)
                data.append('database_name', database_name)
                $.ajax({
                    type: 'POST',
                    url: '/connect_db',
                    contentType: false,
                    processData: false,
                    data: data,
                }).then(function(response) {
                    console.log(response.tables)
                    if (response.tables!=''){
                    html = ''
                    response.tables.map((val) => {
                        html += '<option value=' + val + '>' + val + '</option>'
                    })
                    document.getElementById('select_dataset').innerHTML = html
                }})
                .catch((err) => {
                        console.error(err)
                        alert('Failed to save!!!')
                    });
            }
        }
         else if ( $('#database_type_select').val() == 'mssql' ) {
            if (
                $('#title_name').val() == '' ||
                $('#username').val() == '' ||
                $('#password').val() == '' ||
                $('#host').val() == '' ||
                $('#port').val() == '' ||
                $('#database_name').val() == ''
//                $('#select_dataset').val()=='none'
            ) {
                alert('Please enter valid details ')
            } else {
//document.querySelector('#connect_button').innerHTML = "<i class='fa fa-spinner fa-spin'></i> Connecting.."
                var db_type = $('#database_type_select').val()
                var username = $('#username').val()
                var password = $('#password').val()
                var host = $('#host').val()
                var port = $('#port').val()
                var database_name = $('#database_name').val()
                var data = new FormData()
                data.append('title_name', title_name)
                data.append('database_type', db_type)
                data.append('username', username)
                data.append('password', password)
                data.append('host', host)
                data.append('port', port)
                data.append('database_name', database_name)
                $.ajax({
                    type: 'POST',
                    url: '/connect_mssql',
                    contentType: false,
                    processData: false,
                    data: data,
                }).then(function(response) {
                    console.log(response.tables)
                    if (response.tables!=''){
                    html = ''
                    response.tables.map((val) => {
                        html += '<option value=' + val + '>' + val + '</option>'
                    })
                    document.getElementById('select_dataset').innerHTML = html
                }})
                .catch((err) => {
                        console.error(err)
                        alert('Failed to save!!!')
                    });
            }
        }
         else {
            if ($('#sqlite_path').val() == '' || $('#title_name').val() == '') {
                alert('Please enter valid details ')
            } else {
//document.querySelector('#connect_button').innerHTML = "<i class='fa fa-spinner fa-spin'></i> Connecting.."
                var db_type = $('#database_type_select').val()
                var path = $('#sqlite_path').val()
                var data = new FormData()
                data.append('title_name', title_name)
                data.append('database_type', db_type)
                data.append('db_path', path)
                $.ajax({
                        type: 'POST',
                        url: '/connect_db',
                        contentType: false,
                        processData: false,
                        data: data,
                    })
                    .then(function(response) {
                        console.log(response.tables)
                        html = ''
                        response.tables.map((val) => {
                            html += '<option value=' + val + '>' + val + '</option>'
                        })

                        document.getElementById('select_dataset').innerHTML = html
                            // location.replace("/uploaded_files_table");
                            // update_files_table();
                    })
                    .catch((err) => {
                        console.error(err)
                        alert('Failed to save!!!')
                    });
            }
        }
    }
    }

function save_kafka_details(){
           var title_name = document.getElementById('title_name').value
           var datasource_type = document.querySelector('#datasource_type_select').value
           if (datasource_type === 'apache_kafka') {
            if (
                $('#title_name').val() == '' ||
                $('#kafka_host').val() == '' ||
                $('#kafka_port').val() == '' ||
                $('#topic').val() == '' ||
                $('#group_id').val() == '' ||
                $('#conn_string').val() == ''
            ) {
                alert('Please enter valid details ')
            } else {
            var datasource_type=$('#datasource_type_select').val()
                var kafka_host = $('#kafka_host').val()
                var kafka_port = $('#kafka_port').val()
                var topic = $('#topic').val()
                var group_id = $('#group_id').val()
                var conn_string = $('#conn_string').val()

                var data = new FormData()
                data.append('title_name', title_name)
                data.append('datasource_type',datasource_type)
                data.append('kafka_host', kafka_host)
                data.append('kafka_port', kafka_port)
                data.append('topic', topic)
                data.append('group_id', group_id)
                data.append('conn_string', conn_string)

                $.ajax({
                type: 'POST',
                url: '/save_kafka_details',
                contentType: false,
                processData: false,
                data: data,
                }).then(function(response) {
                alert(response)
                location.replace('/uploaded_files_table')

                })
                .catch((err) => {
                        console.error(err)
                        alert('Failed to save!!!')
                    });
            }
}}

function clear_form_content() {
    $('#title_name').val('')
    var datasource_type = document.querySelector('#datasource_type_select').value
    if (datasource_type === 'local_file') {
        $('#upload_file').val('')
    } else if (datasource_type === 'database') {
        if ($('#database_type_select').val() != 'sqlite') {
            $('#username').val('')
            $('#password').val('')
            $('#host').val('')
            $('#port').val('')
            $('#database_name').val('')
        } else {
            $('#sqlite_path').val('')
        }
    }
    else if (datasource_type === 'apache_kafka') {
            $('#kafka_host').val('')
            $('#kafka_port').val('')
            $('#topic').val('')
            $('#group_id').val('')
            $('#conn_string').val('')
        }
}

function update_files_table(data) {
    fetch('/get_files')
        .then((response) => response.json())
        .then((data) => {
            var response = data.files
            var html = ''
            $.each(response, function(index, value) {
                    var file_name = ''

                    if (value.Datasource_Type !== 'Local') {
                    fn=value.File_Name
                    file_name=fn.split('"')[1]+": "+fn.split('"')[3]+" | "+fn.split('"')[5]+": "+fn.split('"')[7]
                    }
                    else {
                     file_name=value.File_Name
                    }
                    html += '<tr>'
                    html += '<td>' + (index + 1) + '</td>'
                    html += '<td>' + value.Title_Name + '</td>'
                    html += '<td>' + value.Datasource_Type + '</td>'
                    html += '<td>' + file_name + '</td>'
                    html += '<td>' + value.Uploaded_Date + '</td>'
                    html += `<td>
                        <a href="/anomaly_detection_form/${value.ID}" title="Anomaly Detection Form" class="btn btn-outline-primary  me-2 btn-sm" >
                        <b>Anomaly</b>
                        </a>
                        <button class="btn btn-outline-danger btn-sm " title="Delete" onclick="handleRemove('${value.ID}')">
                        <b>Delete</b>
                        </button>
                    </td>`
                    html += '</tr>'
                })
            $('#files_list').html(html)
            $('.at').DataTable({searching: false, info: false, "pageLength": 10,"bLengthChange": false,})
        })
        .catch((err) => {
            console.error(err)
            document.getElementById('files_list').innerHTML = "No data Available"
        })
}

function handleRemove(TitleName) {
    var result = confirm('Are sure you want to delete?')
    if (result == true) {
        $.ajax({
            type: 'DELETE',
            url: '/remove_file',
            data: JSON.stringify({ TitleName }),
        }).then(function(response) {
            console.log(response)
            update_files_table(response.files)
        })
    }
}

function save_db_conn() {
    var selected_set = document.querySelector('#select_dataset').value
    var title_name = document.getElementById('title_name').value
    if (
                $('#title_name').val() == '' ||
                $('#username').val() == '' ||
                $('#password').val() == '' ||
                $('#host').val() == '' ||
                $('#port').val() == '' ||
                $('#database_name').val() == '' ||
                $('#database_type_select').val()==''
//                selected_set=='none'
            ) {
                alert('Please enter valid details ')
            }
    else if ($('#database_type_select').val() != 'sqlite') {
        var db_type = $('#database_type_select').val()
        var username = $('#username').val()
        var password = $('#password').val()
        var host = $('#host').val()
        var port = $('#port').val()
        var database_name = $('#database_name').val()
        var data = new FormData()
        data.append('title_name', title_name)
        data.append('database_type', db_type)
        data.append('username', username)
        data.append('password', password)
        data.append('host', host)
        data.append('port', port)
        data.append('database_name', database_name)
        data.append('dataset_name', selected_set)
        for (var pair of data.entries()) {
            console.log(pair[0] + ', ' + pair[1])
        }
        $.ajax({
            type: 'POST',
            url: '/save_db_details',
            contentType: false,
            processData: false,
            data: data,
        }).then(function(response) {
            alert(response)
            location.replace('/uploaded_files_table')
            update_files_table()
        })
    } else {
        var db_type = $('#database_type_select').val()
        var path = $('#sqlite_path').val()
        var data = new FormData()
        data.append('title_name', title_name)
        data.append('database_type', db_type)
        data.append('db_path', path)
        data.append('dataset_name', selected_set)
        for (var pair of data.entries()) {
            console.log(pair[0] + ', ' + pair[1])
        }
        $.ajax({
            type: 'POST',
            url: '/save_db_details',
            contentType: false,
            processData: false,
            data: data,
        }).then(function(response) {
            alert(response)
            location.replace('/uploaded_files_table')
            update_files_table()
        })
        .catch((err) => {
                        console.error(err)
                        alert('Failed to save!!!')
                    });
    }
}
