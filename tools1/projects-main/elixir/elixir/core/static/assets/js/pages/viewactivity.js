$(document).ready(function() {
    GetTaskList();
});

function GetTaskList(){
    $("#tbl_body").empty();
    $.get('/view_task_details', function(response) {
        console.log(response);
        for(i=0;i<response.length;i++){
            var task_dtl="";
            if(response[i].status == null)
            {
                response[i].status = "";
            }else if(response[i].status == "Drafted"){
                response[i].status = "Draft";
            }else if(response[i].status == "inprogress"){
                response[i].status = "In Progress";
            }else if(response[i].status == "completed"){
                response[i].status = "Completed";
            }
            var result_type = response[i].training_type;
            if(result_type == "ML Model"){
                result_type = "DL Model";
            }

            var task_start = '<button type="button" class="btn bg-navy btn-sm btn_generate_regex_for_task" custom-attr="'+response[i].taskname+'"><i class="fa fa-play"></i> Run</button>';
            if(response[i].status == 'In-Progress' || response[i].status == 'inprogress' || response[i].status=='Loading'){
                       task_start = '<button type="button" class="btn bg-navy btn-sm btn_generate_regex_for_task" custom-attr="'+response[i].taskname+'" disabled><i class="fa fa-play"></i> Run</button>'
            }
            last_column='<td>'+task_start+'&nbsp;&nbsp;<button type="button" class="btn btn-info btn-sm btn_edit_task" custom-attr="'+response[i].taskname+'"><i class="fa fa-edit"></i> Edit</button>&nbsp;&nbsp; <button type="button" class="btn btn-warning btn-sm btn_viewexeclog"  training_status="'+response[i].status+'" training_type="'+response[i].training_type+'" custom-attr="'+response[i].taskname+'"><i class="fa fa-list" style="color:white;"></i> Summary</button> &nbsp;&nbsp; <button type="button" class="btn btn-success btn-sm btn_viewresult" training_status="'+response[i].status+'" training_type="'+response[i].training_type+'" custom-attr="'+response[i].taskname+'"><i class="fa fa-eye"></i> Result</button>&nbsp;&nbsp; <button type="button" class="btn btn-danger btn-sm btn_delete_task" custom-attr="'+response[i].taskname+'"><i class="fa fa-trash"></i> Delete</button></td>';
            task_dtl='<tr><td>'+(i+1)+'</td><td>'+response[i].taskname+'</td><td>'+response[i].taskDescription+'</td><td>'+response[i].training_type+'</td><td>'+response[i].status+'</td>'+last_column+'</tr> ';

            if(response[i].is_process=='Loading'){
            last_column='<td>'+task_start+'&nbsp;&nbsp;<button type="button" class="btn btn-info btn-sm btn_edit_task" custom-attr="'+response[i].taskname+'" disabled><i class="fa fa-edit"></i> Edit</button>&nbsp;&nbsp; <button type="button" class="btn btn-warning btn-sm btn_viewexeclog" disabled training_status="'+response[i].status+'" training_type="'+response[i].training_type+'" custom-attr="'+response[i].taskname+'"><i class="fa fa-list" style="color:white;"></i> Summary</button> &nbsp;&nbsp; <button type="button" disabled class="btn btn-success btn-sm btn_viewresult" training_status="'+response[i].status+'" training_type="'+response[i].training_type+'" custom-attr="'+response[i].taskname+'"><i class="fa fa-eye"></i> Result</button><button type="button" class="btn btn-danger btn-sm btn_delete_task" disabled custom-attr="'+response[i].taskname+'"><i class="fa fa-trash"></i> Delete</button></td>';
            task_dtl='<tr><td>'+(i+1)+'</td><td>'+response[i].taskname+'&nbsp;&nbsp;<i class="fa fa-cog fa-spin" title="Loading file is in progress.."></i></td><td>'+response[i].taskDescription+'</td><td>'+response[i].training_type+'</td><td>'+response[i].status+'</td>'+last_column+'</tr> ';
            }
//            var task_start = '<button type="button" class="btn bg-navy btn-sm btn_generate_regex_for_task" custom-attr="'+response[i].taskname+'"><i class="fa fa-play"></i> Run</button>'
//            if(response[i].status == 'In-Progress' || response[i].status == 'inprogress'){
//                task_start = '<button type="button" class="btn bg-navy btn-sm btn_generate_regex_for_task" custom-attr="'+response[i].taskname+'" disabled><i class="fa fa-play"></i> Run</button>'
//            }
//            task_dtl='<tr><td>'+(i+1)+'</td><td>'+response[i].taskname+'</td><td>'+response[i].taskDescription+'</td><td>'+result_type+'</td><td>'+response[i].status+'</td><td>'+task_start+'&nbsp;&nbsp;<button type="button" class="btn btn-info btn-sm btn_edit_task" custom-attr="'+response[i].taskname+'"><i class="fa fa-edit"></i> Edit</button>&nbsp;&nbsp; <button type="button" class="btn btn-warning btn-sm btn_viewexeclog"  training_status="'+response[i].status+'" training_type="'+response[i].training_type+'" custom-attr="'+response[i].taskname+'"><i class="fa fa-list" style="color:white;"></i> Summary</button> &nbsp;&nbsp; <button type="button" class="btn btn-success btn-sm btn_viewresult" training_status="'+response[i].status+'" training_type="'+response[i].training_type+'" custom-attr="'+response[i].taskname+'"><i class="fa fa-eye"></i> Result</button>&nbsp;&nbsp; <button type="button" class="btn btn-danger btn-sm btn_delete_task" custom-attr="'+response[i].taskname+'"><i class="fa fa-trash"></i> Delete</button></td></tr> ';
            $("#tbl_body").append(task_dtl);
//            if(response[i].status=='inprogress'){
//                $(".btn_generate_regex_for_task").attr("disabled","disabled");
//            }
         }
        $(".btn_viewexeclog").on("click",function(){
            task_name = $(this).attr("Custom-attr");
            var training_status = $(this).attr("training_status");
            var training_type = $(this).attr("training_type");
            ShowExecutionLog(task_name, training_status, training_type);
        });
        $(".btn_viewresult").on("click",function(){
            task_name = $(this).attr("Custom-attr");
            var training_status = $(this).attr("training_status");
            var training_type = $(this).attr("training_type");
            ShowExecutionResult(task_name, training_status, training_type);
        });
        $(".btn_edit_task").on("click", function(){
            task_name = $(this).attr("Custom-attr");
            window.location.href = "/task?task_name="+task_name
        });
        $(".btn_generate_regex_for_task").on("click", function(){
            task_name = $(this).attr("Custom-attr");
            $(this).attr("disabled","disabled");
            start_regex_generation_for_task(task_name);
        });
        $(".btn_delete_task").on("click", function(){
            task_name = $(this).attr("Custom-attr");
            Delete_Task(task_name);
        });
    });
}

