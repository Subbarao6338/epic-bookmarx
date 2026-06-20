var uploaded_file_path = "";
var uploaded_file_path_list_for_rel = [];
var uploaded_metadata_file_path = "";
var data_set_type = "";
var view_button_for_file = "";
var remove_row_index = [];

$(document).ready(function () {
  update_rel_models_table();
  update_models_table();
});

function update_rel_models_table() {
  fetch("/get_rel_sdv_models")
    .then((response) => response.json())
    .then((data) => {
      data = data.sdv_models;
      //create table
      table_head = ["S.No",  "Input File", "Model Name", "Start Time","End Time", "Status", "Verification Results","Action"];
      var html = "<table class='table'>";
      html += "<thead><tr class='bg-light'>";
      $.each(table_head, function (index, value) {
        html += "<th>" + value + "</th>";
      });
      html += "</thead></tr><tbody>";
      $.each(data, function (index, row) {
      if(row.status=='completed'){
        var sdv_model_name_str= row.sdv_model;
        if(sdv_model_name_str.length > 15)
       {
        sdv_model_name_str=  sdv_model_name_str.substring(0,15)+".....";
       }
       var meta_file_name_str=row.meta_file;
        if(meta_file_name_str.length>15)
        {
           meta_file_name_str=meta_file_name_str.substring(0,15)+"...";
        } 
        html += "<tr>";
        html += `<td style="width:2%"> ${index + 1} </td>`;
        html += `<td style="width:15%; text-align:left""><a href='/download_rel_sdv_file?filetype=metadata&filename=${row.meta_file}' download title=${row.meta_file}>${meta_file_name_str}</a></td>`;
        html += `<td style="width:15%; text-align:left""><a href='/download_sdv_file?filetype=sdv_models&filename=${row.sdv_model}'   download title=${row.sdv_model}>${sdv_model_name_str}</a></td>`;
        html += `<td style="width:15%; text-align:left""> ${row.start_time.split('.')[0]}</td>`;
        html += `<td style="width:15%; text-align:left"">${row.end_time}</td>`;
        html += `<td style="width:10%; text-align:left"" class='text-success'>${row.status}</td>`;
        html += `<td style="width:7%"><a href='/download_rel_sdv_file?filetype=new_files&filename=result.zip' download><i class="fa fa-download" aria-hidden="true"></i></a></td>`;
        html += `<td style="width:15%">
                <button class="btn btn-primary me-2" id="tbl_generate_button" onclick="load_popup_control('${row.sdv_model}')" data-toggle="modal" data-target="#display_gen_data_Modal">
                    <i class="fa fa-recycle" aria-hidden="true"></i>
                </button>
                <button class="btn btn-danger me-2 delete_record" onclick="delete_relational_sdv_model('${row.sdv_model}')" title="Delete model"><i class="fa fa-trash" aria-hidden="true"></i></i></button>
            </td>`;

        html += "<tr>";
        }
      else{
        html += "<tr>";
        html += `<td style="width:2%"> ${index + 1} </td>`;
        html += `<td style="width:18%; text-align:left"> ${row.start_time.split('.')[0]}</td>`;
        html += `<td style="width:18%">--</td>`;
        html += `<td style="width:15%">--</td>`;
        html += `<td style="width:15%">--</td>`;
        html += `<td style="width:10%; text-align:left" class='text-danger'>failed</td>`;
        html += `<td style="width:7%">--</td>`;
        html += `<td style="width:15%">
                <button class="btn btn-danger me-2 delete_record" onclick="delete_relational_sdv_model('${row.sdv_model}')" title="Delete model"><i class="fa fa-trash" aria-hidden="true"></i></button>
            </td>`;
        html += "<tr>";
        }
      });
      html += "</tbody></table>";
      $("#rel_sdv_models_table").html(html);
//      $("#tbl_generate_button").on('click', function(){
//        $("#txt_data_set_type").val(data_set_type);
//        var sel_modal_name = $(this).attr("model_name_attr");
//        $("#select_model").val(sel_modal_name);
//      });
    })
    .catch((err) => {
      console.error(err);
    });
}

function delete_relational_sdv_model(model_name){
    var formData = new FormData();
    formData.append("model_name", model_name);
    $.ajax({
        type: "POST",
        url: "/remove_relational_sdv_model",
        contentType: false,
        processData: false,
        data: formData
    }).then(function (response){
          alert(response.message);
          update_rel_models_table();
    })
    .catch((err) => {
      console.error(err);
    });
}

let all_columns = {};
let masking_json_keys_global = {};
var rel_mask_columns = [];
function submit_rel(e){
    rel_mask_columns = [];
//$("#rel_sdv_model_training_form").submit(function handleRelSDVFormSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  console.log(formData);
//  formData['checked_values']
  //disable submit button
  $("#rel_sdv_model_training_form button").prop("disabled", true);


  //make post request
  fetch("/rel_sdv_model_training", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        $("#overlay").css("display","none");
      let file_name_list1 = data['data'];
      let file_columns_list1 = data['columns_list']
      let file_name_list = file_name_list1['data'];
      let file_columns_list = file_columns_list1['data'];
      masking_json_keys_global['masking_types'] = data['masking_type_list'];
      uploaded_file_path_list_for_rel = data['file_paths']['data'];
      uploaded_metadata_file_path = data['meta_file_path'];
      $("#file_list_content_body").empty();
      for (let i=0; i< file_name_list.length; i++){
        all_columns[i] = file_columns_list[i];
        var html = "<tr>";
        html += '<td id="file_name_'+i+'">' + file_name_list[i] + "</td>";
        html += '<td id="view_'+i+'">';
        html += '<a style="color:white" type="button" onclick="view_uploaded_json_columns(' + i + ')" class="btn btn-primary" id="id_' + file_name_list[i] +'" data-toggle="modal" data-target="#Mylargemodal_for_rel">View</a></td></tr>';
        $("#file_list_content_body").append(html);
      }

        $("#launch_file_list_button").trigger("click");

//      update_rel_models_table();
      //Enable Submit button
      $("#rel_sdv_model_training_form button").removeAttr("disabled");

    })
    .catch((err) => {
      console.error(err);
    });
};

