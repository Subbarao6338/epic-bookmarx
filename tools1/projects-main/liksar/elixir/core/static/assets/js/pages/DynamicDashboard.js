
$(document).ready(function() {
    Check_Environment_For_JAVA();
    $.get('/view_task_details', function(response) {
        console.log(response);
        var newmodel=0;
        var completedtask=0;
        var inprogresstask=0;
        var regularexpression=0;
        var task_htmlTable = '<div class="table"><div class="tableRow header blue"><div class="cell">Task Name</div><div class="cell">Task Description</div><div class="cell">Training Type</div><div class="cell">Created On</div><div class="cell">Completed On</div><div class="cell">Output</div></div>';
        for(i=0;i<response.length;i++){
            var task_dtl="";
            if(response[i].training_type == "ML Model")
            {
            newmodel++;
            }
            else if(response[i].training_type == "Regular Expression"){
            regularexpression++;
            }
            if(response[i].status == null)
            {
                response[i].status = "";
            }else if(response[i].status == "Drafted"){
                response[i].status = "Draft";
            }else if(response[i].status == "inprogress" || response[i].status == "In-Progress"){
               inprogresstask++;
            }else if(response[i].status == "completed" || response[i].status == "Completed"){
                completedtask++;
                //task_htmlTable += '<div class="tableRow"><div class="cell">'+response[i].taskname+'</div><div class="cell">'+response[i].taskDescription+'</div><div class="cell">'+response[i].training_type+'</div><div class="cell">'+response[i].task_CreatedDate+'</div><div class="cell">'+response[i].task_CompletedOn+'</div></div>';
                task_htmlTable += '<div class="tableRow"><div class="cell">'+response[i].taskname+'</div><div class="cell">'+response[i].taskDescription+'</div><div class="cell">'+response[i].training_type+'</div><div class="cell">'+response[i].task_CreatedDate+'</div><div class="cell">'+response[i].task_CompletedOn+'</div><div class="cell"><button type="button" class="btn btn-warning btn-sm btn_viewexeclog"  training_status="'+response[i].status+'" training_type="'+response[i].training_type+'" custom-attr="'+response[i].taskname+'"><i class="fa fa-list" style="color:white;"></i> Summary</button> &nbsp;&nbsp;<button type="button" class="btn btn-success btn-sm btn_viewresult" training_status="'+response[i].status+'" training_type="'+response[i].training_type+'" custom-attr="'+response[i].taskname+'"><i class="fa fa-eye"></i> Result</button></div></div>';
					}
         }
         task_htmlTable += '</div>';
         //alert(completedtask);
           var dynamicdivcompleted = '<div class="small-box bg-success"><div class="inner"><h3>'+ completedtask +'</h3><p>Completed Tasks</p></div><div class="icon"><i class="ion ion-stats-bars"></i></div></div>';
           var dynamicdivinprogress = '<div class="small-box bg-secondary"><div class="inner"><h3>'+ inprogresstask +'</h3><p>In-Progress Tasks</p></div><div class="icon"><i class="ion ion-load-a"></i></div></div>';
           var dynamicdivnewmodel='<div class="small-box bg-info"><div class="inner"><h3>'+ newmodel +'</h3><p>DL Models</p></div><div class="icon"><i class="ion ion-filing"></i></div></div>'
           var dynamicdivregularexpression='<div class="small-box bg-warning"><div class="inner"><h3>'+ regularexpression +'</h3><p>Regular Expression</p></div><div class="icon"><i class="ion ion-asterisk"></i></div></div>'
            $("#div_completetask").append(dynamicdivcompleted);
            $("#div_newmodel").append(dynamicdivnewmodel);
            $("#div_inprogresstask").append(dynamicdivinprogress);
            $("#div_regularexpression").append(dynamicdivregularexpression);
            $("#div_taskTable").append(task_htmlTable);
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
 });

function Check_Environment_For_JAVA(){
    $.get('/check_java_path_variable', function(response){
        if(response !=="Success"){
            Swal.fire({
              icon: 'warning',
              html: response
            })
        }
    });
}