var result = [];
$(document).ready(function () {
  $("#txt_taskname").val("validation_task_" + getFormattedDate());
  read_task_dtl();
  $("#tagnames").val("");
});

function getFormattedDate() {
  var date = new Date();
  var str =
    date.getFullYear() +
    "" +
    (date.getMonth() + 1) +
    "" +
    date.getDate() +
    "" +
    date.getHours() +
    "" +
    date.getMinutes() +
    "" +
    date.getSeconds();
  return str;
}

$("#ddl_tasktype").on("change", function (event) {
  debugger;
  var a = $(this).val();
  if (a == "1") {
    $("#fileUpload").click();
  }
});

var uploaded_filename = "";
function upload_val_logfile() {
  debugger;
  var a = document.getElementById("fileUpload");
  if (a.value == "") {
    alert("No File Selected");
  } else {
    var theSplit = a.value.split("\\");
    console.log(theSplit);
    lbl_filename.innerHTML = theSplit[theSplit.length - 1];

    var form_data = new FormData();
    for (var i = 0; i < $("#fileUpload").get(0).files.length; ++i) {
      form_data.append("log_files[]", $("#fileUpload").get(0).files[i]);
    }
    console.log(form_data);
    $.ajax({
      url: "/upload_logvalidation_files",
      type: "POST",
      data: form_data,
      async: false,
      cache: false,
      contentType: false,
      enctype: "multipart/form-data",
      processData: false,
      success: function (data, textStatus) {
        filename = data[0]["FileName"];
        uploaded_filename = data[0]["Uploaded_filename"];
        //alert(filename);
        //alert(uploaded_filename);
      },
    });
  }
}

function save_dtl() {
  form_data = new FormData();
  form_data.data = {};
  //form_data.data.filename = $("#lbl_filename").text();
  form_data.data.filename = uploaded_filename;
  form_data.data.taskname = $("#txt_taskname").val();
  form_data.data.tagnames = $("#tagnames").val();
  form_data.data.regexexpr = $("#txt_regexexpr").val();
  form_data.data.status = "Pending";
  form_data.data.tasktype = $("#ddl_tasktype option:selected").text();
  form_data.data.sel_task_name = task_name;
  form_data.data.result_type = training_type;
  form_data.data.log_delimeter = $("#txt_delimeter").val();

  $.ajax({
    type: "POST",
    url: "/save_task_dtl",
    dataType: "json",
    data: { req_data: JSON.stringify(form_data) },
    success: function (data, textStatus) {
      read_task_dtl();
      alert(data[0]["Message"]);
      $("#ddl_tasktype").val("0");
      $("#txt_taskname").val("");
      $("#txt_regexexpr").val("");
      $("#lbl_filename8").text("No File Selected");
      $("#tagnames").val("");
    },
    error: function (xhr, status, e) {
      alert(status, e);
    },
  });
}

function read_logval_file(filename, tagnames, regexexpr, taskid) {
  $.get(
    "/read_logval_files",
    {
      filename: filename,
      tagnames: tagnames,
      regexexpr: regexexpr,
      taskid: taskid,
    },
    function (data) {
      update_task_status(taskid, "Completed");
      alert(data[0]["Message"]);
    }
  );
}