function view_sample_metadata_json(name){
    var data={
        "name":name
    };
    $.ajax({
        type: "GET",
        url: "/get_metadata_json",
        data: data
    }).then(function (response) {
        json_content = (response.template_models);
       $("#model-view-sample-meta").html("<pre>"+JSON.stringify(json_content,undefined,2)+"</pre>");
       $("#launch_button_sample_metadata").trigger('click');
        // $("#modal_view").html(new JSONObject(response.template_models[0].Json).toString(2))
    })
  }

function view_uploaded_json_columns(name){
//    document.getElementById("display_image").src = '/static_file?f_name=' + name;
    view_button_for_file = name;
    let masking_json_keys = masking_json_keys_global['masking_types']['masking_type_list'];
    $('#json_content_body_rel').empty();
    for (let j=0; j< all_columns[name].length; j++){
        var html2 = "<tr>";
            html2 += '<td id="prop_name_'+j+'">' + all_columns[name][j] + "</td>";
            html2 += '<td id="prop_type_'+j+'">';
            html2 += '<select class="form-select" id="type_'+j+'">';
            html2 += '<option value="" selected>No Masking Selected</option>';

            for (let i=0; i < masking_json_keys.length; i++) {
            html2 += '<option value="' + masking_json_keys[i] + '">' + masking_json_keys[i] + '</option>';
          }
            html2 += '</select>'
            html2 += '</td>';
             $("#json_content_body_rel").append(html2);
            }

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

function update_models_table() {
  fetch("/get_sdv_models")
    .then((response) => response.json())
    .then((data) => {
    $("input[name=radio][value='Single']").prop("checked",true).trigger("change");
      data = data.sdv_models;
      //create table
      table_head = ["S.No","Input File", "Model Name", "Start Time",  "End Time", "Status", "Results","Action"];
      var html = "<table class='table'>";
      html += "<thead><tr class='bg-light'>";
      $.each(table_head, function (index, value) {
        html += "<th>" + value + "</th>";
      });
      html += "</thead></tr><tbody>";
      $.each(data, function (index, row) {
      if(row.status=="completed"){
        var train_file_name_str = row.train_file;
        if(train_file_name_str.length > 15){
          train_file_name_str = train_file_name_str.substring(0,15)+"...";
        }
           var sdv_model_name_str= row.sdv_model;
          if(sdv_model_name_str.length > 15)
         {
          sdv_model_name_str=  sdv_model_name_str.substring(0,15)+".....";
         }

        html += "<tr>";
        html += `<td style="width:2%"> ${index + 1} </td>`;
        html += `<td style="width:18%; text-align:left"><a href='/download_sdv_file?filetype=temp_files&filename=${row.train_file}'  download title=${row.train_file} >${train_file_name_str}</a></td>`;
        html += `<td style="width:18%; text-align:left"><a href='/download_sdv_file?filetype=sdv_models&filename=${row.sdv_model}'   download title=${row.sdv_model}>${sdv_model_name_str}</a></td>`;
      //html += `<td><a href='/download_sdv_file?filetype=sdv_models&filename=${row.sdv_model}' download>${row.sdv_model}</a></td>`;
        html += `<td style="width:15%; text-align:left"> ${row.start_time.split('.')[0]}</td>`;
        html += `<td style="width:15%; text-align:left">${row.end_time}</td>`;
        html += `<td style="width:10% text-align:left !important" class='text-success'>${row.status}</td>`;
        html += `<td style="width:7%"><a title="Download verification result" href='/download_sdv_file?filetype=new_files&filename=new_${row.train_file}' download><i class="fa fa-download" aria-hidden="true"></i></a></td>`;
        html += `<td style="width:15%">
                    <button title="Generate synthetic data using this model" class="btn btn-primary me-2" model_name_attr="${row.sdv_model}" onclick="load_popup_control('${row.sdv_model}')" id="tbl_generate_button" data-toggle="modal" data-target="#display_gen_data_Modal">
                        <i class="fa fa-recycle" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-danger me-2 delete_record" onclick="delete__single_sdv_model('${row.sdv_model}')" title="Delete model"><i class="fa fa-trash" aria-hidden="true"></i></button>
                </td>`;
        html += "<tr>";
        }
        else {
        html += "<tr>";
        html += `<td style="width:2%"> ${index + 1} </td>`;
        html += `<td style="width:18%; text-align:left"><a href='/download_sdv_file?filetype=temp_files&filename=${row.train_file}' download>${row.train_file}</a></td>`;
        html += `<td style="width:18%; text-align:left">${row.sdv_model}</td>`;
        html += `<td style="width:15%; text-align:left"> ${row.start_time.split('.')[0]}</td>`;
        html += `<td style="width:15%">--</td>`;
        html += `<td style="width:10%" class='text-primary' data-toggle="modal" data-target="#progress_bar" onclick="progress_bar()" nowrap >${row.status}<img class='ms-1' src = '../static/assets/images/info.png' width='10' height='10'></img></td>`;
        html += `<td style="width:7%">--</td>`;
        html += `<td style="width:15%">
                    <button class="btn btn-danger me-2 delete_record" onclick="delete__single_sdv_model('${row.sdv_model}')" title="Delete model"><i class="fa fa-trash" aria-hidden="true"></i></button>
                </td>`;
        html += "<tr>";
        }
      });
      html += "</tbody></table>";
      $("#sdv_models_table").html(html);
//      $("#tbl_generate_button").on("click", function(){
//        $("#txt_data_set_type").val(data_set_type);
//        var sel_modal_name = $(this).attr("model_name_attr");
//        $("#select_model").val(sel_modal_name);
//      });
    })
    .catch((err) => {
      console.error(err);
    });
}
function handle_show_progress(id){
alert(id)
}

function delete__single_sdv_model(model_name){
    var formData = new FormData();
    formData.append("model_name", model_name);
    $.ajax({
        type: "POST",
        url: "/remove_single_sdv_model",
        contentType: false,
        processData: false,
        data: formData
    }).then(function (response){
          alert(response.message);
          update_models_table();
    })
    .catch((err) => {
      console.error(err);
    });
}

function load_popup_control(modal_name){
    $("#txt_data_set_type").val(data_set_type);
    $("#select_model").val(modal_name);
}



$("#sdv_model_training_form").submit(function(e) {
  e.preventDefault();
  $("#overlay").css("display","block");
  const formData = new FormData(e.target);
  if(formData.get('radio')=='Relational'){
    submit_rel(e);
  }
  else{
//        alert("yes")
      //disable submit button
//      document.getElementById("launch_button").style.display = "";
//      document.getElementById("model-view").innerHTML = "YESS";

      $("#sdv_model_training_form button").prop("disabled", true);

      //make post request
      fetch("/model_training", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
            if(data.status === "failed"){
            $("#overlay").css("display","none");
                window.alert(data.error)
                return
            }
            $("#overlay").css("display","none");
          uploaded_file_path = data['file_path'];
          var uploaded_data_length = data['file_length'];
          if(parseInt(uploaded_data_length) <=10){
            alert("Records in uploaded file should be greater than 10.");
            return;
          }
          let arr = data['json_key_list'];
          $("#json_content_body").empty();
          for (let i = 0; i < arr.length; i++) {
            var html = "<tr>";
            html += '<td id="prop_name_'+i+'">' + arr[i] + "</td>";
            html += '<td id="prop_type_'+i+'">';
            html += '<select class="form-select" id="type_'+i+'">';
            html += '<option value="" selected>No Masking Selected</option>';

          let masking_json_keys = data['masking_type_list'];
          for (let i=0; i < masking_json_keys.length; i++) {
            html += '<option value="' + masking_json_keys[i] + '">' + masking_json_keys[i] + '</option>';
          }
            html += '</select>'
            html += '</td>';
             $("#json_content_body").append(html);
            }
          update_models_table();
          //Enable Submit button
          $("#sdv_model_training_form button").removeAttr("disabled");

          $("#launch_button").trigger("click");
        })
        .catch((err) => {
          console.error(err);
        });
}});

