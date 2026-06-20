$("#ddlDomainObj").on("change",function(event){

if($("#ddlUserName")[0].selectedIndex<=0){
    alert("Please select User Name");
    $("#ddlDomainObj").prop('selectedIndex',0);
    return;
    }

    var userid=$("#ddlUserName").val();
    var id = $(this).val();
    var domain_obj_id=id.replace("ss_opt","");
    var field_list ='';
    $("#ss_field_list").empty();

    $.ajax({
                type: "GET",
                url: "/get_businessobj_fields",
                data: {'object_id': domain_obj_id},
                success: function (data) {
                        var field_data =JSON.parse(data);
                        var li_item = '';
                        for(var i=0; i<field_data.length;i++){
                           field_id=field_data[i]["FieldId"];
                           field_name = field_data[i]["FieldName"];
                           alias_name = field_data[i]["AliasName"];
                           li_item += '<div class="row row_maskencrypt" id=""><div class="col-3"><li class="selopt" id="ms_opt'+field_id+'" style="padding-left:10px;">'+alias_name+'</li></div><div class="col-3"><select class="form-control select2 table_maskencrypt" id="opt_'+field_id+'"><option value="" selected="">--Select--</option><option value="0">None</option><option value="1">Mask</option><option value="2">Encrypt</option></select></div></div>';
                        }
                        $("#ss_field_list").append(li_item);
                }
            }).done(function (done) {
                 get_mask_encryption_status(userid,domain_obj_id)
            });
    });

function get_mask_encryption_status(userid, detailid){
    $.get('/get_mask_encryption_details', {'userid': userid, 'detailid': detailid}, function(data) {
     debugger;
            var data=JSON.parse(data);
            var fields=[];

            if(data.length > 0){
                for(var i=0;i<data.length;i++){
                var v={};
                    v.id=data[i].FieldId;
                    v.sts=data[i].MaskEncryptStatus;
                    fields.push(v);
                }
            }

            $('.row_maskencrypt').each(function(){
                    fieldid = $(this).find('.selopt').attr('id').replace("ms_opt","");
                    debugger;
                    var sts = fields.find(x => x.id == fieldid)["sts"];
                    $(this).find('.table_maskencrypt').val(sts);
            })

  });
}


$("#btn_save_maskencrypt").on("click",function(event){

var field_list=[];
debugger;

$('.row_maskencrypt').each(function(){
var chkfield={};
chkfield.fieldid=$(this).find('.selopt').attr('id').replace("ms_opt","");
chkfield.stsid=$(this).find('.table_maskencrypt').val();
field_list.push(chkfield);
})

var userid=$("#ddlUserName").val();
var domain_obj_name= $("#ddlDomainObj option:selected").text();

form_data = new FormData();
form_data.data = {};

form_data.data.UserId = userid;
form_data.data.FieldList=[];
form_data.data.FieldList=field_list;

$.ajax({
        type: 'POST',
        url: '/save_maskencryptionstatus',
        dataType: 'json',
        data: {'req_data':JSON.stringify(form_data)},
        success: function (data, textStatus) {
            alert(data[0]["Message"]);
            window.location.href = "/maskencryption";
        },
        error: function(xhr, status, e) {
            alert(status, e);
        }
});
});

$("#ddlUserName").on("change",function(event){
    $("#ddlDomainObj").prop('selectedIndex',0);
    $("#ddlDomainObj").prop('selectedIndex',0);
    $("#ss_field_list").empty();
});