fetch("/graviton_classification", { method: "GET" })
  .then((response) => response.json())
  .then((data1) => {
    //console.log("c",data1.data)
    var h_data1 = data1.data["With_Anomaly"];
    var h_data2 = data1.data["Without_Anomaly"];
    labels=['abod','cluster','cof','iforest','histogram','knn','lof','svm','pca','mcd','sod','sos']
    console.log(h_data1)


    new Chart(document.getElementById("myChart1"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "With Anomaly",
            type: "bar",
            stack: "Hourly",
            backgroundColor: "#ffa700",
            data: h_data1,
          },
          {
            label: "Without Anomaly",
            type: "bar",
            stack: "Hourly",
            backgroundColor: "yellow",
            data: h_data2,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            // display: true,
            // text: 'Topics Classification'
            // position:"bottom"
          },
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
              text: "Graviton Classification",
            },
            animation: {
              onComplete: function (animation) {
                var firstSet = animation.chart.config.data.datasets[0].data,
                  dataSum = firstSet.reduce(
                    (accumulator, currentValue) => accumulator + currentValue
                  );

                if (typeof firstSet !== "object" || dataSum === 0) {
                  document.getElementById("no-data").style.display = "block";
                  document.getElementById("myChart1").style.display = "none";
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
    document.getElementById("myChart1").innerHTML = "No data available";
  });