function HandleBack() {
  window.history.go(-1);
}

$('input[type=radio][name="radio"]').change(function() {
    var width=10;

    document.querySelector('.progress_detail').style.display = "none";
    $(".progress_detail .progress-bar").css({ width: width + "%", "background-color": "#0d6efd" });
    $(".progress_detail .progress-bar").html(width + "%");
    document.getElementById('progress_status').innerHTML = "Model Training in Progress..";
    document.getElementById('progress_status').style.color = "gray";
//    document.getElementById('model_name').value = "";


    data_set_type = $(this).val();
//    var list = document.getElementById("for_multiple");
////     console.log(list.childNodes.length);
//     while (list.hasChildNodes()) {
//        list.removeChild(list.firstChild);
////     }
//     var list1 = document.getElementById("for_single");
////     console.log(list.childNodes.length);
//     while (list1.hasChildNodes()) {
//        list1.removeChild(list1.firstChild);
//     }

    if ($(this).val() == 'Single') {
//         document.getElementById('for_single').removeChild('div');
//        $(".progress_detail").prop('class',"d-none");
//         let form_id = document.getElementsByTagName('form')[0].getAttribute("id");
//         if(form_id=='rel_sdv_model_training_form'){
//            document.getElementsByTagName('form')[0].setAttribute("id", "sdv_model_training_form");
//         }
         document.getElementById('for_multiple').style.display = "none";
         document.getElementById('for_single').style.display = "";
       //  document.getElementById('for_meta_file').style.display = "none";
         document.getElementById('rel_sdv_models_table').style.display = "none";
         document.getElementById('sdv_models_table').style.display = "";

         let div = document.createElement('div');
         div.className = "mb-3";

         let div1 = document.createElement('div');
         div1.className = "mb-3";

        //  let label1 = document.createElement('label');
        //  label1.className = "form-label";
        //  label1.innerHTML = "<div style='margin-top: 10px;'>Upload Sample Data File (csv, json)</div>";
        //  div1.appendChild(label1);

        //  let input1 = document.createElement('input');
        //  input1.required = true;
        //  input1.name = "sdv_train_file";
        //  input1.className = "form-control";
        //  input1.type = "file";
        //  input1.accept = ".csv, .json";
        //  div1.appendChild(input1);

         div.appendChild(div1);
//         let br = document.createElement('br')
//         document.getElementById('for_single').appendChild(br);

         let div2 = document.createElement('div');
         div2.className = "center";

         var button1 = document.createElement('input');
         button1.className = "btn btn-primary";
         button1.type = "submit";
//         button2.setAttribute("data-toggle","model");
//         button2.setAttribute("data-target","#Mymodel");
//         button1.data-toggle = "model";
//         button1.data-target = "#Mymodal";
         div2.appendChild(button1);

         var button2 = document.createElement('input');
         button2.className = "btn btn-primary";
         button2.type = "button";
         button2.setAttribute("onclick","HandleBack()");
         button2.setAttribute("value","Back");
//         button2.innerHTMl = "Back";
         div2.appendChild(button2);

         div.appendChild(div2);
         $('#single_multiple').html(div);
//         document.getElementById('single_multiple').innerHTML = div;
//         div_ele.innerHTML = `
//          <div class="mb-3">
//            <label class="form-label">Train file (csv, json)</label>
//            <input required name="sdv_train_file" class="form-control" type="file" accept=".csv, .json" />
//          </div>
//          <div class="mb-3">
//            <button type="submit" class="btn btn-primary">Submit</button>
//            <button type="button" class="btn btn-primary" onclick="HandleBack()">Back</button>
//          </div>`
    }if ($(this).val() == 'Relational'){
//         list.remove();
//         list.removeChild(list.childNodes[0]);
//         let form_id = document.getElementsByTagName('form')[0].getAttribute("id");
//         if(form_id=='sdv_model_training_form'){
//            document.getElementsByTagName('form')[0].setAttribute("id", "sdv_model_training_form");
//         }
         document.getElementById('for_single').style.display = "none";
         document.getElementById('for_multiple').style.display = "";
        // document.getElementById('for_meta_file').style.display = "none";
         $(".progress_detail").removeClass("d-none");rel_sdv_models_table
         document.getElementById('sdv_models_table').style.display = "none";
         document.getElementById('rel_sdv_models_table').style.display = "";

         let div_main = document.createElement('div');

         let div_train = document.createElement('div');
         div_train.class = "mb-3";

        //  let label_train = document.createElement('label');
        //  label_train.className = "form-label";
        //  label_train.innerHTML = "Upload Sample Data Files (csv, json)";
//          div_train.appendChild(label_train);

        //  let input_train = document.createElement('input');
        //  input_train.required = true;
        //  input_train.multiple = true;
        //  input_train.name = "rel_sdv_train_file";
        //  input_train.className = "form-control";
        //  input_train.type = "file";
        //  input_train.accept = ".csv, .json";
        //  div_train.appendChild(input_train);

         div_main.appendChild(div_train);
//         let br = document.createElement('br');
//         div_main.appendChild(br);

         let div_meta = document.createElement('div');
         div_meta.className = "mb-3";
         div_meta.id = "for_metadata_only";

         let label_meta = document.createElement('label');
         label_meta.className = "form-label";
         label_meta.innerHTML = "Upload Metadata File (json)";

//         let input_meta = document.createElement('input');
//         input_meta.required = true;
//         input_meta.name = "metadata_file";
//         input_meta.className = "form-control";
//         input_meta.type = "file";
//         input_meta.accept = ".csv, .json";

         let p = document.createElement('p');
         p.innerHTML = "Sample Metadata File : ";
         let a = document.createElement('a');
         a.style.color="blue";
         a.type = "button";
         a.innerHTML = "metadata.json"
         a.setAttribute('onclick',"view_sample_metadata_json('sample_metadata.json')");
//         p.innerHTML = `<a style="color:blue" type="button" onclick="view_uploaded_json('${f.name}');" data-bs-toggle="modal" data-bs-target="#exampleModal1"><u>${f.name}</u></a>`
         a.setAttribute('data-bs-toggle',"model");
         a.setAttribute('data-bs-target',"#exampleModal");
//         let u = document.createElement('u');
//         u.innerHTMl = "metadata.json";
//         a.appendChild(u);
         p.appendChild(a);
//         div3.appendChild(p)

//        div_meta.insertBefore(p, div_meta.children[0]);
//        div_meta.insertBefore(input_meta, div_meta.children[0]);
//        div_meta.insertBefore(label_meta, div_meta.children[0]);
        div_meta.appendChild(label_meta);
//        div_meta.appendChild(input_meta);
        div_meta.appendChild(p);
//        div_show = document.getElementById('exampleModal');
//        div_meta.appendChild(div_show);


        div_main.appendChild(div_meta);

         let div_button = document.createElement('div');
         div_button.className = "center";

         var button11 = document.createElement('input');
         button11.className = "btn btn-primary";
         button11.type = "submit";
         div_button.appendChild(button11);

         var button22 = document.createElement('input');
         button22.className = "btn btn-primary";
         button22.type = "button";
         button22.setAttribute("onclick","HandleBack()");
         button22.setAttribute("value","Back");
//         button2.innerHTMl = "Back";
         div_button.appendChild(button22);

         div_main.appendChild(div_button);
         $('#single_multiple').html(div_main);

    }
});
var uploaded_data_col = [];
var col_list_all = [];
var remove_row = false;
var added_record = [];
$("#next-button").on("click", function(){
    $("#overlay").css("display","block");
    masking_col_array = [];
    var data = new FormData();
    var t_data=$("#json_property_table tbody tr").map(function() {
          var $cells = $(this).children();
          var sel_type = $cells.eq(1).find('select option:selected').text();
          if(sel_type != "No Masking Selected"){
              return {
                 propsName: $cells.eq(0).text(),
                 type: $cells.eq(1).find('select option:selected').text()
              };
          }
     });
    masking_col_array = t_data.toArray();
    $(".close_schema_popup").trigger("click");
    show_anonymized_data();
});

