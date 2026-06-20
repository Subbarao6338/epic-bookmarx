import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from "chart.js";
import { Bar, Line, Scatter } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  TimeScale,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DataLineChart({ dataset, type }) {
  const data_labels = Object.keys(JSON.parse(dataset));
  const data_values = Object.values(JSON.parse(dataset));
  if (type === "Boolean") {
    var count_true = 0;
    var count_false = 0;
    for (var i = 0; i < data_values.length; i++) {
      if (data_values[i] == true) {
        count_true++;
      } else {
        count_false++;
      }
    }
    const data_bool_count = [count_true, count_false];

    const data = {
      labels: ["True", "False"],
      datasets: [
        {
          label: "Data",
          data: data_bool_count,
          borderColor: ["rgb(93, 191, 41)", "rgb(255, 0, 0)"],
          backgroundColor: ["rgba(93, 191, 41, 0.5)", "rgba(255, 0, 0, 0.5)"],
        },
      ],
    };
    const options = {
      indexAxis: "x",
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Data Chart",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "" },
        },
        x: {
          title: { display: true, text: "" },
        },
      },
    };
    return <Bar options={options} data={data} />;
  } else {
    const data = {
      labels: data_labels,
      datasets: [
        {
          label: "Data",
          data: data_values,
          borderColor: "rgb(93, 198, 120)",
          backgroundColor: "rgba(93, 198, 120, 0.5)",
          fill: true,
          borderWidth: 1,
          pointStyle: ".",
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Data Chart",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "" },
        },
        x: {
          title: { display: true, text: "" },
        },
      },
    };
    return <Line options={options} data={data} />;
  }
}
