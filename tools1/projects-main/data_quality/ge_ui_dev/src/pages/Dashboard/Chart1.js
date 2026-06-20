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
import { Bubble, Line, Scatter } from "react-chartjs-2";
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

export default function Chart1({ dataset = [] }) {
  // console.log(dataset);
  // const currentDT = new Date();
  // dataset = dataset.filter(
  //   ({ run_time }) => currentDT - Date.parse(run_time) < 24 * 60 * 60 * 1000
  // );

  const data = {
    labels: dataset.map(({ run_time }) => run_time),
    datasets: [
      {
        label: "DQ Success (%)",
        data: dataset.map(({ value }) => value?.statistics?.success_percent),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        fill: true,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Data Quality vs Time",
      },
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "DQ Success(%)" },
      },
      x: {
        type: "time",
        time: {
          unit: "hour",
        },
        title: { display: true, text: "Validations Result for last 24 hours" },
      },
    },
  };
  return <Line options={options} data={data} />;
}