function show_anonymized_data(){
    var data = new FormData();
    data.append('selected_data',JSON.stringify(masking_col_array));
    data.append('file_path', uploaded_file_path);
    data.append('page_number', 0);
    data.append('page_size', 10);
    $.ajax({
        type: "POST",
        url: "/get_anonymized_data",
        contentType: false,
        processData: false,
        data: data
    }).then(function (response) {
        var data={
        "file_path":uploaded_file_path
        };
        $.ajax({
            type: "GET",
            url: "/get_total_rows_count",
            data: data
        }).then(function (result) {
            debugger;
            $("#overlay").css("display","none");
            $("#display_data_content").empty();
            remove_row_index = [];
            var divContainer = document.getElementById("display_data_content");
            divContainer.innerHTML = "";
            uploaded_data_col = [];
            for (var i = 0; i < response.length; i++) {
                for (var key in response[i]) {
                    if (uploaded_data_col.indexOf(key) === -1) {
                        uploaded_data_col.push(key);
                    }
                }
            }
            var html = '<table id="tbl1" class="display table table-bordered"><thead><tr><th style="display:none;">index</th>';
            for (var i = 0; i < uploaded_data_col.length; i++) {
                html += '<th>'+ uploaded_data_col[i] + '</th>';
            }
            html+='<th>Action</th></tr></thead><tbody>'
            for (var i = 0, len = response.length; i < len; ++i) {
                html += '<tr><td style="display:none;">'+ i.toString() +'</td>';
                for (var j = 0, rowLen = uploaded_data_col.length; j < rowLen; ++j) {
                    html += '<td>' + response[i][uploaded_data_col[j]] + '</td>';
                }
                html += '<td><i class="fa fa-trash remove_record" index_attr="'+i.toString()+'"/></td></tr>';
            }
            html += '</tbody></table>';
            $(html).appendTo('#display_data_content');
            if(!is_addition){
                $("#display_anonymized_data").trigger("click");
            }
            $("#pagination_container").empty();
            var divContainer = document.getElementById("pagination_container");
            divContainer.innerHTML = "";
            $(".pagination").append(
                $("<li>").addClass("page-item").attr({ id: "previous-page" }).append(
                    $("<a>").addClass("page-link").attr({
                        href: "javascript:void(0)"}).text("Prev")
                ),
                $("<li>").addClass("page-item").attr({ id: "next-page" }).append(
                    $("<a>").addClass("page-link").attr({
                        href: "javascript:void(0)"}).text("Next")
                )
            );
            var numberOfItems = parseInt(result.total_count);
            var limitPerPage = 10;
            totalPages = Math.ceil(numberOfItems / limitPerPage);
            showPage(1);
            $("#next-page").on("click", function () {
                if(currentPage+1 > totalPages){
                    return false;
                }else{
                    currentPage = currentPage+1;
                    bind_paginated_list_view();
                }
            });
            $(document).on("click", ".pagination li.current-page:not(.active)", function () {
                currentPage = +$(this).text();
                bind_paginated_list_view();
            });
            $("#previous-page").on("click", function () {
                if(currentPage-1 < 1){
                    return false;
                }else{
                    currentPage = currentPage - 1;
                    bind_paginated_list_view();
                }
            });
            $("#tbl1 tr").click(function(){
                $(this).addClass('selected').siblings().removeClass('selected');
                delete_row_index=$(this).find('td:first').html();
            });
            $(".remove_record").on("click", function(){
                remove_row = true;
                var attr_val = $(this).attr('index_attr');
                delete_row_index = attr_val;
                $('#remove_row_button').trigger('click');
            });
            is_addition = false;
        });
    });
}