function Delete_Task(task_name){
    Swal.fire({
          title: "Are you sure?",
          text: "You will not be able to recover this Task!",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          denyButtonText: "No, cancel plx!"
      }).then((result) => {
          if(result.isConfirmed){
            $.get('/delete_task', {'task_name':task_name}, function(response) {
                GetTaskList();
            });
          }
        });
}

function start_regex_generation_for_task(task_name){
    $.get('/start_regex_generation_for_task', {'task_name':task_name}, function(response) {
        alert(response);
    });
}

function ShowExecutionLog(task_name, training_status, training_type){
    $(".exec_log_msg").empty();
	$.get('/getexecutionlog', {'task_name':task_name}, function(response) {
		var arr_log = response.split('\n\n');
		console.log(arr_log.length);
		var ul = document.createElement('ul');
		ul.setAttribute("class", "exec_log_msg_css");
		for(i=0; i<arr_log.length;i++){
			var li = document.createElement('li');
			li.innerHTML = arr_log[i];
			ul.append(li);
		}
		$(".exec_log_msg").html(ul);
		$('#execution-Log').modal('show');
	});
}

function ShowExecutionResult(task_name, training_status, training_type){
    $(".exec_result").empty();
    if(training_type == "ML Model" && training_status == "Completed"){
        $("#result_title").text("Result - ML Model")
        $.get('/get_ml_models', {'task_name':task_name}, function(response) {
            var html = '<div id="log_resulttable"><table id="logresultTable" border="1"><tr><th style="width: 30%;">Tag Name</th><th style="width: 40%;">Download Model</th></tr>';
            var html1 = '';
            for (var k = 0; k < response.length; k++) {
                var href_link = "/download_ml_model?tag_name="+response[k]+"&task_name="+task_name
                html1 = html1 + `<tr><td>${response[k]}</td><td><a href=${href_link} class="btn btn-success btn-sm btn_download_ml_model" tag-name=${response[k]} title="Download"><img src="/static/assets/img/download.png" width="18" height="18"></a></td></tr>`
            }
            html = html + html1 + '</table></div>';
            $(".exec_result").append(html);
            $('#execution-Result').modal('show');
//            $(".btn_download_ml_model").on('click',function(e){
//                e.preventDefault();
//                var tag_name = $(this).attr("tag-name");
//                DownloadMLModel(tag_name, task_name);
//            });
        });
    }else{
        debugger;
        $("#result_title").text("Result - Regular Expression")
        $.get('/getresults_api', {'task_name':task_name}, function(response) {
            var result = JSON.parse(response)["result"] ;
            var parsed_result = JSON.parse(result);
            html = '<div id="log_resulttable"><table id="logresultTable" border="1"><tr><th style="width: 30%;">Tag Name</th><th style="width: 40%;">Java Expression</th><th style="width: 60%;">Python/JS Expression</th></tr>';
            var html1 = '';
            for (var k = 0; k < parsed_result.length; k++) {
                var aa = parsed_result[k];
                for (var key in aa) {
                    var solutionJAVA = aa[key]["solutionJAVA"]
                    var solutionJS = aa[key]["solutionJS"]
                    html1 = html1 + "<tr><td>"+key+"</td><td><input type='text' value = '"+solutionJAVA+"' readonly style='border:none;width:100%'></td><td><input type='text' value = '"+solutionJS+"' readonly style='border:none;width:100%'></td></tr>"
                }
            }
            html = html + html1 + '</table></div>';
            $(".exec_result").append(html);
            $('#execution-Result').modal('show');
        });
    }
}

function DownloadMLModel(tag_name, task_name){
    $.get('/download_ml_model',{'task_name':task_name, 'tag_name':tag_name}, function(data) {
        response = data;
        alert(response);
    });
}