function read_task_dtl() {
  $.get("/read_task_dtl", function (data) {
    //alert(data[0].Result);
    response = data[0].Result;
    console.log(response);
    task_dtl = "";
    $("#tbl_taskdtl tr").remove();
    for (i = 0; i < response.length; i++) {
      if (response[i][9] == "ML Model") {
        response[i][9] = "DL Model";
      }
      //           task_dtl=task_dtl+'<tr><td>'+(i+1)+'</td><td>'+response[i][1]+'</td><td>'+response[i][3]+'</td><td>'+response[i][8]+'</td><td>'+response[i][9]+'</td><td>'+response[i][6]+'</td><td><button type="button" class="btn bg-navy btn-sm btn_start" title="Run" custom-attr="'+response[i][2]+'" taskid="'+response[i][0]+'" regexpr="'+response[i][5]+'" tagnames="'+response[i][4]+'"><img src="/static/assets/img/re-run.png" width=18 height=18 /></button>&nbsp;&nbsp; <button type="button" class="btn btn-info btn-sm btn_view_result" title="View" filename="'+response[i][2]+'" custom-attr="'+response[i][0]+'"><i class="fa fa-eye"></i></button> &nbsp;&nbsp; <button type="button" class="btn btn-info btn-sm btn_delete_record" title="Delete" taskid="'+response[i][0]+'"><i class="fa fa-trash"></i></button></td></tr>';
      task_dtl =
        task_dtl +
        "<tr><td>" +
        (i + 1) +
        "</td><td>" +
        response[i][1] +
        "</td><td>" +
        response[i][3] +
        "</td><td>" +
        response[i][8] +
        "</td><td>" +
        response[i][9] +
        "</td><td>" +
        response[i][6] +
        '</td><td><button type="button" class="btn bg-navy btn-sm btn_start" title="Run" custom-attr="' +
        response[i][2] +
        '" taskid="' +
        response[i][0] +
        '" regexpr="' +
        response[i][5] +
        '" tagnames="' +
        response[i][4] +
        '"><img src="/static/assets/img/re-run.png" width=18 height=18 /></button>&nbsp;&nbsp; <button type="button" class="btn btn-info btn-sm btn_view_result" title="View" filename="' +
        response[i][2] +
        '" custom-attr="' +
        response[i][0] +
        '"><i class="fa fa-eye"></i></button> &nbsp;&nbsp; <a class="btn btn-success btn-sm btn_download" title="Download" download custom-attr="' +
        response[i][0] +
        '"  status="' +
        response[i][6] +
        '" filename="' +
        response[i][2] +
        '"><img src="/static/assets/img/download.png" width=18 height=18 /></a>&nbsp;&nbsp; <button type="button" class="btn btn-info btn-sm btn_delete_record" title="Delete" taskid="' +
        response[i][0] +
        '"><i class="fa fa-trash"></i></button></td></tr>';
    }
    $("#tbl_taskdtl").append(task_dtl);

    $(".btn_start").on("click", function (event) {
      var taskid = $(this).attr("taskid");

      //             update_task_status(taskid, 'InProgress');

      var filename = $(this).attr("custom-attr");
      var tagnames = $(this).attr("tagnames");
      var regexpr = $(this).attr("regexpr");
      read_logval_file(filename, tagnames, regexpr, taskid);

      //read_task_dtl();
    });

    $(".btn_view_result").on("click", function () {
      var file_name = $(this).attr("filename");
      ShowValidationResult(file_name);
    });

    $(".btn_delete_record").on("click", function () {
      var taskid = $(this).attr("taskid");
      DeleteValidationTask(taskid);
    });

    $(".btn_download").on("click", function (event) {
      status = $(this).attr("status");
      if (status == "Completed") {
        event.preventDefault();
        var taskid = $(this).attr("custom-attr");
        var filename = $(this).attr("filename");
        filename = filename.split(".")[0];
        console.log(filename);
        //result_filename = filename + taskid;
        result_filename = filename;
        console.log(result_filename);
        DownloadValidationResult(result_filename + ".csv");
        //          window.location.href = "http://127.0.0.1:8000/static/OutputCSV/"+result_filename+".csv";
      }
    });

    //         $(".btn_restart").on("click",function(event){
    //
    //             var taskid= $(this).attr("taskid");
    //             console.log(taskid);
    //             update_task_status(taskid, 'InProgress');
    //             //read_task_dtl();
    //
    //             var filename= $(this).attr("custom-attr");
    //             var regexpr= $(this).attr("regexpr");
    //             read_logval_file(filename,regexpr,taskid);
    //             update_task_status(taskid, 'Completed');
    //             //read_task_dtl();
    //        });
  });
}

function DownloadValidationResult(file_name) {
  $.get(
    "/download_validation_result",
    { file_name: file_name },
    function (response) {
      var encodedUri = encodeURI("data:text/csv;charset=utf-8," + response);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", file_name);
      link.click();
    }
  );
}

$("#btnTaskList").on("click", function () {
  ViewTaskList();
  //$('#view_tasklist').modal('show');
});

function DeleteValidationTask(taskid) {
  Swal.fire({
    title: "Are you sure?",
    text: "You will not be able to recover this Validation Task!",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, delete it!",
    denyButtonText: "No, cancel plx!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.get(
        "/delete_validation_task",
        { task_id: taskid },
        function (response) {
          read_task_dtl();
        }
      );
    }
  });
}

function ShowValidationResult(file_name) {
  $.get(
    "/get_validation_result",
    { file_name: file_name },
    function (response) {
      var col = [];
      for (var i = 0; i < response.length; i++) {
        for (var key in response[i]) {
          if (col.indexOf(key) === -1) {
            col.push(key);
          }
        }
      }
      var table = document.createElement("table");
      table.id = "validation_result_table";
      table.classList.add("table");
      ``;
      table.classList.add("table-bordered");
      var tr = table.insertRow(-1);
      for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th"); // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
      }
      for (var i = 0; i < response.length; i++) {
        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
          var tabCell = tr.insertCell(-1);
          tabCell.innerHTML = response[i][col[j]];
        }
      }
      var divContainer = $(".log_val_result");
      divContainer.html("");
      divContainer.append(table);
      $("#view-validation-Result").modal("show");
    }
  );
}