$('#remove_row_button').click( function () {
    remove_record_from_table_single();
});

function remove_record_from_table_single(){
    is_addition = true;
    remove_row_index = [];
    remove_row_index.push(parseInt(delete_row_index)+1);
    var data = new FormData();
    data.append('file_path', uploaded_file_path);
    data.append('remove_indexes', JSON.stringify(remove_row_index));
    debugger;
     $.ajax({
        type: "POST",
        url: "/remove_record_from_file",
        contentType: false,
        processData: false,
        data: data
    }).then(function (response){
          alert(response.message);
          show_anonymized_data();
    })
    .catch((err) => {
      console.error(err);
    });
}

var delete_row_index;

function bind_paginated_list_view(){
    var data = new FormData();
    data.append('selected_data',JSON.stringify(masking_col_array));
    data.append('file_path', uploaded_file_path);
    data.append('page_number', currentPage);
    data.append('page_size', page_size);
    $.ajax({
        type: "POST",
        url: "/get_anonymized_data",
        contentType: false,
        processData: false,
        data: data
    }).then(function (response) {
        debugger;
        $("#tbl1 > tbody").html("");
        var html="";
        for (var i = 0, len = response.length; i < len; ++i) {
            html += '<tr>';
            for (var j = 0, rowLen = uploaded_data_col.length; j < rowLen; ++j) {
                html += '<td>' + response[i][uploaded_data_col[j]] + '</td>';
            }
            html += '<td><i class="fa fa-trash remove_record"/></td></tr>';
        }
        $("#tbl1 > tbody").html(html);
        return showPage(currentPage);
    });
}
var paginationSize = 7;
var currentPage;
var totalPages;
var page_size = 10;
function showPage(whichPage) {
    if (whichPage < 1 || whichPage > totalPages) return false;
    currentPage = whichPage;
    // Replace the navigation items (not prev/next):
    $(".pagination li").slice(1, -1).remove();
    getPageList(totalPages, currentPage, paginationSize).forEach( item => {
        $("<li>").addClass("page-item")
                 .addClass(item ? "current-page" : "disabled")
                 .toggleClass("active", item === currentPage).append(
            $("<a>").addClass("page-link").attr({
                href: "javascript:void(0)"}).text(item || "...")
        ).insertBefore("#next-page");
    });
    // Disable prev/next when at first/last page:
    $("#previous-page").toggleClass("disabled", currentPage === 1);
    $("#next-page").toggleClass("disabled", currentPage === totalPages);
    return true;
}

