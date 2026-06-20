$(document).on('show.bs.modal', '#exampleModal', function (e) {
    $("#inputPasswordOld").val("");
    $("#inputPasswordNew").val("");
    $("#inputPasswordNewVerify").val("");
});
$("#btnChangePassword").on("click", function(event){
debugger;
    var old_pass = $("#inputPasswordOld").val();
    var new_pass= $("#inputPasswordNew").val();
    var confirm_pass = $("#inputPasswordNewVerify").val();
    if (new_pass != confirm_pass){
            $("#CheckPasswordMatch").html("Passwords does not match!");

    }
     else{
           // $("#CheckPasswordMatch").html("Passwords match.");
            obj={}
            obj.old_pass = old_pass;
            obj.new_pass = new_pass;

            $.ajax({
                    type: 'POST',
                    url: '/change_login_password',
                    dataType: 'json',
                    data: {'obj':JSON.stringify(obj)},
                    success: function (data, textStatus) {
                        if(data=="Success"){
                            alert("Password changed successfully.");
                            $("#btncancel").trigger("click");
                            $("#overlay").hide();
                            $(".modal-backdrop").hide();
                        }else{
                            alert("Please enter correct current password.");
                        }
                    },
                    error: function(xhr, status, e) {
                        alert(status, e);
                    }
                });


     }

});