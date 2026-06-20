fetch("/anomaly_count", { method: 'GET'})
    .then((response) => response.json())
    .then((data2) => {
    console.log("c2",data2.data)
    var a_data = data2.data['count_anomaly'];
    console.log("a_data",a_data);
    document.getElementById("TopicCount").innerHTML = parseInt(a_data[0])
    })

    fetch("/topic_classification", { method: 'GET'})
    .then((response) => response.json())
    .then((data1) => {
    console.log("c",data1.data)
    var y_data1 = data1.data[0];
    var y_data2 = data1.data[1];
    var y_data3 = data1.data[2];
    var y_data4 = data1.data[3];
    var y_data5 = data1.data[4];
    var y_data6 = data1.data[5];
    console.log(y_data1,y_data2,y_data3,y_data4,y_data4,y_data5,y_data6)
    //c=y_data[0];
    //document.getElementById("FileCount").innerHTML = parseInt(y_data[0])
    //var x_data = data1.data['date'];

    var types=["Entire","Last","Change"]

//data1=no. of daily anomaly where type is entire
//data=[data1,data2,data3]
const anomaly_data = {
    labels: types,
    datasets: [{
      label: "Hourly - With Anomaly",
      type: "bar",
      stack: "Hourly",
      backgroundColor: "#eece01",
      data: y_data1,
    }, {
      label: "Hourly - Without Anomaly",
      type: "bar",
      stack: "Hourly",
      backgroundColor: "#87d84d",
      data: y_data2,
    },
    {
      label: "Daily - With Anomaly",
      type: "bar",
      stack: "Daily",
      backgroundColor: "#eece01",
      data: y_data3,
    }, {
      label: "Daily - Without Anomaly",
      type: "bar",
      stack: "Daily",
      backgroundColor: "#87d84d",
      data: y_data4,
    },
    {
      label: "Monthly - With Anomaly",
      type: "bar",
      stack: "Monthly",
      backgroundColor: "#eece01",
      data: y_data5,
    }, {
      label: "Monthly - Without Anomaly",
      type: "bar",
      stack: "Monthly",
      backgroundColor: "#87d84d",
      data: y_data6,
    }]
  };

console.log("new",anomaly_data);

  const config = {
    type: 'bar',
    data: anomaly_data,
    options: {
    plugins: {
            title: {
                display: true,
                text: 'Topics Classification'
            }
        },
    scales: {
      x: [{
        stacked: true,
        ticks: {
          beginAtZero: true,
          maxRotation: 0,
          minRotation: 0
        }
      }],
      y: [{
        stacked: true,
      }]
    },
  }
  };

  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );

  })
   }

  /*  new Chart(document.getElementById("myChart"), {
  type: 'bar',
  data: {
    labels: ["Entire","Last","Change"],
    datasets: [{
      label: "Hourly - With Anomaly",
      type: "bar",
      stack: "Hourly",
      backgroundColor: "#eece01",
      data: [30, 31, 32, 33, 34, 35, 36],
    }, {
      label: "Hourly - Without Anomaly",
      type: "bar",
      stack: "Hourly",
      backgroundColor: "#87d84d",
      data: [15, 16, 17, 18, 19, 20, 21],
    },
    {
      label: "Daily - With Anomaly",
      type: "bar",
      stack: "Daily",
      backgroundColor: "#eece01",
      data: [30, 31, 32, 33, 34, 35, 36],
    }, {
      label: "Daily - Without Anomaly",
      type: "bar",
      stack: "Daily",
      backgroundColor: "#87d84d",
      data: [15, 16, 17, 18, 19, 20, 21],
    },
    {
      label: "Monthly - With Anomaly",
      type: "bar",
      stack: "Monthly",
      backgroundColor: "#eece01",
      data: [30, 31, 32, 33, 34, 35, 36],
    }, {
      label: "Monthly - Without Anomaly",
      type: "bar",
      stack: "Monthly",
      backgroundColor: "#87d84d",
      data: [15, 16, 17, 18, 19, 20, 21],
    }]
  },
  options: {
  plugins: {
            title: {
                display: true,
                text: 'Topics Classification'
            }
        },
    scales: {
      xAxes: [{
        stacked: true,
        ticks: {
          beginAtZero: true,
          maxRotation: 0,
          minRotation: 0
        }
      }],
      yAxes: [{
        stacked: true,
      }]
    },
  }
});*/
/*new Chart(document.getElementById("myChart1"), {
    type: 'bar',
    data: {
      labels: ["Entire","Last","Change"],
      datasets: [
        {
          label: "Hourly",
          backgroundColor: "#3e95cd",
          data: [133,221,783,2478]
        }, {
          label: "Daily",
          backgroundColor: "#8e5ea2",
          data: [408,547,675,734]
        }, {
          label: "Monthly",
          backgroundColor: "#8e5ec5",
          data: [408,547,675,734]
        },
        {
          label: "Hourly",
          backgroundColor: "#3e95cd",
          data: [133,221,783,2478]
        }, {
          label: "Daily",
          backgroundColor: "#8e5ea2",
          data: [408,547,675,734]
        }, {
          label: "Monthly",
          backgroundColor: "#8e5ec5",
          data: [408,547,675,734]
        },
        {
          label: "Hourly",
          backgroundColor: "#3e95cd",
          data: [133,221,783,2478]
        }, {
          label: "Daily",
          backgroundColor: "#8e5ea2",
          data: [408,547,675,734]
        }, {
          label: "Monthly",
          backgroundColor: "#8e5ec5",
          data: [408,547,675,734]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Topics Classification'
      },
      scales: {
            x: {
                stacked: true,
            }
            }
    }
});


new Chart(document.getElementById("myChart2"), {
    type: 'bar',
    data: {
      labels: ["1900", "1950", "1999", "2050"],
      datasets: [{
          label: "Europe",
          type: "bar",
          borderColor: "#8e5ea2",
          data: [408,547,675,734],
          fill: true
        }, {
          label: "Africa",
          type: "bar",
          borderColor: "#3e95cd",
          data: [133,221,783,2478],
          fill: true
        }, {
          label: "Europe",
          type: "bar",
          backgroundColor: "rgba(0,0,0,0.2)",
          data: [408,547,675,734],
        }, {
          label: "Africa",
          type: "bar",
          backgroundColor: "rgba(0,0,0,0.2)",
          backgroundColorHover: "#3e95cd",
          data: [133,221,783,2478]
        },{
          label: "Hourly",
          backgroundColor: "#3e95cd",
          data: [133,221,783,2478]
        }, {
          label: "Daily",
          backgroundColor: "#8e5ea2",
          data: [408,547,675,734]
        }, {
          label: "Monthly",
          backgroundColor: "#8e5ec5",
          data: [408,547,675,734]
        }
      ]
    },
    options: {
       plugins: {
            title: {
                display: true,
                text: 'Topics Classification'
            }
        },
      legend: { display: true },
      maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true
            }
        }
    }
});
*/