function getPageList(totalPages, page, maxLength) {
    if (maxLength < 5) throw "maxLength must be at least 5";

    function range(start, end) {
        return Array.from(Array(end - start + 1), (_, i) => i + start);
    }

    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth*2 - 3) >> 1;
    var rightWidth = (maxLength - sideWidth*2 - 2) >> 1;
    if (totalPages <= maxLength) {
        // no breaks in list
        return range(1, totalPages);
    }
    if (page <= maxLength - sideWidth - 1 - rightWidth) {
        // no break on left of page
        return range(1, maxLength - sideWidth - 1)
            .concat(0, range(totalPages - sideWidth + 1, totalPages));
    }
    if (page >= totalPages - sideWidth - 1 - rightWidth) {
        // no break on right of page
        return range(1, sideWidth)
            .concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
    }
    // Breaks on both sides
    return range(1, sideWidth)
        .concat(0, range(page - leftWidth, page + rightWidth),
                0, range(totalPages - sideWidth + 1, totalPages));
}

function get_total_rows_count(file_path){
    var data={
        "file_path":file_path
    };
    $.ajax({
        type: "GET",
        url: "/get_total_rows_count",
        data: data
    }).then(function (response) {

    })
}

$("#add_row_button").on("click", function(){
    add_record_to_table_single();
});
var is_addition = false;
function add_record_to_table_single(){
    var html = '';
    var html = '<tr>';
    for (var i = 0, rowLen = uploaded_data_col.length; i < rowLen; ++i) {
        html += '<td><input type="text"/></td>';
    }
    html += '<td><i class="fa fa-play add_record"/></td></tr>';
    $("#tbl1 tbody").prepend(html);
    $(".add_record").on("click", function(){
        is_addition = true;
        var added_record = [];
//        var add_row = [];
        var entered_obj = {};
        for (var i = 0, rowLen = uploaded_data_col.length; i < rowLen; ++i) {
//            var add_val = $($(this).parents('tr').children()[i]).children('input').val();
//            add_row.push(add_val);
            var entered_val = $($(this).parents('tr').children()[i]).children('input').val();
            entered_obj[uploaded_data_col[i]] = entered_val;
        }
        added_record.push(entered_obj);
//        add_row.push('<i class="fa fa-trash remove_record"/>');
//        console.log(add_row);
//        var added_html = '<tr>';
//        for(var i=0, col_len = add_row.length; i<col_len; ++i){
//            added_html += "<td>"+add_row[i]+"</td>"
//        }
//        added_html +='</tr>'
//        $('#tbl1 tbody tr:first').remove();
//        $('#tbl1 tbody').prepend($(added_html));
        save_added_row_in_uploaded_file(added_record);
    });
}

function save_added_row_in_uploaded_file(added_record){
    var data = new FormData();
    data.append('file_path', uploaded_file_path);
    data.append('added_records', JSON.stringify(added_record));
    debugger;
     $.ajax({
        type: "POST",
        url: "/add_records_to_file",
        contentType: false,
        processData: false,
        data: data
    }).then(function (response){
        alert(response.message);
        show_anonymized_data();
    })
    .catch((err) => {
      console.error(err);
    });
}

function add_record_to_table(uploaded_data_col){
    var html = '';
    var html = '<tr><td style="display:none;"><input type="text" value="-1"/></td>';
    for (var i = 0, rowLen = uploaded_data_col.length; i < rowLen; ++i) {
        html += '<td><input type="text"/></td>';
    }
    html += '<td><i class="fa fa-play add_record"/></td></tr>';
    $("#tbl1 tbody").prepend(html);
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    $(".add_record").on("click", function(){
        var table = $("#tbl1").DataTable();
        var add_row = [];
        var entered_obj = {};
        for (var i = 0, rowLen = uploaded_data_col.length+1; i < rowLen; ++i) {
            var add_val = $($(this).parents('tr').children()[i]).children('input').val();
            add_row.push(add_val);
            var entered_val = $($(this).parents('tr').children()[i+1]).children('input').val();
            entered_obj[uploaded_data_col[i]] = entered_val;
        }
        added_record.push(entered_obj);
        add_row.push('<i class="fa fa-trash remove_record"/>')
        table.row.add(add_row).draw();
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    });
}

function remove_record_from_table(){
	console.log("remove");
    var table = $("#tbl1").DataTable();
    if(table.row('.selected').data() != undefined){
        var index = table.row('.selected').data()[0];
        console.log("from-function-remove-record-from-table");
        console.log(index);
        remove_row_index.push(parseInt(index));
    }
    table.row('.selected').remove().draw(false);
}

$("#prev-button").on("click", function(){
    $(".close_data_popup").trigger("click");
    $("#launch_button").trigger("click");
});

