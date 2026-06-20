$(document).ready(function () {
  get_recent_sdv_models();
  get_recent_rel_sdv_models();
});


fetch("/dataset_counts", { method: 'GET'})
    .then((response) => response.json())
    .then((dataset_counts_results) => {

     var single_model_count = dataset_counts_results.data['single_model_count'];
     var rel_model_count = dataset_counts_results.data['rel_model_count'];
     var single_model_generated = dataset_counts_results.data['single_model_generated'];
     var multiple_model_generated = dataset_counts_results.data['multiple_model_generated'];
    //var y_data = data1.data['count'];
    //console.log("y-data",y_data);
    document.getElementById("Single_Trained_Models").innerHTML = parseInt(single_model_count);
    document.getElementById("Single_Data_Generation_Count").innerHTML = parseInt(single_model_generated)
    document.getElementById("Multiple_Trained_Models").innerHTML = parseInt(rel_model_count)
    document.getElementById("Multiple_Data_Generation_Count").innerHTML = parseInt(multiple_model_generated)
})


function get_recent_sdv_models(data) {
   fetch("/get_recent_sdv_models", { method: 'GET'})
        .then((response) => response.json())
        .then((recent_sdv_models) => {
        console.log(recent_sdv_models.data)
        var response = recent_sdv_models.data;
        var html = '';
        $.each(response, function (index, row) {
         var train_file_name_str = row.train_file;

         if(train_file_name_str.length > 15){

           train_file_name_str = train_file_name_str.substring(0,15)+"...";



         }

         var sdv_model_name_str= row.sdv_model;

           if(sdv_model_name_str.length > 15)

          {

           sdv_model_name_str=  sdv_model_name_str.substring(0,15)+".....";

          }

      

           html+="<tr>";

           html += `<td> ${index + 1} </td>`;

            html += `<td><a href='/download_sdv_file?filetype=temp_files&filename=${row.train_file}'  download title=${row.train_file} >${train_file_name_str}</a></td>`;

           html += `<td><a href='/download_sdv_file?filetype=sdv_models&filename=${row.sdv_model}'   download title=${row.sdv_model}>${sdv_model_name_str}</a></td>`;

          

           //html += `<td><a href='/download_sdv_file?filetype=sdv_models&filename=${row.sdv_model}'   download title=${row.sdv_model}>${sdv_model_str}</a></td>`;

          

          //html += `<td><a href='/download_sdv_file?filetype=sdv_models&filename=${row.sdv_model}' download>${row.sdv_model}</a></td>`;

           html += `<td class="text-center"><a href='/download_sdv_file?filetype=new_files&filename=new_${row.train_file}' download><i class="fa fa-download" aria-hidden="true"></i></a></td>`;

           html+="</tr>";
        })
        $("#reports_models_table").html(html);
   })
   .catch((err) => {
      alert("No data available");
   });
}


function get_recent_rel_sdv_models(data) {
   fetch("/get_recent_rel_sdv_models", { method: 'GET'})
        .then((response) => response.json())
        .then((recent_rel_sdv_models) => {
        console.log(recent_rel_sdv_models.data)
        var response = recent_rel_sdv_models.data;
        var html = '';
        $.each(response, function (index, row) {
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



               html+="<tr>";

               html += `<td> ${index + 1} </td>`;

               

               html += `<td><a href='/download_rel_sdv_file?filetype=metadata&filename=${row.meta_file}' download title=${row.meta_file}>${meta_file_name_str}</a></td>`;

               html += `<td><a href='/download_sdv_file?filetype=sdv_models&filename=${row.sdv_model}'   download title=${row.sdv_model}>${sdv_model_name_str}</a></td>`;

           

               html += `<td class="text-center"><a href='/download_rel_sdv_file?filetype=new_files&filename=result.zip' download><i class="fa fa-download" aria-hidden="true"></i></a></td>`;

               html+="</tr>";
        })
        $("#reports_rel_models_table").html(html);
   })
   .catch((err) => {
      alert("No data available");
   });
}
