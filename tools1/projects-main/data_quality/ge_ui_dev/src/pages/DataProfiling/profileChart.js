import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function profileChart({ dataset = [] }) {
  const labels = ["5%", "25%", "50%", "75%", "95%"];
  const dataset_ls = new Array();
  for (let i = 0; i < 5; i++) {
    dataset_ls.push(dataset[labels[i]]);
  }

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Distribution",
        data: dataset_ls,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
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
        text: "Distribution Chart",
      },
    },
    scales: {
      x: { max: 100, title: { display: false, text: "value" } },
      y: { title: { display: false, text: "values" } },
    },
  };
  return <Bar options={options} data={data} />;
}