$("#start_training_button").on("click", function(){
    $(".close_data_popup").trigger("click");
    var model_name = $("#model_name").val();
    var train_file_path = uploaded_file_path;

     var formulas = $("input[name='formula[]']")
              .map(function(){return $(this).val();}).get();
    var column_names=[];
     $('select[name="column_name[]"] option:selected').each(function() {
        if($(this).val() != 0) {
          column_names.push($(this).val());
        }
     });
     let columnFormulas = [];
     for(let i = 0; i < column_names.length; i++){
      column_formula = {"columnName" : column_names[i],"Formula" : formulas[i]};
      columnFormulas.push(column_formula);
    }

    document.querySelector('.progress_detail').style.display = "";
    //show progress
    var width = 10;
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
      html += "<td></td>";
      html += "<td></td>";
      html += "<td></td>";
      html += "<td class='text-primary'> in-progress </td>";
      html += "<td></td>";
      html += "</tr>";
      $("#sdv_models_table table tbody").prepend(html);

    var data = new FormData();
    data.append('file_path', train_file_path);
    data.append('model_name', model_name);
    data.append('remove_indexes', JSON.stringify(remove_row_index));
    data.append('added_records', JSON.stringify(added_record));
    data.append('mask_col_list', JSON.stringify(masking_col_array));
    data.append('model_type', $("#sel_model_type").val());
    data.append('batch_size', $("#batch_size").val());
    data.append('epoch_size', $("#epoch_size").val());
    data.append('columnFormulas', JSON.stringify(columnFormulas));
     $.ajax({
        type: "POST",
        url: "/start_sdv_training",
        contentType: false,
        processData: false,
        data: data
    }).then(function (response){
          clearInterval(progressInterval);
          $(".progress_detail .progress-bar").css({ width: "100%", "background-color": "green" });
          $(".progress_detail .progress-bar").html("100% Done");
          document.getElementById('progress_status').innerHTML = "Done !!";
          document.getElementById('progress_status').style.color = "green";
//          update_models_table();
//          document.querySelector('.progress_detail').style.display = "none";
          $('#button_success_popup').trigger('click');
          location.reload();
    })
    .catch((err) => {
      console.error(err);
      update_models_table();
      document.querySelector('.progress_detail').style.display = "none";
      $('#button_failure_popup').trigger('click');
    });

});


function display_particular_data(data) {

    $.ajax({
        type: "POST",
        url: "/get_anonymized_data",
        contentType: false,
        processData: false,
        data: data
    }).then(function (response) {
        if ( $.fn.DataTable.isDataTable('#tbl1') ) {
          $('#tbl1').DataTable().destroy();
        }
		$("#display_rel_data_content").empty();
        var divContainer = document.getElementById("display_rel_data_content");
        divContainer.innerHTML = "";
        var col = [];
        for (var i = 0; i < response.length; i++) {
            for (var key in response[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }
        var html = '<table id="tbl1" class="display" ><thead><tr><th>index</th>';
        for (var i = 0; i < col.length; i++) {
            html += '<th>'+ col[i] + '</th>';
        }
        html+='<th>Action</th></tr></thead><tbody>';
        //<th>1</th><th>2</th><th>3</th></thead><tbody>';
        for (var i = 0, len = response.length; i < len; ++i) {
            html += '<tr><td>'+ i.toString() +'</td>';
            for (var j = 0; j < col.length; ++j) {
                html += '<td>' + response[i][col[j]] + '</td>';
            }
            html += '<td><i class="fa fa-trash remove_record"/></td></tr>';
        }
        html += '</tbody></table>';
        $(html).appendTo('#display_rel_data_content');
        $('#tbl1').dataTable({
            "autoWidth": true,
            "pagingType": "full_numbers",
            "bDestroy": true,
            "scrollY":  "307px",
            "scrollX": true,
            "columnDefs" : [
                { 'visible': false, 'targets': [0] },
                {'width':"20%", "targets":0}
            ],
            "initComplete": function(){
                var rel_table = $('#tbl1').DataTable();
                rel_table.columns.adjust().draw();
              }
        });
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
		setTimeout(function(){
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
            var rel_table = $('#tbl1').DataTable();
            rel_table.columns.adjust().draw();
        }, 500);
		
        $('#display_rel_data_content tbody').on( 'click', 'tr', function () {
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
            var table = $("#tbl1").DataTable();
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
            }
            else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
				console.log(remove_row);
				if(remove_row){
					$('#remove_row_button_rel').trigger("click");
				}
            }
        });
		$(".remove_record").on("click", function(){
            $('#remove_row_button_rel').trigger("click");
			$($.fn.dataTable.tables(true)).DataTable().columns.adjust();
            remove_record_from_table();
        });
		
        $('#remove_row_button_rel').click( function () {
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
            remove_record_from_table();
        });

        $("#add_row_button_rel").on("click", function(){
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
            add_record_to_table(col);
        });
        $(".close_schema_popup").trigger("click");
        $("#display_rel_anonymized_data").trigger("click");
        $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    })
}

$("#display_rel_anonymized_data").on("click", function(){
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
});
$(document).on('show.bs.modal','#display_data_Modal_rel', function () {
  $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
  alert('hi');
})
$('#display_data_Modal_rel').on('shown.bs.modal', function (e) {
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
});
var masking_col_array = [];
$("#next-button_rel").on("click", function(){
    var data = new FormData();
    var t_data=$("#json_property_table_rel tbody tr").map(function() {
          var $cells = $(this).children();
//          debugger;
          var sel_type = $cells.eq(1).find('select option:selected').text();
          if(sel_type != "No Masking Selected"){
              return {
                 propsName: $cells.eq(0).text(),
                 type: $cells.eq(1).find('select option:selected').text()
              };
          }
     });
     data.append('selected_data',JSON.stringify(t_data.toArray()));
//     data.append('file_name', )
     data.append('file_path', uploaded_file_path_list_for_rel[view_button_for_file]);
     data.append('page_number', 0);
     data.append('page_size', 10);
//     display_particular_data(data);
    rel_mask_columns.push(t_data.toArray());
    display_particular_data(data);
});

$("#prev-button-rel").on("click", function(){
    $(".close_data_popup").trigger("click");
    $("#launch_button_rel").trigger("click");
});

