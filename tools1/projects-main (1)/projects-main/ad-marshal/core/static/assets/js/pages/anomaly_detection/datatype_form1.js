$(document).ready(function() {
    //functions call
})

function get_selected_data_type() {
    var datasource_type = document.querySelector('#datasource_type_select').value
    if (datasource_type === 'local_file') {
        document.getElementById('connect_button').style.display = 'none'
        document.getElementById('submit_button').style.display = ''
        document.getElementById('kafka_button').style.display = 'none'
        var local_html = '<div class="mb-3 row ml-0" style="width: -webkit-fill-available;">'
        local_html += '<label class="form-label col-4">Upload CSV File</label>'
        local_html +=
            '<input id="upload_file" aria-label="required" required minlength="1"'
        local_html +=
            'name="upload_file" class="form-control col-7" type="file" accept=".csv, .json" value=""/></div>'
    } else if (datasource_type === 'database') {
        document.getElementById('connect_button').style.display = ''
        document.getElementById('submit_button').style.display = 'none'
        document.getElementById('kafka_button').style.display = 'none'
        var local_html =
            '<div class="mb-3 row ml-0" style="width: -webkit-fill-available;">'
        local_html += '<label class="form-label col-4">Database Type</label>'
        local_html +=
            '<select id="database_type_select" name="database_type_select"'
        local_html += 'class="form-control col-7"'
        local_html += 'onchange="handle_database_select()">'
        local_html += '<option value="postgresql">PostgreSQL</option>'
        local_html += '<option value="sqlite">SQLite</option>'
        local_html += '<option value="mysql">MySQL</option>'
        local_html += '<option value="mssql">MSSQL</option>'
        local_html += '</select></div><br/>'
        local_html +=
            '<div id="database_connection_form" style="width: -webkit-fill-available;">'
        local_html += '<div class="mb-3 row ml-0">'
        local_html += '<label class="form-label col-4">Username</label>'
        local_html +=
            '<input id="username" name="username" aria-label="required" required'
        local_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="text"'
        local_html += ' placeholder="Enter Username" value=""/></div>'
        local_html += '<div class="mb-3 row ml-0">'
        local_html += '<label class="form-label col-4">Password</label>'
        local_html +=
            '<input id="password" name="password" aria-label="required" required'
        local_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="password"'
        local_html += ' placeholder="Enter Password" value=""/></div>'
        local_html += '<div class="mb-3 row ml-0">'
        local_html += '<label class="form-label col-4">Host</label>'
        local_html += '<input id="host" name="host" aria-label="required" required'
        local_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="text"'
        local_html += ' placeholder="Enter Host" value=""/></div>'
        local_html += '<div class="mb-3 row ml-0">'
        local_html += '<label class="form-label col-4">Port</label>'
        local_html += '<input id="port" name="port" aria-label="required" required'
        local_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="text"'
        local_html += ' placeholder="Enter Port" value=""/></div>'
        local_html += '<div class="mb-3 row ml-0">'
        local_html += '<label class="form-label col-4">Database Name</label>'
        local_html +=
            '<input id="database_name" name="database_name" aria-label="required" required'
        local_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="text"'
        local_html += ' placeholder="Enter Database Name" value=""/></div>'
        local_html += '</div>'
    } else if (datasource_type === 'apache_kafka') {
        document.getElementById('connect_button').style.display = 'none'
        document.getElementById('submit_button').style.display = 'none'
        document.getElementById('kafka_button').style.display = ''
        var local_html =
            '<div id="database_connection_form" style="width: -webkit-fill-available;">'
        local_html += '<div class="mb-3 row ml-0" title="Enter Kafka host server. ex:xxxxx.servicebus.windows.net">'
        local_html += '<label class="form-label col-4">Kafka Host</label>'
        local_html +=
            '<input id="kafka_host" name="kafka_host" aria-label="required" required'
        local_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="text"'
        local_html += ' placeholder="Enter Kafka Host" value=""/></div>'
        local_html += '<div class="mb-3 row ml-0" title="Enter Kafka Port Number">'
        local_html += '<label class="form-label col-4">Kafka Port</label>'
        local_html +=
            '<input id="kafka_port" name="kafka_port" aria-label="required" required'
        local_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="number"'
        local_html += ' placeholder="Enter Kafka Port" value=""/></div>'
        local_html += '<div class="mb-3 row ml-0" title="Enter Kafka Topic Name">'
        local_html += '<label class="form-label col-4">Kafka Topic</label>'
        local_html +=
            '<input id="topic" name="topic" aria-label="required" required'
        local_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="text"'
        local_html += ' placeholder="Enter Kafka Topic" value=""/></div>'
        local_html += '<div class="mb-3 row ml-0" title="Enter Group id of Kafka">'
        local_html += '<label class="form-label col-4">Group ID</label>'
        local_html += '<input id="group_id" name="group_id" aria-label="required" required'
        local_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="text"'
        local_html += ' placeholder="Enter Group ID" value=""/></div>'
        local_html += '<div class="mb-3 row ml-0" title="Enter Endpoint Connection String of Kafka">'
        local_html += '<label class="form-label col-4">Connection String</label>'
        local_html += '<input id="conn_string" name="conn_string" aria-label="required" required'
        local_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="text"'
        local_html += ' placeholder="Enter Connection String" value=""/></div>'
        local_html += '</div>'
    }

    var connection_details = document.getElementById('connection_details_form')
    connection_details.innerHTML = local_html
}

function handle_database_select() {
    var database_type = document.querySelector('#database_type_select').value
    if (database_type === 'sqlite') {
        var mysql_html =
            '<div class="mb-3 row ml-0" style="width: -webkit-fill-available;">'
        mysql_html += '<label class="form-label col-4">Path of DB File</label>'
        mysql_html +=
            '<input id="sqlite_path" name="sqlite_path" aria-label="required" required'
        mysql_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="text" placeholder="Enter Path" value=""/></div>'
    } else {
        var mysql_html =
            '<div id="database_connection_form" style="width: -webkit-fill-available;">'
        mysql_html += '<div class="mb-3 row ml-0">'
        mysql_html += '<label class="form-label col-4">Username</label>'
        mysql_html +=
            '<input id="username" name="username" aria-label="required" required'
        mysql_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="text" placeholder="Enter Username" value=""/></div>'
        mysql_html += '<div class="mb-3 row ml-0">'
        mysql_html += '<label class="form-label col-4">Password</label>'
        mysql_html +=
            '<input id="password" name="password" aria-label="required" required'
        mysql_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="password" placeholder="Enter Password" value=""/></div>'
       mysql_html += '<div class="mb-3 row ml-0">'
        mysql_html += '<label class="form-label col-4">Host</label>'
        mysql_html += '<input id="host" name="host" aria-label="required" required'
        mysql_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="text" placeholder="Enter Host" value=""/></div>'
            mysql_html += '<div class="mb-3 row ml-0">'
        mysql_html += '<label class="form-label col-4">Port</label>'
        mysql_html += '<input id="port" name="port" aria-label="required" required'
        mysql_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="text" placeholder="Enter Port" value=""/></div>'
            mysql_html += '<div class="mb-3 row ml-0">'
        mysql_html += '<label class="form-label col-4">Database Name</label>'
        mysql_html +=
            '<input id="database_name" name="database_name" aria-label="required" required'
        mysql_html +=
            ' minlength="1" class="form-control is-invalid col-7" type="text" placeholder="Enter Database Name" value=""/>'
        mysql_html += '</div></div>'
    }
    var sqlite_details = document.getElementById('database_connection_form')
    sqlite_details.innerHTML = mysql_html
}