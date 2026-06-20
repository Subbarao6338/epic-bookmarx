$(document).ready(function () {
  // tasks to do after document got ready
  //functions call
  update_data_simulator_table();
  });

  function set_modal_body(templateId){
    var data={
        "templateId":templateId
    };
    $.ajax({
        type: "GET",
        url: "/get_complete_json",
        data: data
    }).then(function (response) {
        json_content = JSON.parse(response.template_models[0].Json)
        console.log(json_content)
       $("#modal_view").html("<pre>"+JSON.stringify(json_content,undefined,2)+"</pre>")
        // $("#modal_view").html(new JSONObject(response.template_models[0].Json).toString(2))
    })
  }



  function handleTemplateRemove(templateId){
  var result = confirm("Are sure you want to delete?");
if (result == true) {
     $.ajax({
        type: "DELETE",
        url: "/remove_template_model",
        data: JSON.stringify({templateId})
    }).then(function (response) {
       console.log(response)
       //confirm("Are you sure You want to delete the Template")
       load_template_table(response.template_models)
    })
}
  }

 function load_template_table(data){
  var html = '';
      $.each(data, function (index, value) {
        var display_json = value.Json;
        var actual_json = JSON.stringify(value.Json);
        if(actual_json.length > 200){
            display_json = display_json.substr(0, 200) +'...';
        }
        html+="<tr>";
        html+="<td style='border:1px solid black' >"+(index+1)+"</td>";
        html+="<td style='border:1px solid black' >"+value.TemplateName+"</td>";
        html+="<td style='border:1px solid black' >"+display_json+"</td>";
        html+=`<td style='border:1px solid black' >
        <button class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="set_modal_body('${value.TemplateId}')">View</button>
        <button class="btn btn-danger" onclick="handleTemplateRemove('${value.TemplateId}')">Remove</button>
        </td>`;
        html+="</tr>";
      });
      //finally insert into div
      $("#data_simulator_table").html(html);
 }

function update_data_simulator_table(data) {
  fetch("/get_template_models")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var response = data.template_models;
     load_template_table(response)
    })
    .catch((err) => {
      console.error(err);
    });
}