$(document).ready(function () {
  update_rel_models_table();
  handleRelSDVFormSubmit;
});

function update_rel_models_table(data) {
  fetch("/get_rel_sdv_models")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.sdv_models);
      data = data.sdv_models;
      //create table
      table_head = ["SL", "Start Time", "Model Name", "End Time", "Status", "Sample New Data"];
      var html = "<table class='table'>";
      html += "<thead><tr class='bg-light'>";
      $.each(table_head, function (index, value) {
        html += "<th>" + value + "</th>";
      });
      html += "</thead></tr><tbody>";
      $.each(data, function (index, row) {
        html += "<tr>";
        html += `<td> ${index + 1} </td>`;
        html += `<td> ${row.start_time}</td>`;
//        html += `<td><a href='/download_rel_sdv_file?filetype=temp_files&filename=${row.train_file}' download>${row.train_file}</a></td>`;
        html += `<td><a href='/download_rel_sdv_file?filetype=sdv_models&filename=${row.sdv_model}' download>${row.sdv_model}</a></td>`;
        html += `<td>${row.end_time}</td>`;
        html += `<td class='text-success'>${row.status}</td>`;
        html += `<td><a href='/download_rel_sdv_file?filetype=new_files&filename=synthesized_transactions.json' download>download</a></td>`;
        html += `<td><a href='http://127.0.0.1:8000/generate'>link</a></td>`;
        html += "<tr>";
      });
      html += "</tbody></table>";
      $("#rel_sdv_models_table").html(html);
    })
    .catch((err) => {
      console.error(err);
    });
}

$("#rel_sdv_model_training_form").submit(function handleRelSDVFormSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
//  formData['checked_values']
  //disable submit button
  $("#rel_sdv_model_training_form button").prop("disabled", true);
  //show progress
  var width = 10;
  $(".progress_detail").removeClass("d-none");
  progressInterval = setInterval(() => {
    width += 2;
    $(".progress_detail .progress-bar").css({ width: width + "%", "background-color": "#0d6efd" });
    $(".progress_detail .progress-bar").html(width + "%");
    if (width >= 90) clearInterval(progressInterval);
  }, 200);
  //insert top row in tables table
  var html = "<tr>";
  html += "<td>*</td>";
  html += "<td>" + new Date().toLocaleString() + "</td>";
//  html += "<td></td>";
  html += "<td></td>";
  html += "<td></td>";
  html += "<td class='text-primary'> in-progress </td>";
  html += "<td></td>";
  html += "</tr>";
  $("#rel_sdv_models_table table tbody").prepend(html);

  //make post request
  fetch("/rel_sdv_model_training", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      update_rel_models_table();
      //Enable Submit button
      $("#rel_sdv_model_training_form button").removeAttr("disabled");
      //make progress 100%
      clearInterval(progressInterval);
      $(".progress_detail .progress-bar").css({ width: "100%", "background-color": "green" });
      $(".progress_detail .progress-bar").html("100% Done");
    })
    .catch((err) => {
      console.error(err);
    });
});

function HandleBack() {
  window.history.go(-1);
}

function view_sample_json(name){
    var data={
        "name":name
    };
    $.ajax({
        type: "GET",
        url: "/get_metadata_json",
        data: data
    }).then(function (response) {
        console.log(response.template_models)
        json_content = (response.template_models)
        console.log(json_content)
       $("#modal_view").html("<pre>"+JSON.stringify(json_content,undefined,2)+"</pre>")
        // $("#modal_view").html(new JSONObject(response.template_models[0].Json).toString(2))
    })
  }

function view_uploaded_json(name){
//    document.getElementById("display_image").src = '/static_file?f_name=' + name;
    document.getElementById("exampleModalLabel1").innerHTML = name;
    var data={
        "name":name
    };
    $.ajax({
        type: "GET",
        url: "/get_uploaded_json",
        data: data
    }).then(function (response) {
        console.log(response.template_models)
        json_content = (response.template_models)
//        console.log(json_content)
       $("#modal_view1").html("<pre>"+JSON.stringify(json_content,undefined,2)+"</pre>")
        // $("#modal_view").html(new JSONObject(response.template_models[0].Json).toString(2))
    })
  }
function func(){
  var x = document.getElementById("files");
  const selectedFiles = x.files;
  var txt = "yess";
  let table = document.createElement('table1');
  let tbody = document.createElement('tbody');
  table.appendChild(tbody);
  document.getElementById("uploaded_files_list").appendChild(table);
  for (const f of selectedFiles) {
//    txt +=  f.name + "<br>";
    let blank_row = document.createElement('tr');
    tbody.appendChild(blank_row);
    let row = document.createElement('tr');
    let name_data = document.createElement('td');
    name_data.innerHTML = `<a style="color:blue" type="button" onclick="view_uploaded_json('${f.name}');" data-bs-toggle="modal" data-bs-target="#exampleModal1"><u>${f.name}</u></a>`
    let select_table_check = document.createElement('td');
    let checkbox_table = `<input
                  type="checkbox"
                  id="checkbox_${f.name}"
                  name="select_${f.name}"
        />`
    select_table_check.innerHTML = checkbox_table;
    row.appendChild(name_data);
    row.appendChild(select_table_check);
    tbody.appendChild(row);

}
console.log(txt)

//  var file_ls=document.createElement("a");
//    file_ls.innerHTML="Click";
//    file_ls.style="color:blue";
//    file_ls.itype="button";
//    file_ls.onclick="view_uploaded_json(" + file.name + ")";
//    file_ls.data-bs-toggle="modal"
//    file_ls.data-bs-target="#exampleModal"


//    document.getElementById("uploaded_files_list").appendChild( file_ls );
//  document.getElementById("uploaded_files_list").innerHTML = txt;
//  document.getElementById("uploaded_files_list").insertAdjacentHTML("afterend", txt);
}