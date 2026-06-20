fetch("/chart_classification", { method: "GET" })
  .then((response) => response.json())
  .then((data1) => {
    //console.log("c",data1.data)
    console.log(data1)
     console.log(data1.data["Total_Row_Count"])
    var h_data1 = data1.data["Total_Row_Count"];
    var h_data2 = data1.data["Anomaly_Row_count"];
    data_values = []
    data_values.push(h_data1)
    data_values.push(h_data2)
    new Chart("myChart", {
      type: "pie",
      data: {
        labels: ["Total Rows", "Anomalies",],
        datasets: [
          {
            backgroundColor: ["#b91d47","#00aba9"],
            data: data_values,
          }
        ],
      },
      legend: {
            display: true,
            position: "bottom",
          },
        })
});


fetch("/dataset_counts", { method: 'GET'})
    .then((response) => response.json())
    .then((dataset_counts_results) => {
    console.log(dataset_counts_results)
//    console.log(dataset_counts_results.data)
     var Total_Row_Count = dataset_counts_results.data.Database['Total_Row_Count'];
     var Anomaly_Row_count = dataset_counts_results.data.Database['Anomaly_Row_count'];
     var local_total_count = dataset_counts_results.data.Local['Total_Row_Count'];
     var local_Anomaly_Row_count = dataset_counts_results.data.Local['Anomaly_Row_count'];
//     var kafka_total_count = dataset_counts_results.data.Apache_Kafka['Total_Row_Count'];
//     var kafka_Anomaly_Row_count = dataset_counts_results.data.Apache_Kafka['Anomaly_Row_count'];

    document.getElementById("database_total_count").innerHTML = parseInt(Total_Row_Count);
    document.getElementById("database_Anomaly_Row_count").innerHTML = parseInt(Anomaly_Row_count)
    document.getElementById("local_total_count").innerHTML = parseInt(local_total_count);
    document.getElementById("local_Anomaly_Row_count").innerHTML = parseInt(local_Anomaly_Row_count)
//    document.getElementById("kafka_total_count").innerHTML = parseInt(kafka_total_count);
//    document.getElementById("kafka_Anomaly_Row_count").innerHTML = parseInt(kafka_Anomaly_Row_count)

})