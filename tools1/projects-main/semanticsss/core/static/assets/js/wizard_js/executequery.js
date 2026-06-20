$("#btn_executequery").on("click",function(event){
    var user_key = $("#ddlUser").val();
    var object_id = $("#ddlDomainObj").val();
    var function_name = $("#txtfuncname").val();
    $("#resposedata").empty();
    $("#result_count").empty();
    var filter_text = $("#ddlcolumnname").val()+ $("#ddlcondition").val()+$("#txtfiltervalue").val();
    $.get('/fetch_data_from_adx', {'user_key':user_key, "object_id":object_id, "filter_text":filter_text, "function_name":function_name}, function(data) {
        $("#result_count").html("No of Records: "+data.result_count)
        $("#resposedata").append(data.result_html);
    });
});

$("#ddlUser").on("change", function(){
    $('#ddlDomainObj').empty();
    $('#func_display').html("");
    var user_key = $("#ddlUser").val();
    $.get('/api/list_user_domain_objects', {'Key':user_key}, function(data) {
        var obj_list = JSON.parse(data.Result);
        var options = '<option selected="selected" value="">--select--</option>';
        for(var i=0; i<obj_list.length;i++){
            options+= '<option value="'+ obj_list[i]["DetailId"] + '">' + obj_list[i]["DomainObjectName"] + '</option>'
        }
        $("#ddlDomainObj").append(options);
    });
});

$("#ddlDomainObj").on("change", function(){
    $("#result_count").html("");
    $("#ddlcolumnname").empty();
    if($("#ddlUser").val()==""){
        alert("Please select user first.");
        $("#ddlDomainObj").val("");
    }else{
        var user_id = $("#ddlUser").val();
        var object_id = $("#ddlDomainObj").val();
        $.get('/check_function_availability', {'user_id':user_id, "object_id":object_id}, function(data) {
            if(data.isExist){
                $("#txtfuncname").val(data.Result);
                $("#func_display").html("<b>User Context Object Name : </b>"+data.Result);
            }else{
                Swal.fire({
                  title: "User contextual object doesn't exist.",
                  text:"Do you want to create?",
                  showCancelButton: true,
                  confirmButtonText: 'Yes, Create it!',
                }).then((result) => {
                  if (result.isConfirmed) {
                    $.get('/execute_query', {'user_id':user_id, "object_id":object_id}, function(data) {
                        $("#func_display").html("<b>User Context Object Name : </b>"+data.Message);
                    });
                  }
                })
            }
            var obj_list = JSON.parse(data.Column_List);
            var options = '<option selected="selected" value="">--select--</option>';
            for(var i=0; i<obj_list.length;i++){
                options+= '<option value="'+ obj_list[i]["FieldName"] + '">' + obj_list[i]["FieldName"] + '</option>'
            }
            $("#ddlcolumnname").append(options);
        });
    }
});