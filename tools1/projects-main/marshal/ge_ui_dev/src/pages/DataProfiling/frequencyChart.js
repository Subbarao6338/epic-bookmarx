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

export default function FrequencyChart({ dataset }) {
  const data_labels = Object.keys(JSON.parse(dataset));
  const data_values = Object.values(JSON.parse(dataset));
  const unique_val = [...new Set(data_values)];
  var freq_data = {};
  for (var i = 0; i < unique_val.length; i++) {
    let count = data_values.filter((x) => x == unique_val[i]).length;
    freq_data[unique_val[i]] = count;
  }
  const freq = Object.values(freq_data);

  const data = {
    labels: unique_val,
    datasets: [
      {
        label: "Frequency",
        data: freq,
        borderColor: "rgb(61, 137, 255)",
        backgroundColor: "rgba(61, 137, 255, 0.5)",
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
        text: "Frequency Chart",
      },
    },
    scales: {
      y: {
        title: { display: true, text: "" },
      },
      x: {
        title: { display: true, text: "" },
      },
    },
  };
  return <Bar options={options} data={data} />;
}
