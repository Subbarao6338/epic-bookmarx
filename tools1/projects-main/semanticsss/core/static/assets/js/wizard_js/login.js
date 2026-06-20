$(".btn_sign_in").on("click", function(){
    var user_name = $("#txt_user_name").val();
    var password = $("#txt_password").val();
    $.get('/is_authenticated', {'user_name':user_name, 'password':password}, function(data) {
            if(data=='Success'){
                window.location.href='home'
            }else{
                alert("Please enter valid credential.")
            }
    });
});