$("#start_rel_training_button").on("click", function(){
    $(".close_data_popup").trigger("click");
    var model_name = $("#model_name").val();
});

$("#file_list_submit-button").on("click", function(){
    $(".close_list_popup").trigger("click");

    document.querySelector('.progress_detail').style.display = "";
    //show progress
    var width = 10;
    progressInterval = setInterval(() => {
        width += 2;
        $(".progress_detail .progress-bar").css({ width: width + "%", "background-color": "#0d6efd" });
        $(".progress_detail .progress-bar").html(width + "%");
        if (width >= 90) clearInterval(progressInterval);
    }, 200);
    debugger;
    var model_name = $("#model_name").val();
    //insert top row in tables table
      var html = "<tr>";
      html += "<td>1</td>";
      html += "<td>"+uploaded_metadata_file_path.replace(/^.*[\\\/]/, '')+"</td>";
      html += "<td>"+model_name+"</td>";
      html += "<td>" + new Date().toLocaleString() + "</td>";
      html += "<td>-</td>";
      html += "<td class='text-primary'> in-progress </td>";
      html += "<td></td>";
      html += "</tr>";
      $("#rel_sdv_models_table table tbody").prepend(html);


    var data = new FormData();
    data.append('rel_sdv_train_file_path_arr', uploaded_file_path_list_for_rel);
    data.append('metadata_file_path', uploaded_metadata_file_path);
    data.append('model_name', model_name);
    data.append('mask_columns', JSON.stringify(rel_mask_columns));

     $.ajax({
        type: "POST",
        url: "/start_rel_sdv_training",
        contentType: false,
        processData: false,
        data: data
    }).then(function (response){

            clearInterval(progressInterval);
          $(".progress_detail .progress-bar").css({ width: "100%", "background-color": "green" });
          $(".progress_detail .progress-bar").html("100% Done");
          document.getElementById('progress_status').innerHTML = "Done !!";
          document.getElementById('progress_status').style.color = "green";
          //update_rel_models_table();
          document.querySelector('.progress_detail').style.display = "none";
          $('#button_success_popup').trigger('click');

        })
        .catch((err) => {
              console.error(err);
              update_rel_models_table();
              document.querySelector('.progress_detail').style.display = "none";
              $('#button_failure_popup').trigger('click');
          });

});

$("#previous-button").on("click", function(){
    $(".close_formula_popup").trigger("click");
    $("#display_anonymized_data").trigger("click");
});
$("#next-button2").on("click", function(e){
    $(".close_data_popup").trigger("click");
    $("#display_column_data").trigger("click");
    $("#overlay").css("display","none");
    var formData = new FormData();
    formData.append('file_path', uploaded_file_path);

    fetch("/column_list", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) =>{
        var json_key_list = data.json_key_list;
       var display = document.getElementById('json_key_list');
       var dropdown = document.getElementById("column_fields");
       for (var i = 0; i < json_key_list.length; ++i) {
    // Append the element to the end of Array list
    dropdown[dropdown.length] = new Option(json_key_list[i], json_key_list[i]);
//        }
        }

    });

});

function addRows(){
	var table = document.getElementById('column_list_json');
	var rowCount = table.rows.length;
	var cellCount = table.rows[0].cells.length;
	var row = table.insertRow(rowCount);
	for(var i =0; i <= cellCount; i++){
		var cell = 'cell'+i;
		cell = row.insertCell(i);
		var copycel = document.getElementById('col'+i).innerHTML;
		cell.innerHTML=copycel;
	}
}

function deleteRows(){
	var table = document.getElementById('column_list_json');
	var rowCount = table.rows.length;
	if(rowCount > '3'){
		var row = table.deleteRow(rowCount-1);
		rowCount--;
	}
	else{
		alert('There should be atleast one row');
	}
};

function callFileUpload(){
    $("#file").click();
}
function callFileUpload1(){
    $("#files").click();
}
function callMetaFileUpload(){
    $("#metafile").click();
}



function UploadFile_Single(){
    debugger;

    var a = document.getElementById('file');
    if(a.value == "")
    {
        $("#fileLabel").innerHTML = "No File Selected";
    }
    else{
        var theSplit = a.value.split('\\');
        $("#fileLabel").html(theSplit[theSplit.length-1]);
    }
}
function UploadFile_Multiple(){
    debugger;

    var a1 = document.getElementById('files');
    if(a1.files.length > 0){
    document.getElementById("fileLabel1").innerHTML =  a1.files.length +"files";
    }
    if(a1.value == "")
    {
        $("#fileLabel1").innerHTML = "No File Selected";
    }
    else{
        var theSplit = [...a1.files]
//        $("#fileLabel1").html(theSplit);
//        var theSplit = a.value.split('\\');
        $("#fileLabel").html(theSplit[theSplit.length]);
    }
}


function UploadMetaFile(){
    debugger;

    var a = document.getElementById('metafile');
    if(a.value == "")
    {
        $("#metafileLabel").innerHTML = "No File Selected";
    }
    else{
        var theSplit = a.value.split('\\');
        $("#metafileLabel").html(theSplit[theSplit.length-1]);
    }
}



function progress_bar(model_name) {
  $.ajax({
        type: "GET",
        url: "/progress_bar",
        data: {'model_name':model_name},
    }).then(function (response) {
        console.log(response)
       $("#handle_show_progress").html("<pre>"+(response.data)+"</pre>")
        // $("#modal_view").html(new JSONObject(response.template_models[0].Json).toString(2))
    })
  }






//const fileInput = document.getElementById('aa');
//fileInput.onchange = () => {
//  const selectedFiles = [...fileInput.files];
//    $("#fileLabel").html(selectedFile);
//}