function ViewTaskList() {
  $.get("/gettasklist", function (response) {
    $(".task_list").empty();
    var html = "";
    var html1 = "";
    var html1 =
      '<table id="logresultTable"  class="table table-bordered"><thead><tr><th scope="col">Select</th><th scope="col">Task Id</th><th scope="col">Result Type</th><th scope="col">Tag Name</th><th scope="col">Java Expression</th><th scope="col">Python/JS Expression</th></tr></thead>';
    html2 = "";
    for (var k = 0; k < response.length; k++) {
      if (response.length > 0) {
        var aa = response[k].results;
        var training_type = response[k].training_type;
        if (training_type == "ML Model") {
          if (aa != "") {
            var parsed_result = JSON.parse(aa);
            var myobj = JSON.stringify(parsed_result);
            var result_type = "DL Model";
            html2 =
              html2 +
              '<tr width="100%"><td rowspan="' +
              parsed_result.length +
              '"><input type="radio" training_type="' +
              response[k].training_type +
              '" id="task' +
              k +
              '" name="rad_task" value="' +
              response[k].taskname +
              '"  class="vw_tasklist" data-pattern=' +
              myobj +
              '></td><td rowspan="' +
              parsed_result.length +
              '"><label for="task' +
              k +
              '">' +
              response[k].taskname +
              '</label></td><td rowspan="' +
              parsed_result.length +
              '"><label for="task' +
              k +
              '">' +
              result_type +
              "</label></td>";
            html3 = "";
            for (var i = 0; i < parsed_result.length; i++) {
              html3 =
                html3 +
                `<td>${
                  parsed_result[i] == "ML Model" ? "DL Model" : parsed_result[i]
                }</td></tr>`;
            }
            html2 = html2 + html3;
          }
        } else {
          var result = JSON.parse(aa)["result"];
          var parsed_result = JSON.parse(result);
          var myobj = JSON.stringify(parsed_result);
          html2 =
            html2 +
            '<tr width="100%"><td rowspan="' +
            parsed_result.length +
            '"><input type="radio" training_type="' +
            response[k].training_type +
            '" id="task' +
            k +
            '" name="rad_task" value="' +
            response[k].taskname +
            '"  class="vw_tasklist" data-pattern=' +
            myobj +
            '></td><td rowspan="' +
            parsed_result.length +
            '"><label for="task' +
            k +
            '">' +
            response[k].taskname +
            '</label></td><td rowspan="' +
            parsed_result.length +
            '"><label for="task' +
            k +
            '">' +
            response[k].training_type +
            "</label></td>";
          html3 = "";
          for (var i = 0; i < parsed_result.length; i++) {
            var aa = parsed_result[i];
            for (var key in aa) {
              html3 =
                html3 +
                `<td>${key}</td><td>${aa[key]["solutionJAVA"]}</td><td>${aa[key]["solutionJS"]}</td></tr>`;
            }
          }
          html2 = html2 + html3;
        }
      }
    }
    html = html1 + html2 + "</table></div>";
    $(".task_list").append(html);
    $("#view_tasklist").modal("show");
  });
}

var task_name = "";
var training_type = "";
$(document).on("click", ".vw_tasklist", function () {
  task_name = $(this).val();
  training_type = $(this).attr("training_type");
  if (training_type == "Regular Expression") {
    $.get("/getresults_api", { task_name: task_name }, function (response) {
      console.log(JSON.parse(response));
      var result = JSON.parse(response)["result"];
      var parsed_result = JSON.parse(result);
      var regexstr = "";
      var tagstr = "";
      for (var k = 0; k < parsed_result.length; k++) {
        var aa = parsed_result[k];
        for (var key in aa) {
          var tagname = key;
          var pythonpattern = aa[key]["solutionJS"];
          regexstr = regexstr + pythonpattern + "\n";
          tagstr = tagstr + tagname + "\n";
        }
      }
      $("#txt_regexexpr").val(regexstr);
      $("#txt_regexexpr").css("display", "block");
      $("#lbl_ml_model").css("display", "none");
      $("#tagnames").val(tagstr);
      $("#view_tasklist").modal("hide");
    });
  } else {
    $("#txt_regexexpr").val("");
    $("#txt_regexexpr").css("display", "none");
    $("#lbl_ml_model").css("display", "block");
    $("#view_tasklist").modal("hide");
  }
});

function display_regex_pattern() {
  debugger;
}

var objJson = [];
function read_log_file(filename) {
  $.get("/read_logfiles", { filename: filename }, function (data) {
    for (i = 0; i < data.length; i++) {
      var obj = {
        sno: i + 1,
        logData: data[i],
      };
      objJson.push(obj);
    }
  });
}

$("#btnSaveTask").on("click", function (event) {
  save_dtl();
});

function update_task_status(taskid, status) {
  $.ajax({
    type: "POST",
    url: "/update_task_status",
    dataType: "json",
    data: { taskid: taskid, status: status },
    success: function (data, textStatus) {
      //alert(data[0]["Message"]);
      read_task_dtl();
    },
    error: function (xhr, status, e) {
      alert(status, e);
    },
  });
}
