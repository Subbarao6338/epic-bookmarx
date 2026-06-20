$("#btn_viewexeclog").on('click',function(){
    var size = 0;
    $.get('/getexecutionlog', function(data) {
        $(".exec_log_msg").empty();
        response = JSON.parse(data);
        console.log(response.logs);
        var arr_log = response.logs.split('\n\n');
        console.log(arr_log.length);
        var ul = document.createElement('ul');
        ul.setAttribute("class", "exec_log_msg_css");
        for(i=0; i<arr_log.length;i++){
            var li = document.createElement('li');
            li.innerHTML = arr_log[i];
            ul.append(li);
//            $(".exec_log_msg").append(li);
        }
        $(".exec_log_msg").html(ul);
        $('#execution-Log').modal('show');
    });
});