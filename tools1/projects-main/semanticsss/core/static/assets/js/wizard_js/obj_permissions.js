$("#btn_submit").on("click", function(event){
    var userid = $("#ddlUserName").val();
    var detailid = $("#ddl_DomainObj").val();
    var permission = $("#ddlPermission").val();
    var accesslevel = $("#ddlUserAccessType").val();

    form_data = new FormData();
    form_data.data = {};

    form_data.data.UserId = userid;
    form_data.data.DetailId= detailid;
    form_data.data.Permission= permission;
    form_data.data.AccessLevel= accesslevel;
     $.ajax({
        type: 'POST',
        url: '/execute_object_permission',
        dataType: 'json',
        data: {'req_data':JSON.stringify(form_data)},
        success: function (data, textStatus) {
            alert(data[0]["Result"]);
            window.location.href = "/object_permissions";
        },
        error: function(xhr, status, e) {
            alert(status, e);
        }
    });

});

$("#ddl_DomainObj").on("change", function(event){
debugger;

 if($("#ddlUserName")[0].selectedIndex<=0){
    alert("Please select User Name");
    $("#ddl_DomainObj").prop('selectedIndex',0);
    return;
    }

 var userid = $("#ddlUserName").val();
 var detailid = $(this).val();

 $.get('/get_object_permision_details', {'userid': userid, 'detailid': detailid}, function(data) {
 debugger;
        var data=JSON.parse(data);
        if(data.length > 0){

        $("#ddlUserAccessType").val(data[0].AccessLevel)
        if(data[0].IsAllowed == 1){
           $("#ddlPermission").val("true")
        }

        else{
           $("#ddlPermission").val("false")
        }

        }

 });
});


$("#ddlUserName").on("change",function(event){
    $("#ddl_DomainObj").prop('selectedIndex',0);
    $("#ddlUserAccessType").prop('selectedIndex',0);
    $("#ddlPermission").prop('selectedIndex',0);
});

$("#btn_DOExecute").on("click", function(event){
    var userid = $("#ddlUserName").val();
    var detailid = $("#ddl_DomainObj").val();
    var permission = $("#ddlPermission").val();
    var accesslevel = $("#ddlUserAccessType").val();

    form_data = new FormData();
    form_data.data = {};

    form_data.data.UserId = userid;
    form_data.data.DetailId= detailid;
    form_data.data.Permission= permission;
    form_data.data.AccessLevel= accesslevel;
     $.ajax({
        type: 'POST',
        url: '/execute_object_permission',
        dataType: 'json',
        data: {'req_data':JSON.stringify(form_data)},
        success: function (data, textStatus) {
            alert(data[0]["Result"]);
            location.reload(true);
        },
        error: function(xhr, status, e) {
            alert(status, e);
        }
    });
});