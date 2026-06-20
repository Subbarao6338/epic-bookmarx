
fetch("/file_count", { method: 'GET'})
    .then((response) => response.json())
    .then((data1) => {
    console.log("c1",data1.data)
    var y_data = data1.data['count'];
    console.log("y-data",y_data);
    document.getElementById("FileCount").innerHTML = parseInt(y_data[0])
    })





fetch("/anomaly_count_with_anomaly", { method: 'GET'})
    .then((response) => response.json())
    .then((data2) => {
    console.log("c2",data2.data)
    var y_data = data2.data['count_files_anomaly'];
    console.log("y-data",y_data);
    document.getElementById("AnomalyCount").innerHTML = parseInt(y_data[0])
    })







fetch("/anomaly_count", { method: 'GET'})
    .then((response) => response.json())
    .then((data3) => {
    console.log("c3",data3.data)
    var a_data = data3.data['count_anomaly'];
    console.log("a_data",a_data);
    document.getElementById("TopicCount").innerHTML = parseInt(a_data[0])
    })