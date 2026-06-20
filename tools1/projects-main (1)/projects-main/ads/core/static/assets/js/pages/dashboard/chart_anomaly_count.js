fetch("/file_count", { method: 'GET'})
    .then((response) => response.json())
    .then((data1) => {
    console.log(data1.data)
    var y_data = data1.data['count'];
    var x_data = data1.data['date'];
    var barColors = ["#b91d47","#00aba9","#2b5797","#e8c3b9","#1e7145"];


const data = {
    labels: x_data,
    datasets: [{
      label: 'File Count',
      backgroundColor: barColors,

      data: y_data,
    }]
  };

console.log(data);

  const config = {
    type: 'bar',
    data: data,
    options: {}
  };

  const config1 = {
    type: 'line',
    data: data,
    options: {}
  };

  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
  const myChart1 = new Chart(
    document.getElementById('myChart1'),
    config1
  );


  })
    .catch((err) => {
      console.error(err);
    });

