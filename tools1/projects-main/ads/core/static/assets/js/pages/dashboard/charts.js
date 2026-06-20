fetch("/topic_classification", { method: "GET" })
  .then((response) => response.json())
  .then((data1) => {
    var h_data1 = data1.data["Hourly_with_anomaly"];
    var h_data2 = data1.data["Hourly_without_anomaly"];
    var d_data1 = data1.data["Daily_with_anomaly"];
    var d_data2 = data1.data["Daily_without_anomaly"];
    var m_data1 = data1.data["Monthly_with_anomaly"];
    var m_data2 = data1.data["Monthly_without_anomaly"];

    new Chart(document.getElementById("myChart"), {
      type: "bar",
      data: {
        labels: ["Entire", "Change"],
        datasets: [
          {
            label: "Hourly - With Anomaly",
            type: "bar",
            stack: "Hourly",
            backgroundColor: "#ffa700",
            data: h_data1,
          },
          {
            label: "Hourly - Without Anomaly",
            type: "bar",
            stack: "Hourly",
            backgroundColor: "yellow",
            data: h_data2,
          },
          {
            label: "Daily - With Anomaly",
            type: "bar",
            stack: "Daily",
            backgroundColor: "blue",
            data: d_data1,
          },
          {
            label: "Daily - Without Anomaly",
            type: "bar",
            stack: "Daily",
            backgroundColor: "lightblue",
            data: d_data2,
          },
          {
            label: "Monthly - With Anomaly",
            type: "bar",
            stack: "Monthly",
            backgroundColor: "green",
            data: m_data1,
          },
          {
            label: "Monthly - Without Anomaly",
            type: "bar",
            stack: "Monthly",
            backgroundColor: "lightgreen",
            data: m_data2,
          },
        ],
      },
      //  plugins:[ChartDataLabels],
      options: {
        plugins: {
          title: {
            // display: true,
            // text: 'Topics Classification'
            // position:"bottom"
          },
          /* datalabels: {
        color: 'black',
        anchor:'start',
        align:'start',
        labels: {
          title: {
            font: {
            //  weight: 'bold'
            },
          },
          value: {
            color: 'green'
          },
        },
      },*/
          legend: {
            display: true,
            position: "bottom",
          },
        },
        scales: {
          x: {
            display: true,
            stacked: true,
            ticks: {
              beginAtZero: true,
              maxRotation: 0,
              minRotation: 0,
            },
            title: {
              display: true,
              text: "Topic Classification",
            },
            animation: {
              onComplete: function (animation) {
                var firstSet = animation.chart.config.data.datasets[0].data,
                  dataSum = firstSet.reduce(
                    (accumulator, currentValue) => accumulator + currentValue
                  );

                if (typeof firstSet !== "object" || dataSum === 0) {
                  document.getElementById("no-data").style.display = "block";
                  document.getElementById("myChart").style.display = "none";
                }
              },
            },
          },
          y: {
            display: true,
            stacked: true,
            title: {
              display: true,
              text: "Topic Count",
            },
          },
        },
      },
    });
  })
  .catch((err) => {
    console.error(err);
    document.getElementById("myChart").innerHTML = "No data available";
  });
